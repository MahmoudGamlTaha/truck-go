package main

import (
	"log"
	"truck-management/config"
	"truck-management/docs"
	"truck-management/internal/handlers"
	"truck-management/internal/middleware"
	"truck-management/internal/repositories"
	"truck-management/internal/services"
	"truck-management/internal/websocket"

	"github.com/gin-gonic/gin"
	swaggerfiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

// @title Truck Management API
// @version 1.0
// @description Multi-tenant truck management system with real-time tracking
// @termsOfService http://swagger.io/terms/

// @contact.name API Support
// @contact.url http://www.swagger.io/support
// @contact.email support@swagger.io

// @license.name Apache 2.0
// @license.url http://www.apache.org/licenses/LICENSE-2.0.html

// @host localhost:8080
// @BasePath /api/v1

// @securityDefinitions.apikey BearerAuth
// @in header
// @name Authorization
// @description Type "Bearer" followed by a space and JWT token.

func main() {
	// Initialize database
	db := config.InitDatabase()

	// Auto-migrate models
	/*err := db.AutoMigrate(
		&models.User{},
		&models.Company{},
		&models.Branch{},
		&models.Truck{},
		&models.TruckLocation{},
		&models.Visit{},
		&models.Task{},
		&models.Request{},
		&models.Route{},
		&models.RouteStop{},
		&models.Cargo{},
		&models.CargoEvent{},
	)
	if err != nil {
		log.Fatal("Failed to migrate database:", err)
	}*/

	// Initialize repositories
	userRepo := repositories.NewUserRepository(db)
	companyRepo := repositories.NewCompanyRepository(db)
	branchRepo := repositories.NewBranchRepository(db)
	truckRepo := repositories.NewTruckRepository(db)
	visitRepo := repositories.NewVisitRepository(db)
	taskRepo := repositories.NewTaskRepository(db)
	requestRepo := repositories.NewRequestRepository(db)
	routeRepo := repositories.NewRouteRepository(db)
	cargoRepo := repositories.NewCargoRepository(db)

	// Initialize services
	authService := services.NewAuthService(userRepo)
	companyService := services.NewCompanyService(companyRepo)
	branchService := services.NewBranchService(branchRepo)
	userService := services.NewUserService(userRepo)
	truckService := services.NewTruckService(truckRepo)
	visitService := services.NewVisitService(visitRepo)
	taskService := services.NewTaskService(taskRepo)
	requestService := services.NewRequestService(requestRepo)
	routeService := services.NewRouteService(routeRepo, truckRepo)
	cargoService := services.NewCargoService(cargoRepo, truckRepo)

	// Initialize WebSocket hub
	wsHub := websocket.NewHub()
	go wsHub.Run()

	// Initialize handlers
	authHandler := handlers.NewAuthHandler(authService)
	companyHandler := handlers.NewCompanyHandler(companyService)
	branchHandler := handlers.NewBranchHandler(branchService)
	userHandler := handlers.NewUserHandler(userService)
	truckHandler := handlers.NewTruckHandler(truckService, wsHub, taskService)
	visitHandler := handlers.NewVisitHandler(visitService)
	taskHandler := handlers.NewTaskHandler(taskService)
	requestHandler := handlers.NewRequestHandler(requestService)
	routeHandler := handlers.NewRouteHandler(routeService)
	cargoHandler := handlers.NewCargoHandler(cargoService, wsHub)
	wsHandler := handlers.NewWebSocketHandler(wsHub)

	// Setup router
	router := gin.Default()

	// Swagger docs
	docs.SwaggerInfo.BasePath = "/api/v1"
	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerfiles.Handler))

	// CORS middleware
	router.Use(middleware.CORSMiddleware())

	// API routes
	v1 := router.Group("/api/v1")
	{
		// Auth routes
		auth := v1.Group("/auth")
		{
			auth.POST("/register", authHandler.Register)
			auth.POST("/login", authHandler.Login)
		}

		// Protected routes
		protected := v1.Group("/")
		protected.Use(middleware.AuthMiddleware())
		{
			// Company routes (Admin only)
			companies := protected.Group("/companies")
			companies.Use(middleware.AdminMiddleware())
			{
				companies.POST("", companyHandler.CreateCompany)
				companies.GET("", companyHandler.GetCompanies)
				companies.GET("/:id", companyHandler.GetCompany)
				companies.PUT("/:id", companyHandler.UpdateCompany)
				companies.DELETE("/:id", companyHandler.DeleteCompany)
			}

			// Branch routes (Admin only)
			branches := protected.Group("/branches")
			branches.Use(middleware.TenantMiddleware())
			branches.Use(middleware.AdminMiddleware())
			{
				branches.POST("", branchHandler.CreateBranch)
				branches.GET("", branchHandler.GetBranches)
				branches.GET("/:id", branchHandler.GetBranch)
				branches.PUT("/:id", branchHandler.UpdateBranch)
				branches.DELETE("/:id", branchHandler.DeleteBranch)
			}

			// User management routes (Admin only)
			users := protected.Group("/users")
			users.Use(middleware.TenantMiddleware())
			users.Use(middleware.AdminMiddleware())
			{
				users.POST("", userHandler.CreateUser)
				users.GET("", userHandler.GetUsers)
				users.GET("/drivers", userHandler.GetDrivers)
				users.GET("/:id", userHandler.GetUser)
				users.PUT("/:id", userHandler.UpdateUser)
				users.DELETE("/:id", userHandler.DeleteUser)
				users.POST("/:driver_id/assign-truck", userHandler.AssignTruckToDriver)
			}

			// Truck routes (tenant-aware)
			trucks := protected.Group("/trucks")
			trucks.Use(middleware.TenantMiddleware())
			{
				// Admin can create trucks
				trucks.POST("", middleware.AdminMiddleware(), truckHandler.CreateTruck)
				trucks.GET("", truckHandler.GetTrucks) // Drivers see only their truck
				trucks.GET("/:id", truckHandler.GetTruck)
				trucks.PUT("/:id", middleware.AdminMiddleware(), truckHandler.UpdateTruck)
				trucks.DELETE("/:id", middleware.AdminMiddleware(), truckHandler.DeleteTruck)
				trucks.POST("/:id/location", middleware.DriverMiddleware(), truckHandler.UpdateTruckLocation)
				trucks.PUT("/:id/approve", middleware.ModeratorMiddleware(), truckHandler.ApproveTruck)
				trucks.GET("/online", truckHandler.GetOnlineTrucks)
				trucks.GET("/my-truck", middleware.DriverMiddleware(), truckHandler.GetDriverTruck)
			}

			// Route routes
			routes := protected.Group("/routes")
			routes.Use(middleware.TenantMiddleware())
			{
				routes.POST("", middleware.ModeratorMiddleware(), routeHandler.CreateRoute)
				routes.GET("", routeHandler.GetRoutes) // Drivers see only their routes
				routes.GET("/:id", routeHandler.GetRoute)
				routes.PUT("/:id", middleware.ModeratorMiddleware(), routeHandler.UpdateRoute)
				routes.PUT("/:id/approve", middleware.ModeratorMiddleware(), routeHandler.ApproveRoute)
				routes.DELETE("/:id", middleware.ModeratorMiddleware(), routeHandler.DeleteRoute)
				routes.POST("/:id/stops", middleware.ModeratorMiddleware(), routeHandler.CreateRouteStop)
				routes.GET("/:id/stops", routeHandler.GetRouteStops)
			}

			// Route stop completion (Driver only)
			protected.PUT("/route-stops/:id/complete", middleware.DriverMiddleware(), routeHandler.CompleteRouteStop)

			// Visit routes
			visits := protected.Group("/visits")
			visits.Use(middleware.TenantMiddleware())
			{
				visits.POST("", middleware.ModeratorMiddleware(), visitHandler.CreateVisit)
				visits.GET("", visitHandler.GetVisits)
				visits.GET("/:id", visitHandler.GetVisit)
				visits.PUT("/:id", middleware.ModeratorMiddleware(), visitHandler.UpdateVisit)
			}

			// Task routes
			tasks := protected.Group("/tasks")
			tasks.Use(middleware.TenantMiddleware())
			{
				tasks.POST("", middleware.ModeratorMiddleware(), taskHandler.CreateTask)
				tasks.GET("", taskHandler.GetTasks)
				tasks.GET("/:id", taskHandler.GetTask)
				tasks.PUT("/:id", middleware.ModeratorMiddleware(), taskHandler.UpdateTask)
				tasks.PUT("/:id/complete", middleware.DriverMiddleware(), taskHandler.CompleteTask)
			}

			// Request routes
			requests := protected.Group("/requests")
			requests.Use(middleware.TenantMiddleware())
			{
				requests.POST("", requestHandler.CreateRequest)
				requests.GET("", requestHandler.GetRequests)
				requests.PUT("/:id/accept", middleware.ModeratorMiddleware(), requestHandler.AcceptRequest)
				requests.PUT("/:id/terminate", middleware.ModeratorMiddleware(), requestHandler.TerminateRequest)
			}

			// Cargo routes
			cargo := protected.Group("/cargo")
			cargo.Use(middleware.TenantMiddleware())
			{
				cargo.POST("", middleware.ModeratorMiddleware(), cargoHandler.CreateCargo)
				cargo.GET("", cargoHandler.GetCargos)
				cargo.GET("/unassigned", middleware.ModeratorMiddleware(), cargoHandler.GetUnassignedCargos)
				cargo.GET("/:id", cargoHandler.GetCargo)
				cargo.PUT("/:id", middleware.ModeratorMiddleware(), cargoHandler.UpdateCargo)
				cargo.DELETE("/:id", middleware.ModeratorMiddleware(), cargoHandler.DeleteCargo)
				cargo.POST("/:id/assign", middleware.ModeratorMiddleware(), cargoHandler.AssignCargoToTruck)
				cargo.POST("/:id/unassign", middleware.ModeratorMiddleware(), cargoHandler.UnassignCargoFromTruck)
				cargo.POST("/:id/events", middleware.DriverMiddleware(), cargoHandler.CreateCargoEvent)
				cargo.GET("/:id/events", cargoHandler.GetCargoEvents)
				cargo.POST("/:id/location", middleware.DriverMiddleware(), cargoHandler.UpdateCargoLocation)
				cargo.GET("/:id/route", cargoHandler.GetCargoRoute)
			}

			// Truck cargo routes
			cargo.GET("/trucks/:truck_id/cargo", middleware.TenantMiddleware(), cargoHandler.GetCargosByTruck)
			cargo.GET("/trucks/:truck_id/nearby-cargo", middleware.TenantMiddleware(), middleware.DriverMiddleware(), cargoHandler.GetNearbyCargoForTruck)
		}

		// Public cargo tracking
		v1.GET("/cargo/track/:tracking_number", cargoHandler.GetCargoByTracking)
		v1.GET("/cargo/track/:tracking_number/details", cargoHandler.GetCargoTracking)

		// WebSocket endpoint
		v1.GET("/ws", wsHandler.HandleWebSocket)
	}

	log.Println("Server starting on :8080")
	router.Run(":8080")
}
