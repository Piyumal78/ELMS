# Lab Assistant Backend

Spring Boot REST API backend for the Electronic Lab Management System.

## Tech Stack

- **Spring Boot 3.2.0**
- **Java 17**
- **MySQL Database**
- **Spring Data JPA**
- **Maven**

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- MySQL 8.0+

## Database Setup

1. Create MySQL database:
```sql
CREATE DATABASE lab_assistant_db;
```

2. Update database credentials in `src/main/resources/application.properties`:
```properties
spring.datasource.username=your_username
spring.datasource.password=your_password
```

## Running the Application

### Using Maven

```bash
# Navigate to backend directory
cd backend

# Run the application
mvn spring-boot:run
```

### Using IDE

Run the `LabAssistantApplication.java` main class.

The API will be available at `http://localhost:8080`

## API Endpoints

### Inventory
- `GET /api/inventory` - Get all items
- `GET /api/inventory/{id}` - Get item by ID
- `POST /api/inventory` - Create new item
- `PUT /api/inventory/{id}` - Update item
- `DELETE /api/inventory/{id}` - Delete item

### Requests
- `GET /api/requests` - Get all requests
- `GET /api/requests/{id}` - Get request by ID
- `PUT /api/requests/{id}/approve` - Approve request
- `PUT /api/requests/{id}/reject` - Reject request
- `PUT /api/requests/{id}/issue` - Issue item
- `PUT /api/requests/{id}/return` - Mark as returned

### Procurement
- `GET /api/procurement` - Get all procurement requests
- `GET /api/procurement/{id}` - Get request by ID
- `POST /api/procurement` - Create procurement request

### Maintenance
- `GET /api/maintenance` - Get all equipment
- `GET /api/maintenance/{id}` - Get equipment by ID
- `PUT /api/maintenance/{id}/status` - Update equipment status

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## Database Schema

The application uses JPA/Hibernate with `spring.jpa.hibernate.ddl-auto=update`, which automatically creates/updates tables based on entity classes.

### Tables Created:
- `inventory` - Stores lab components
- `requests` - Stores borrow requests
- `procurement` - Stores procurement requests
- `equipment` - Stores equipment information

## Project Structure

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/labassistant/
│   │   │   ├── config/          # Configuration classes
│   │   │   ├── controller/       # REST controllers
│   │   │   ├── entity/           # JPA entities
│   │   │   ├── repository/       # Data repositories
│   │   │   ├── service/          # Business logic
│   │   │   └── LabAssistantApplication.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
└── pom.xml
```

## CORS Configuration

CORS is configured to allow all origins for development. Update `CorsConfig.java` for production to restrict origins.

## Testing

You can test the API using:
- Postman
- curl
- The React frontend (when running on port 3000)

## Notes

- The application uses `spring.jpa.hibernate.ddl-auto=update` which automatically creates/updates database tables
- All dates are stored as `LocalDate` in the database
- Status fields use string values (e.g., "Pending", "Approved", "Working")
- The issue/return operations automatically update inventory quantities

