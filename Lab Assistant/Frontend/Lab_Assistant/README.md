# Lab Assistant - Electronic Lab Management System

A React-based frontend application for managing electronic lab inventory, requests, procurement, and equipment maintenance.

## Features

### 🟦 1. Inventory Management
- View all components (Resistors, ICs, Sensors, Tools)
- Add, update, and delete items
- Low stock alerts (highlights items where quantity < minimumStock)
- Status tracking: Available, Damaged, Under Maintenance

### 🟩 2. Resource Requests
- View all borrow requests from students/lecturers
- Approval workflow: Approve/Reject → Issue → Return
- Filter by status (Pending, Approved, Issued, Returned, Rejected)
- Request history

### 🟨 3. Procurement
- Create restocking requests for Admin
- Track request status: Pending, Approved, Delivered
- Priority levels: Low, Medium, High

### 🟥 4. Equipment Maintenance
- View all equipment (Oscilloscopes, Power Supplies, etc.)
- Update status: Working, Under Maintenance, Damaged
- Filter by status

### 🟦 5. Dashboard
- Quick stats cards:
  - Total Items
  - Low Stock Alerts
  - Pending Requests
  - Items Under Maintenance
- Quick action buttons

## Tech Stack

- **React 18** - UI library
- **React Router DOM** - Routing
- **Axios** - HTTP client
- **Vite** - Build tool and dev server

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/
│   ├── Layout.jsx          # Main layout with sidebar navigation
│   └── Layout.css
├── pages/
│   ├── LabAssistantDashboard.jsx
│   ├── InventoryPage.jsx
│   ├── RequestsPage.jsx
│   ├── ProcurementPage.jsx
│   └── MaintenancePage.jsx
├── utils/
│   └── api.js              # API utility functions
├── App.jsx                 # Main app component with routing
├── App.css
├── main.jsx                # Entry point
└── index.css               # Global styles
```

## API Integration

The frontend expects a Spring Boot backend running on `http://localhost:8080` with the following endpoints:

### Inventory API
- `GET /api/inventory` - Get all items
- `GET /api/inventory/{id}` - Get item by ID
- `POST /api/inventory` - Create new item
- `PUT /api/inventory/{id}` - Update item
- `DELETE /api/inventory/{id}` - Delete item

### Requests API
- `GET /api/requests` - Get all requests
- `PUT /api/requests/{id}/approve` - Approve request
- `PUT /api/requests/{id}/reject` - Reject request
- `PUT /api/requests/{id}/issue` - Issue item
- `PUT /api/requests/{id}/return` - Mark as returned

### Procurement API
- `GET /api/procurement` - Get all procurement requests
- `POST /api/procurement` - Create procurement request

### Maintenance API
- `GET /api/maintenance` - Get all equipment
- `PUT /api/maintenance/{id}/status` - Update equipment status

### Dashboard API
- `GET /api/dashboard/stats` - Get dashboard statistics

## Development Notes

- The app includes mock data for development/testing when the backend is not available
- All API calls are configured in `src/utils/api.js`
- The proxy configuration in `vite.config.js` forwards `/api` requests to `http://localhost:8080`
- Responsive design with mobile-friendly layouts

## Next Steps

1. Connect to your Spring Boot backend
2. Update API endpoints in `src/utils/api.js` if needed
3. Add authentication/authorization if required
4. Customize styling to match your brand


