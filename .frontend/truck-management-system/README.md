# TruckFlow - Complete Truck Management System

A comprehensive, enterprise-grade truck fleet management system built with React, featuring real-time tracking, analytics, and subscription-based access control.

## 🚛 Features

### Core Modules
- **Professional Landing Page** - SEO-optimized customer-facing website
- **Authentication System** - Multi-role access (Admin/Manager/Driver)
- **Dashboard** - Role-specific views with real-time statistics
- **Fleet Management** - Complete truck lifecycle management
- **Driver Management** - User profiles and performance tracking
- **Route Planning** - Advanced route optimization and tracking
- **Cargo Management** - End-to-end cargo lifecycle
- **Real-time Tracking** - Live fleet monitoring with WebSocket updates
- **Reports & Analytics** - Business intelligence with interactive charts
- **Company Management** - Multi-branch support and settings

### Technical Features
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Real-time Updates** - WebSocket integration for live data
- **API Integration** - Complete backend connectivity
- **Subscription Tiers** - Feature gating based on subscription level
- **Error Handling** - Comprehensive error management
- **Offline Support** - Graceful handling of network issues
- **Caching** - Intelligent data caching for performance

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality component library
- **Recharts** - Data visualization library
- **React Router** - Client-side routing

### Backend Integration
- **REST API** - Complete API service layer
- **WebSocket** - Real-time communication
- **Authentication** - JWT token-based auth
- **Error Handling** - Comprehensive error management

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Backend API server running on `http://localhost:8080`

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd truck-management-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API endpoints**
   The system is pre-configured to connect to `http://localhost:8080/api/v1`
   
   Update `src/config/api.js` if your backend runs on a different URL:
   ```javascript
   export const API_CONFIG = {
       BASE_URL: 'your-backend-url/api/v1',
       // ... endpoints
   };
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 📡 API Integration

### Backend Requirements

Your backend should implement the following endpoints:

#### Authentication
- `POST /auth/login` - User authentication
- `POST /auth/register` - User registration

#### Core Resources
- `GET/POST/PUT/DELETE /companies` - Company management
- `GET/POST/PUT/DELETE /users` - User management
- `GET /users/drivers` - Driver-specific endpoints
- `GET/POST/PUT/DELETE /trucks` - Fleet management
- `GET/POST/PUT/DELETE /routes` - Route planning
- `GET/POST/PUT/DELETE /cargo` - Cargo management
- `GET/POST/PUT/DELETE /branches` - Branch management

#### Real-time Features
- `GET /trucks/online` - Online truck status
- `GET /trucks/{id}/location` - Live truck locations
- `WebSocket /ws` - Real-time updates

### API Service Usage

```javascript
import { apiService } from './services/apiService';

// Authentication
const response = await apiService.login({ email, password });

// CRUD operations
const trucks = await apiService.getTrucks();
const newTruck = await apiService.createTruck(truckData);
const updated = await apiService.updateTruck(id, updateData);
await apiService.deleteTruck(id);

// Real-time tracking
const onlineTrucks = await apiService.getOnlineTrucks();
const location = await apiService.getTruckLocation(truckId);
```

### React Hooks

```javascript
import { useTrucks, useUsers, useRoutes } from './hooks/useApi';

function FleetComponent() {
    const { trucks, loading, error, createTruck } = useTrucks();
    
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    
    return (
        <div>
            {trucks.map(truck => (
                <div key={truck.id}>{truck.licensePlate}</div>
            ))}
        </div>
    );
}
```

## 🔌 WebSocket Integration

### Real-time Updates

The system supports real-time updates via WebSocket:

```javascript
import { websocketService } from './services/websocketService';

// Connect with authentication
websocketService.connect(authToken);

// Subscribe to updates
websocketService.subscribeTruckLocation(truckId);
websocketService.subscribeFleetUpdates();

// Listen for events
websocketService.on('truckLocationUpdate', (data) => {
    console.log('Truck location updated:', data);
});

websocketService.on('alert', (alert) => {
    console.log('New alert:', alert);
});
```

### Supported Events
- `truck_location_update` - Live truck GPS coordinates
- `truck_status_update` - Truck status changes
- `route_update` - Route progress updates
- `cargo_update` - Cargo status changes
- `alert` - System alerts and notifications

## 🎨 Customization

### Styling
The system uses Tailwind CSS for styling. Customize the design by:

1. **Colors** - Update `tailwind.config.js`
2. **Components** - Modify shadcn/ui components in `src/components/ui/`
3. **Layout** - Adjust layouts in `src/components/Layout/`

### Features
Enable/disable features by subscription tier in `src/types/index.js`:

```javascript
export const SubscriptionFeatures = {
    [SubscriptionPlan.BASIC]: {
        maxTrucks: 5,
        realTimeTracking: false,
        advancedReports: false
    },
    [SubscriptionPlan.PROFESSIONAL]: {
        maxTrucks: 25,
        realTimeTracking: true,
        advancedReports: true
    }
};
```

## 🔒 Security

### Authentication
- JWT token-based authentication
- Automatic token refresh
- Secure token storage
- Role-based access control

### API Security
- Request/response validation
- Error handling without data exposure
- CORS configuration
- Rate limiting support

## 📊 Subscription Plans

### Basic ($49/month)
- Up to 5 trucks
- Basic route planning
- Driver management
- Email support

### Professional ($149/month)
- Up to 25 trucks
- Real-time tracking
- Advanced analytics
- Priority support

### Enterprise ($399/month)
- Unlimited trucks
- Custom integrations
- 24/7 support
- Dedicated account manager

## 🧪 Testing

### Demo Accounts
The system includes pre-configured demo accounts:

- **Admin**: john.admin@truckflow.com / password123
- **Manager**: sarah.manager@truckflow.com / password123
- **Driver**: mike.driver@truckflow.com / password123

### API Testing
Test API endpoints using the included service layer:

```bash
# Start development server
npm run dev

# Test API connectivity
# Check browser console for API calls
```

## 📱 Mobile Support

The system is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- Touch devices

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment Variables
Create `.env.production` for production settings:
```
VITE_API_BASE_URL=https://your-api-domain.com/api/v1
VITE_WS_URL=wss://your-api-domain.com/ws
```

### Deployment Options
- **Static Hosting**: Netlify, Vercel, AWS S3
- **CDN**: CloudFront, CloudFlare
- **Container**: Docker deployment
- **Traditional**: Apache/Nginx hosting

## 📈 Performance

### Optimization Features
- Code splitting with React.lazy()
- Image optimization
- Bundle size optimization
- Caching strategies
- Lazy loading

### Monitoring
- Error tracking ready
- Performance monitoring
- API response tracking
- User analytics ready

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

### Code Standards
- ESLint configuration
- Prettier formatting
- Component documentation
- TypeScript ready

## 📞 Support

### Documentation
- API documentation in `/docs`
- Component documentation
- User guides
- Video tutorials

### Contact
- Email: support@truckflow.com
- Phone: +1 (555) 123-4567
- Website: https://truckflow.com

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎯 Roadmap

### Upcoming Features
- Mobile applications (iOS/Android)
- Advanced AI route optimization
- IoT sensor integration
- Predictive maintenance
- Advanced reporting
- Third-party integrations

---

**TruckFlow** - Professional truck fleet management made simple.

