# Electronics Lab Management System (ELMS) - Backend

## 1. Project Overview
The **ELMS Backend** is a Spring Boot application developed to streamline the management of electronics laboratories. It facilitates the management of students, staff, equipment inventory, lab sessions, and reporting.

## 2. Technology Stack
*   **Core Framework**: Spring Boot 3.5.7
*   **Language**: Java 17
*   **Database**: MySQL (Connector `mysql-connector-j`)
*   **ORM**: Spring Data JPA
*   **Security**: Spring Security 6 + JWT (stateless authentication)
*   **Cloud Storage**: Cloudinary (for storing lab reports and manual PDFs)
*   **API Documentation**: SpringDoc OpenAPI (Swagger UI)
*   **Validations**: Hibernate Validator
*   **Build Tool**: Maven

## 3. Configuration & Setup

### Database Configuration
The application is configured to connect to a MySQL database.
*   **URL**: `jdbc:mysql://localhost:3307/elms`
*   **Username**: `root`
*   **Password**: `test123`
*   **DDL Auto**: `update` (Schema is automatically updated)

> **Note**: Ensure your MySQL server is running on port **3307** and the database `elms` is created. You can change these settings in `src/main/resources/application.properties`.

### Cloudinary Configuration
Used for file uploads.
*   **Cloud Name**: `duddqeeeh`
*   **API Key**: `694258...` (See `application.properties`)

### Running the Application
```bash
mvn spring-boot:run
```

## 4. User Roles & Permissions
The system defines the following user roles (`UserRole` enum):
*   `ROLE_STUDENT`: Access to course materials, lab reservations, and report submissions.
*   `ROLE_STAFF`: Management of inventory and reservations.
*   `ROLE_LECTURER`: Oversight of courses, sessions, and report grading.
*   `ROLE_DEMONSTRATOR`: Assisting in lab sessions and grading.
*   `ROLE_ADMIN`: Full system access.

## 5. Key Modules & Functionality

### 5.1 User Management
*   **Registration**: New users must "Sign Up" via `/elms/api/sign-up` to set their password for their registration number.
*   **Controllers**: `StudentController`, `StaffController`, `LecturerController`, `DemonstratorController`.

### 5.2 Laboratory & Session Management
*   **Courses**: Academic courses offering lab sessions (`CourseController`).
*   **Sessions**: Scheduled lab times (`SessionController`).
*   **Enrollment**: Students enroll in courses and specific sessions (`CourseEnrollmentController`, `SessionEnrollmentController`).

### 5.3 Inventory Management
*   **Components**: Catalog of electronic components (Resistors, ICs, etc.) managed via `ComponentController`.
*   **Handover**: Tracking the issuing and return of components to students (`ComponentHandoverController`).

### 5.4 Reservations
*   Students can reserve lab slots for self-study or projects via `LabReservationController`.

### 5.5 Reports & Manuals
*   **Lab Manuals**: PDFs uploaded by lecturers (`LabManualController`).
*   **Submissions**: Students upload lab reports (`ReportSubmissionController`).
*   **Reviews**: Grading and feedback on reports (`LabReportReviewController`).

## 6. Security Architecture
The application uses **JWT (JSON Web Tokens)** for securing REST APIs.

*   **Filter Chain**: `JwtFilter` intercepts requests to validate the `Authorization: Bearer <token>` header.
*   **Token Generation**: Tokens are signed with `HMAC-SHA256`.
*   **Validity**: Tokens are valid for 1 year.

> **⚠️ Security Warning**:
> 1.  The **JWT Secret Key** is currently hardcoded in `JwtUtil.java`. For production, this MUST be moved to an environment variable.
> 2.  **Missing Login Endpoint**: While a `signUp` endpoint exists to set passwords, the corresponding `login` endpoint to **generate** and return a JWT token is currently **missing** in the `LoginController`. Users cannot currently log in.

## 7. API Documentation
Once the application is running, you can access the interactive API documentation (Swagger UI) at:
*   `http://localhost:8080/swagger-ui.html` (port 8080 is default for Spring Boot).
