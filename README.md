# Truck Management API

A comprehensive Go backend for truck management with multi-tenancy, real-time tracking, and Swagger API documentation.

## Features

- **Multi-tenant Architecture**: Each company has isolated data access
- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Real-time Tracking**: WebSocket support for live truck location updates
- **Truck Management**: Full CRUD operations for trucks with filtering and pagination
- **Visit Management**: Track customer visits with tasks and status updates
- **Request System**: Handle requests with approval/termination workflow
- **Cargo Management**: Complete cargo lifecycle management with tracking
- **Swagger Documentation**: Complete API documentation at `/swagger/index.html`

## Architecture

### Database Models
- **Users**: Authentication and role management
- **Companies**: Multi-tenant isolation
- **Trucks**: Fleet management with real-time location tracking
- **Visits**: Customer visit tracking with tasks
- **Requests**: Approval workflow system
- **Cargo**: Shipment management with assignment and tracking
- **Cargo Events**: Detailed tracking history for each shipment

### API Endpoints

#### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login

#### Companies
- `POST /api/v1/companies` - Create company
- `GET /api/v1/companies` - List companies
- `GET /api/v1/companies/{id}` - Get company details
- `PUT /api/v1/companies/{id}` - Update company
- `DELETE /api/v1/companies/{id}` - Delete company

#### Trucks (Tenant-aware)
- `POST /api/v1/trucks` - Add new truck
- `GET /api/v1/trucks` - List trucks with filtering
- `GET /api/v1/trucks/{id}` - Get truck details
- `PUT /api/v1/trucks/{id}` - Update truck
- `DELETE /api/v1/trucks/{id}` - Remove truck
- `POST /api/v1/trucks/{id}/location` - Update truck location
- `GET /api/v1/trucks/online` - Get online trucks

#### Visits
- `POST /api/v1/visits` - Create visit
- `GET /api/v1/visits` - List visits
- `GET /api/v1/visits/{id}` - Get visit details
- `PUT /api/v1/visits/{id}` - Update visit status

#### Tasks
- `POST /api/v1/tasks` - Create task
- `GET /api/v1/tasks` - Get tasks by visit
- `GET /api/v1/tasks/{id}` - Get task details
- `PUT /api/v1/tasks/{id}/complete` - Complete task

#### Requests
- `POST /api/v1/requests` - Submit request
- `GET /api/v1/requests` - List requests
- `PUT /api/v1/requests/{id}/accept` - Accept request (moderator)
- `PUT /api/v1/requests/{id}/terminate` - Terminate request (moderator)

#### Cargo (Tenant-aware)
- `POST /api/v1/cargo` - Create new cargo
- `GET /api/v1/cargo` - List cargo with filtering
- `GET /api/v1/cargo/unassigned` - Get unassigned cargo
- `GET /api/v1/cargo/{id}` - Get cargo details
- `PUT /api/v1/cargo/{id}` - Update cargo
- `DELETE /api/v1/cargo/{id}` - Delete cargo
- `POST /api/v1/cargo/{id}/assign` - Assign cargo to truck
- `POST /api/v1/cargo/{id}/unassign` - Unassign cargo from truck
- `POST /api/v1/cargo/{id}/events` - Create cargo tracking event
- `GET /api/v1/cargo/{id}/events` - Get cargo tracking history
- `GET /api/v1/trucks/{truck_id}/cargo` - Get cargo assigned to truck
- `GET /api/v1/cargo/track/{tracking_number}` - Public cargo tracking

#### WebSocket
- `GET /api/v1/ws` - WebSocket connection for real-time updates

## Environment Variables

Create a `.env` file:

```env
DATABASE_URL=postgres://user:password@localhost:5432/truck_management?sslmode=disable
JWT_SECRET=your-super-secret-jwt-key
PORT=8080
```

## Getting Started

1. Install dependencies:
```bash
go mod tidy
```

2. Set up PostgreSQL database

3. Run the application:
```bash
go run main.go
```

4. Access Swagger documentation at: `http://localhost:8080/swagger/index.html`

## Real-time Features

The system supports real-time truck location updates via WebSocket. Connect to `/api/v1/ws` with your company ID to receive live updates for:
- Truck location changes
- Status updates
- Visit notifications
- Cargo assignments and status changes
- Cargo tracking events
- Real-time cargo location updates during transit
- Delivery notifications and progress updates

## Multi-tenancy

All truck and cargo-related data is isolated by company. Users can only access data belonging to their company, ensuring complete data separation between tenants.

## Role-based Access Control

- **Admin**: Full system access
- **Moderator**: Can approve/reject requests, manage trucks
- **Moderator**: Can assign/unassign cargo, manage shipments
- **Driver**: Can update truck locations, manage assigned visits
- **Driver**: Can create cargo tracking events (pickup, delivery)
- **User**: Basic access to company data