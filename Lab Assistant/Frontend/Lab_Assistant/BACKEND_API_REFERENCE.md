# Backend API Reference

This document outlines the expected API endpoints for the Lab Assistant frontend.

## Base URL
All endpoints are prefixed with `/api`

## Inventory Endpoints

### GET /api/inventory
Get all inventory items.

**Response:**
```json
[
  {
    "id": 1,
    "name": "10k Resistor",
    "category": "Resistor",
    "quantity": 5,
    "minimumStock": 20,
    "status": "Available",
    "description": "10k ohm resistor"
  }
]
```

### GET /api/inventory/{id}
Get a specific inventory item by ID.

### POST /api/inventory
Create a new inventory item.

**Request Body:**
```json
{
  "name": "Arduino Uno",
  "category": "IC",
  "quantity": 15,
  "minimumStock": 10,
  "status": "Available",
  "description": "Arduino Uno microcontroller"
}
```

### PUT /api/inventory/{id}
Update an existing inventory item.

**Request Body:** Same as POST

### DELETE /api/inventory/{id}
Delete an inventory item.

## Requests Endpoints

### GET /api/requests
Get all resource requests.

**Response:**
```json
[
  {
    "id": 1,
    "studentName": "John Doe",
    "studentId": "STU001",
    "itemName": "Arduino Uno",
    "quantity": 2,
    "requestDate": "2024-01-15",
    "status": "Pending",
    "purpose": "Project work"
  }
]
```

### PUT /api/requests/{id}/approve
Approve a request. Changes status to "Approved".

### PUT /api/requests/{id}/reject
Reject a request. Changes status to "Rejected".

### PUT /api/requests/{id}/issue
Issue the item to the student. Changes status to "Issued" and deducts from inventory.

### PUT /api/requests/{id}/return
Mark item as returned. Changes status to "Returned" and adds back to inventory.

## Procurement Endpoints

### GET /api/procurement
Get all procurement requests.

**Response:**
```json
[
  {
    "id": 1,
    "itemName": "10k Resistor",
    "quantity": 50,
    "priority": "High",
    "status": "Pending",
    "requestDate": "2024-01-15",
    "notes": "Stock is very low",
    "deliveryDate": null
  }
]
```

### POST /api/procurement
Create a new procurement request.

**Request Body:**
```json
{
  "itemName": "10k Resistor",
  "quantity": 50,
  "priority": "High",
  "notes": "Stock is very low"
}
```

**Response:** Created procurement request object

## Maintenance Endpoints

### GET /api/maintenance
Get all equipment.

**Response:**
```json
[
  {
    "id": 1,
    "name": "Oscilloscope",
    "model": "Tektronix TBS1000",
    "location": "Lab A",
    "status": "Working",
    "lastMaintenanceDate": "2024-01-01",
    "serialNumber": "TBS123456"
  }
]
```

### PUT /api/maintenance/{id}/status
Update equipment status.

**Request Body:**
```json
{
  "status": "Under Maintenance"
}
```

**Valid Status Values:**
- "Working"
- "Under Maintenance"
- "Damaged"

## Dashboard Endpoints

### GET /api/dashboard/stats
Get dashboard statistics.

**Response:**
```json
{
  "totalItems": 150,
  "lowStockCount": 8,
  "pendingRequests": 5,
  "itemsUnderMaintenance": 3
}
```

## Error Handling

All endpoints should return appropriate HTTP status codes:
- `200 OK` - Successful GET/PUT request
- `201 Created` - Successful POST request
- `400 Bad Request` - Invalid request data
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

Error responses should follow this format:
```json
{
  "error": "Error message",
  "details": "Additional error details"
}
```


