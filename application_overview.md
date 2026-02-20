# Application Overview: Suivi Pédagogique AF

## Application Description

Suivi Pédagogique AF is a comprehensive educational management system designed to handle course scheduling, student enrollment, classroom assignments, and staff management. It serves multiple user types with different roles and permissions.

## Database Structure

Based on the [suivie_pedagogique_af.sql](file:///d:/dorea/suiviepedagogiqueAF/suiviepedagogiqueAF/suivie_pedagogique_af.sql) database schema, the application manages:

- **Users**: Employees with different roles (Admin, Coordinator, Teachers)
- **Courses**: Different types of courses with levels and categories
- **Scheduling**: Sessions, time slots ([creneau](file:///d:/dorea/suiviepedagogiqueAF/suiviepedagogiqueAF/backend/src/controllers/creneauController.js)), groups
- **Classrooms**: Room assignments with capacity limits
- **Enrollments**: Student registrations and attendance tracking
- **Levels**: Course levels (A1-A2, B1-B2, C1-C2 with sublevels)

## User Types and Roles

### 1. Admin Role
- Full system access
- Manage employees and assign roles
- Access to all system functionalities

### 2. Coordinator (Pedagogical Staff)
- Plan and organize courses
- Register enrollments
- Assign rooms based on capacity/course/day
- Organize groups based on enrollment numbers
- Generate attendance sheets

### 3. Teachers/Professors
- View general schedule
- Access personal course schedules
- Access attendance sheets for their classes

### 4. Students/Apprentices
- View ongoing and upcoming courses
- View their personal class schedules
- Notify pedagogy staff of profile inaccuracies

## Functionalities by Role

### Pedagogical Management Features

#### Course Planning
- Create sessions with specific dates and periods
- Associate courses with levels and categories
- Define time slots ([creneau](file:///d:/dorea/suiviepedagogiqueAF/suiviepedagogiqueAF/backend/src/controllers/creneauController.js)) for recurring classes

#### Enrollment Registration
- Register students for specific sessions
- Track student information (personal details, contact info, academic level)
- Link students to appropriate sessions and time slots

#### Room Assignment
- Assign rooms based on capacity constraints
- Consider course type and day of week
- Handle capacity limitations by splitting large groups

#### Group Organization
- Automatically divide groups when enrollment exceeds room capacity
- Each group gets its own room, teacher, and time slot
- Manage teacher assignments to specific groups

#### Attendance Tracking
- Create attendance sheets for each course
- Track student presence/absence
- Record arrival times and remarks

### Administrative Features

#### Employee Management
- Create and manage employee accounts
- Assign roles (Admin, Coordinator, Teacher)
- Deactivate accounts when necessary
- Manage employee profiles and contact information

#### Role Management
- Define role permissions
- Assign roles to employees
- Control access to various system functions

### Teacher Features

#### Schedule View
- Access to general scheduling overview
- Personalized view of assigned courses
- Detailed information about their groups and students

#### Attendance Sheets
- Access attendance records for their classes
- Update attendance during sessions
- Add remarks about student performance

### Student Features

#### Course Visibility
- View available and ongoing courses
- Check upcoming sessions
- Personal schedule display

#### Profile Management
- Review personal information accuracy
- Send notifications to pedagogy staff about incorrect information
- Request updates to registration details

## Technical Implementation

### Backend
- Built with Node.js/Express
- PostgreSQL database
- Role-based authentication and authorization
- API endpoints for all major functions

### Frontend
- React-based user interface
- Role-specific dashboards
- Responsive design for accessibility

### Mobile Application
- Expo/React Native mobile app
- Synchronized with backend system
- Specialized mobile interface

## Key Database Entities

- **[employe](file:///d:/dorea/suiviepedagogiqueAF/suiviepedagogiqueAF/backend/src/controllers/employeController.js)**: Stores employee information with roles and authentication
- **[role](file:///d:/dorea/suiviepedagogiqueAF/suiviepedagogiqueAF/backend/src/controllers/roleController.js)**: Defines system roles (Admin, Coordinator, Teacher)
- **[session](file:///d:/dorea/suiviepedagogiqueAF/suiviepedagogiqueAF/backend/src/controllers/sessionController.js)**: Manages course sessions with dates and periods
- **[type_cours](file:///d:/dorea/suiviepedagogiqueAF/suiviepedagogiqueAF/backend/src/controllers/typeCoursController.js)**: Differentiates course types (regular, intensive, extensive, prep courses)
- **[niveau](file:///d:/dorea/suiviepedagogiqueAF/suiviepedagogiqueAF/backend/src/controllers/niveauController.js)**: Tracks course levels (A1-B2-C2 with sublevels)
- **[categorie](file:///d:/dorea/suiviepedagogiqueAF/suiviepedagogiqueAF/backend/src/controllers/categorieController.js)**: Groups students by age categories (children, teenagers, adults)
- **[creneau](file:///d:/dorea/suiviepedagogiqueAF/suiviepedagogiqueAF/backend/src/controllers/creneauController.js)**: Time slots for courses (day of week and time)
- **[groupe](file:///d:/dorea/suiviepedagogiqueAF/suiviepedagogiqueAF/backend/src/controllers/groupeController.js)**: Actual groups with teachers, time slots, and rooms
- **[salle](file:///d:/dorea/suiviepedagogiqueAF/suiviepedagogiqueAF/backend/src/controllers/salleController.js)**: Classroom information with capacity limits
- **[affectation_salle](file:///d:/dorea/suiviepedagogiqueAF/suiviepedagogiqueAF/backend/src/controllers/affectationSalleController.js)**: Links groups to specific rooms for specific dates
- **[inscription](file:///d:/dorea/suiviepedagogiqueAF/suiviepedagogiqueAF/backend/src/controllers/inscriptionController.js)**: Student enrollment records
- **[presence](file:///d:/dorea/suiviepedagogiqueAF/suiviepedagogiqueAF/backend/src/controllers/presenceController.js)**: Attendance tracking for students

## Business Logic

1. **Capacity Management**: When enrollment exceeds room capacity, the system automatically divides students into multiple groups.

2. **Role-Based Access**: Users are redirected according to their roles (validation test mentioned in requirements).

3. **Schedule Conflicts**: The system prevents double booking of rooms, teachers, or students at the same time.

4. **Attendance Tracking**: Comprehensive tracking of student attendance with timestamps and remarks.

5. **Notifications**: Students can send notifications to pedagogy staff when they detect incorrect information in their profiles.