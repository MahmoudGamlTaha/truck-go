package services

import (
	"time"
	"truck-management/internal/models"
	"truck-management/internal/repositories"
)

type CargoService struct {
	cargoRepo *repositories.CargoRepository
	truckRepo *repositories.TruckRepository
}

func NewCargoService(cargoRepo *repositories.CargoRepository, truckRepo *repositories.TruckRepository) *CargoService {
	return &CargoService{
		cargoRepo: cargoRepo,
		truckRepo: truckRepo,
	}
}

func (s *CargoService) CreateCargo(companyID uint, req models.CreateCargoRequest) (*models.Cargo, error) {
	trackingNumber, err := s.cargoRepo.GenerateTrackingNumber(companyID)
	if err != nil {
		return nil, err
	}

	cargo := &models.Cargo{
		CompanyID:            companyID,
		TrackingNumber:       trackingNumber,
		Title:                req.Title,
		Description:          req.Description,
		Type:                 req.Type,
		Priority:             req.Priority,
		Status:               models.CargoStatusPending,
		Weight:               req.Weight,
		Volume:               req.Volume,
		Value:                req.Value,
		Currency:             req.Currency,
		OriginAddress:        req.OriginAddress,
		OriginLatitude:       req.OriginLatitude,
		OriginLongitude:      req.OriginLongitude,
		OriginContact:        req.OriginContact,
		OriginPhone:          req.OriginPhone,
		DestinationAddress:   req.DestinationAddress,
		DestinationLatitude:  req.DestinationLatitude,
		DestinationLongitude: req.DestinationLongitude,
		DestinationContact:   req.DestinationContact,
		DestinationPhone:     req.DestinationPhone,
		PickupTime:           req.PickupTime,
		DeliveryTime:         req.DeliveryTime,
		EstimatedDelivery:    req.EstimatedDelivery,
		Instructions:         req.Instructions,
		SpecialHandling:      req.SpecialHandling,
	}

	if cargo.Currency == "" {
		cargo.Currency = "USD"
	}
	if cargo.Type == "" {
		cargo.Type = models.CargoTypeGeneral
	}
	if cargo.Priority == "" {
		cargo.Priority = models.CargoPriorityMedium
	}

	err = s.cargoRepo.Create(cargo)
	if err != nil {
		return nil, err
	}

	// Create initial event
	event := &models.CargoEvent{
		CargoID:     cargo.ID,
		EventType:   "created",
		Description: "Cargo created and ready for assignment",
		Location:    cargo.OriginAddress,
		Latitude:    cargo.OriginLatitude,
		Longitude:   cargo.OriginLongitude,
		Timestamp:   time.Now(),
	}
	s.cargoRepo.CreateEvent(event)

	return s.cargoRepo.GetByID(cargo.ID, companyID)
}

func (s *CargoService) GetCargos(companyID uint, filter models.CargoFilter) ([]models.Cargo, int64, error) {
	return s.cargoRepo.GetByCompanyID(companyID, filter)
}

func (s *CargoService) GetCargo(id uint, companyID uint) (*models.Cargo, error) {
	return s.cargoRepo.GetByID(id, companyID)
}

func (s *CargoService) GetCargoByTracking(trackingNumber string) (*models.Cargo, error) {
	return s.cargoRepo.GetByTrackingNumber(trackingNumber)
}

func (s *CargoService) UpdateCargo(id uint, companyID uint, req models.UpdateCargoRequest) (*models.Cargo, error) {
	cargo, err := s.cargoRepo.GetByID(id, companyID)
	if err != nil {
		return nil, err
	}

	oldStatus := cargo.Status

	// Update fields
	if req.Title != "" {
		cargo.Title = req.Title
	}
	if req.Description != "" {
		cargo.Description = req.Description
	}
	if req.Type != "" {
		cargo.Type = req.Type
	}
	if req.Priority != "" {
		cargo.Priority = req.Priority
	}
	if req.Status != "" {
		cargo.Status = req.Status
	}
	if req.Weight > 0 {
		cargo.Weight = req.Weight
	}
	if req.Volume > 0 {
		cargo.Volume = req.Volume
	}
	if req.Value > 0 {
		cargo.Value = req.Value
	}
	if req.Currency != "" {
		cargo.Currency = req.Currency
	}
	if req.OriginAddress != "" {
		cargo.OriginAddress = req.OriginAddress
	}
	if req.OriginLatitude != nil {
		cargo.OriginLatitude = req.OriginLatitude
	}
	if req.OriginLongitude != nil {
		cargo.OriginLongitude = req.OriginLongitude
	}
	if req.OriginContact != "" {
		cargo.OriginContact = req.OriginContact
	}
	if req.OriginPhone != "" {
		cargo.OriginPhone = req.OriginPhone
	}
	if req.DestinationAddress != "" {
		cargo.DestinationAddress = req.DestinationAddress
	}
	if req.DestinationLatitude != nil {
		cargo.DestinationLatitude = req.DestinationLatitude
	}
	if req.DestinationLongitude != nil {
		cargo.DestinationLongitude = req.DestinationLongitude
	}
	if req.DestinationContact != "" {
		cargo.DestinationContact = req.DestinationContact
	}
	if req.DestinationPhone != "" {
		cargo.DestinationPhone = req.DestinationPhone
	}
	if req.PickupTime != nil {
		cargo.PickupTime = req.PickupTime
	}
	if req.DeliveryTime != nil {
		cargo.DeliveryTime = req.DeliveryTime
	}
	if req.EstimatedDelivery != nil {
		cargo.EstimatedDelivery = req.EstimatedDelivery
	}
	if req.Instructions != "" {
		cargo.Instructions = req.Instructions
	}
	cargo.SpecialHandling = req.SpecialHandling

	err = s.cargoRepo.Update(cargo)
	if err != nil {
		return nil, err
	}

	// Create status change event if status changed
	if oldStatus != cargo.Status {
		event := &models.CargoEvent{
			CargoID:     cargo.ID,
			EventType:   "status_change",
			Description: "Status changed from " + string(oldStatus) + " to " + string(cargo.Status),
			Timestamp:   time.Now(),
		}
		s.cargoRepo.CreateEvent(event)
	}

	return s.cargoRepo.GetByID(id, companyID)
}

func (s *CargoService) DeleteCargo(id uint, companyID uint) error {
	return s.cargoRepo.Delete(id, companyID)
}

func (s *CargoService) AssignCargoToTruck(cargoID uint, companyID uint, truckID uint, assignedBy uint) (*models.Cargo, error) {
	// Verify truck belongs to company
	truck, err := s.truckRepo.GetByID(truckID, companyID)
	if err != nil {
		return nil, err
	}

	// Get cargo
	cargo, err := s.cargoRepo.GetByID(cargoID, companyID)
	if err != nil {
		return nil, err
	}

	// Update cargo assignment
	cargo.TruckID = &truckID
	cargo.Status = models.CargoStatusAssigned
	cargo.AssignedBy = &assignedBy
	now := time.Now()
	cargo.AssignedAt = &now

	err = s.cargoRepo.Update(cargo)
	if err != nil {
		return nil, err
	}

	// Update truck status if it was offline
	if truck.Status == models.TruckStatusOffline {
		truck.Status = models.TruckStatusInUse
		s.truckRepo.Update(truck)
	}

	// Create assignment event
	event := &models.CargoEvent{
		CargoID:     cargo.ID,
		EventType:   "assigned",
		Description: "Cargo assigned to truck " + truck.LicensePlate,
		UserID:      &assignedBy,
		Timestamp:   time.Now(),
	}
	s.cargoRepo.CreateEvent(event)

	return s.cargoRepo.GetByID(cargoID, companyID)
}

func (s *CargoService) UnassignCargoFromTruck(cargoID uint, companyID uint, userID uint) (*models.Cargo, error) {
	cargo, err := s.cargoRepo.GetByID(cargoID, companyID)
	if err != nil {
		return nil, err
	}

	if cargo.TruckID == nil {
		return cargo, nil // Already unassigned
	}

	truckID := *cargo.TruckID
	cargo.TruckID = nil
	cargo.Status = models.CargoStatusPending
	cargo.AssignedBy = nil
	cargo.AssignedAt = nil

	err = s.cargoRepo.Update(cargo)
	if err != nil {
		return nil, err
	}

	// Check if truck has other assigned cargos
	otherCargos, _ := s.cargoRepo.GetByTruckID(truckID, companyID)
	if len(otherCargos) == 0 {
		// No other cargos, set truck to online
		truck, err := s.truckRepo.GetByID(truckID, companyID)
		if err == nil {
			truck.Status = models.TruckStatusOnline
			s.truckRepo.Update(truck)
		}
	}

	// Create unassignment event
	event := &models.CargoEvent{
		CargoID:     cargo.ID,
		EventType:   "unassigned",
		Description: "Cargo unassigned from truck",
		UserID:      &userID,
		Timestamp:   time.Now(),
	}
	s.cargoRepo.CreateEvent(event)

	return s.cargoRepo.GetByID(cargoID, companyID)
}

func (s *CargoService) GetCargosByTruck(truckID uint, companyID uint) ([]models.Cargo, error) {
	return s.cargoRepo.GetByTruckID(truckID, companyID)
}

func (s *CargoService) CreateCargoEvent(cargoID uint, companyID uint, userID uint, req models.CreateCargoEventRequest) (*models.CargoEvent, error) {
	// Verify cargo belongs to company
	_, err := s.cargoRepo.GetByID(cargoID, companyID)
	if err != nil {
		return nil, err
	}

	event := &models.CargoEvent{
		CargoID:     cargoID,
		EventType:   req.EventType,
		Description: req.Description,
		Location:    req.Location,
		Latitude:    req.Latitude,
		Longitude:   req.Longitude,
		UserID:      &userID,
		Timestamp:   time.Now(),
	}

	err = s.cargoRepo.CreateEvent(event)
	if err != nil {
		return nil, err
	}

	// Update cargo status based on event type
	cargo, _ := s.cargoRepo.GetByID(cargoID, companyID)
	if cargo != nil {
		switch req.EventType {
		case "pickup":
			cargo.Status = models.CargoStatusInTransit
			now := time.Now()
			cargo.ActualPickup = &now
		case "delivery":
			cargo.Status = models.CargoStatusDelivered
			now := time.Now()
			cargo.ActualDelivery = &now
		}
		s.cargoRepo.Update(cargo)
	}

	return event, nil
}

func (s *CargoService) GetCargoEvents(cargoID uint, companyID uint) ([]models.CargoEvent, error) {
	// Verify cargo belongs to company
	_, err := s.cargoRepo.GetByID(cargoID, companyID)
	if err != nil {
		return nil, err
	}

	return s.cargoRepo.GetEventsByCargoID(cargoID)
}

func (s *CargoService) GetUnassignedCargos(companyID uint) ([]models.Cargo, error) {
	return s.cargoRepo.GetUnassignedCargos(companyID)
}

func (s *CargoService) UpdateCargoLocation(cargoID uint, companyID uint, userID uint, req models.UpdateCargoLocationRequest) (*models.Cargo, error) {
	// Verify cargo belongs to company
	cargo, err := s.cargoRepo.GetByID(cargoID, companyID)
	if err != nil {
		return nil, err
	}

	// Update cargo location
	cargo.CurrentLatitude = &req.Latitude
	cargo.CurrentLongitude = &req.Longitude
	cargo.CurrentLocation = req.Location
	now := time.Now()
	cargo.LastUpdated = &now

	err = s.cargoRepo.Update(cargo)
	if err != nil {
		return nil, err
	}

	// Create location update event
	event := &models.CargoEvent{
		CargoID:     cargo.ID,
		EventType:   "location_update",
		Description: "Location updated during transit",
		Location:    req.Location,
		Latitude:    &req.Latitude,
		Longitude:   &req.Longitude,
		UserID:      &userID,
		Timestamp:   time.Now(),
	}
	s.cargoRepo.CreateEvent(event)

	return s.cargoRepo.GetByID(cargoID, companyID)
}

func (s *CargoService) GetCargoTracking(trackingNumber string) (*models.CargoTrackingResponse, error) {
	cargo, err := s.cargoRepo.GetByTrackingNumber(trackingNumber)
	if err != nil {
		return nil, err
	}

	// Get recent events (last 10)
	events, _ := s.cargoRepo.GetEventsByCargoID(cargo.ID)
	recentEvents := events
	if len(events) > 10 {
		recentEvents = events[:10]
	}

	// Calculate progress based on status
	progress := s.calculateProgress(cargo.Status)

	// Get truck location if assigned
	var truckLocation *models.TruckLocation
	if cargo.TruckID != nil {
		truck, err := s.truckRepo.GetByID(*cargo.TruckID, cargo.CompanyID)
		if err == nil && truck.LastLocation != nil {
			truckLocation = truck.LastLocation
		}
	}

	// Calculate ETA (simplified - in real implementation, use routing service)
	var estimatedETA *time.Time
	if cargo.EstimatedDelivery != nil {
		estimatedETA = cargo.EstimatedDelivery
	}

	return &models.CargoTrackingResponse{
		Cargo:         *cargo,
		CurrentStatus: string(cargo.Status),
		Progress:      progress,
		EstimatedETA:  estimatedETA,
		LastUpdate:    cargo.LastUpdated,
		RecentEvents:  recentEvents,
		TruckLocation: truckLocation,
	}, nil
}

func (s *CargoService) calculateProgress(status models.CargoStatus) float64 {
	switch status {
	case models.CargoStatusPending:
		return 0.0
	case models.CargoStatusAssigned:
		return 25.0
	case models.CargoStatusInTransit:
		return 75.0
	case models.CargoStatusDelivered:
		return 100.0
	case models.CargoStatusCancelled:
		return 0.0
	default:
		return 0.0
	}
}

func (s *CargoService) GetCargoRoute(cargoID uint, companyID uint) ([]models.CargoEvent, error) {
	// Verify cargo belongs to company
	_, err := s.cargoRepo.GetByID(cargoID, companyID)
	if err != nil {
		return nil, err
	}

	// Get all events with location data
	events, err := s.cargoRepo.GetEventsByCargoID(cargoID)
	if err != nil {
		return nil, err
	}

	// Filter events that have location data
	var routeEvents []models.CargoEvent
	for _, event := range events {
		if event.Latitude != nil && event.Longitude != nil {
			routeEvents = append(routeEvents, event)
		}
	}

	return routeEvents, nil
}

func (s *CargoService) GetNearbyCargoForTruck(truckID uint, companyID uint, radiusKm float64) ([]models.Cargo, error) {
	// Get truck location
	truck, err := s.truckRepo.GetByID(truckID, companyID)
	if err != nil {
		return nil, err
	}

	if truck.LastLocation == nil {
		return []models.Cargo{}, nil
	}

	// Get unassigned cargo for the company
	unassignedCargo, err := s.cargoRepo.GetUnassignedCargos(companyID)
	if err != nil {
		return nil, err
	}

	// Filter cargo within radius
	var nearbyCargo []models.Cargo
	for _, cargo := range unassignedCargo {
		if cargo.OriginLatitude != nil && cargo.OriginLongitude != nil {
			distance := s.calculateDistance(
				truck.LastLocation.Latitude, truck.LastLocation.Longitude,
				*cargo.OriginLatitude, *cargo.OriginLongitude,
			)
			if distance <= radiusKm {
				nearbyCargo = append(nearbyCargo, cargo)
			}
		}
	}

	return nearbyCargo, nil
}

// Haversine formula to calculate distance between two GPS coordinates
func (s *CargoService) calculateDistance(lat1, lon1, lat2, lon2 float64) float64 {
	const R = 6371 // Earth's radius in kilometers

	dLat := (lat2 - lat1) * (3.14159265359 / 180)
	dLon := (lon2 - lon1) * (3.14159265359 / 180)

	a := 0.5 - 0.5*((dLat*0.5)+(dLon*0.5))
	return R * 2 * (1 - a)
}