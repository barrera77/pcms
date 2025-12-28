# PCMS - Pest Control Management System

> An internal field operations management system designed to streamline pest control operations workflows, reporting, and inventory management.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![MUI](https://img.shields.io/badge/MUI-007FFF?style=flat&logo=mui&logoColor=white)](https://mui.com/)

---

## About The Project

PCMS was born from real-world frustration with inadequate management tools. As a pest control supervisor, I experienced firsthand the inefficiencies of using generic property management software (Yardi) for specialized pest control operations.

**The Problem:**
- Technicians lack proper tools for field reporting
- No centralized system for treatment scheduling and tracking
- Inventory management is manual and error-prone
- Management has limited visibility into pest trends and technician performance

**The Solution:**
This system provides pest control teams with a mobile-first application tailored to their specific workflows, from treatment reporting to inventory tracking and scheduling.

---

## Key Features

### For Technicians
- **Mobile-First Design** - Allows field personnel to create treatment reports directly from their mobile
- **Time Tracking** - Clock in/out per treatment for accurate time management
- **Smart Scheduling** - View and manage treatment schedules with follow-up reminders
- **Photo Attachments** - Document treatments with before/after photos
- **Service Reports** - Create service reports with ease

### For Supervisors & Management
- **Analytics Dashboard** - Track pest trends by area, building, and time period
- **Inventory Management** - Monitor product usage and equipment assignments
- **Personnel Management** - Onboard employees and manage user access
- **Hierarchical Data Access** - Role-based filtering (building managers see only their buildings)

### Technical Highlights
- **Secure Authentication** - JWT-based auth with email activation workflow
- **Monorepo Architecture** - Organized codebase with shared types
- **Test Coverage** - Unit and E2E testing with Vitest and Playwright
- **API Documentation** - Auto-generated Swagger/OpenAPI docs
- **Accessibility** - WCAG compliant, keyboard navigable

---

## Tech Stack

### Backend
- **Framework:** NestJS (Node.js)
- **Language:** TypeScript
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Email:** @nestjs-modules/mailer with Ethereal (dev) / SMTP (prod)
- **Validation:** class-validator, class-transformer
- **Security:** Helmet, CSRF protection, bcrypt
- **Documentation:** Swagger/OpenAPI

### Frontend *(Coming Soon)*
- **Framework:** React 18 with Vite
- **Language:** TypeScript
- **UI Library:** Material-UI (MUI)
- **State Management:** Redux Toolkit
- **API Client:** RTK Query / TanStack Query
- **Forms:** React Hook Form
- **Tables:** Tanstack
- **PWA:** Workbox for offline capabilities

### Testing & DevOps
- **Unit Tests:** Vitest
- **E2E Tests:** Playwright
- **Linting:** ESLint + Prettier
- **Version Control:** Git + GitHub Projects for project management

---

## Development Progress

### Phase 1: Backend Foundation (35% Complete)
**User & Employee Management**
- [x] Department entity with CRUD operations
- [x] Employee entity with department relationships
- [x] User registration with email activation flow
- [x] JWT token generation and validation
- [x] Email service integration (activation emails)
- [x] Password hashing with bcrypt
- [ ] JWT authentication guards (JwtAuthGuard)
- [ ] Role-based authorization guards (RolesGuard)
- [ ] Refresh token mechanism

**Static Entities** (Admin/Supervisor Managed)
- [x] Province entity
- [x] City entity (belongs to Province)
- [x] Area/Region entity (belongs to City)
- [x] Building/Site entity (belongs to Area, has manager)
- [x] Pest entity (types: bedbugs, roaches, rodents, etc.)
- [x] Product entity (pesticides, materials)
- [x] Equipment entity (with maintenance tracking)

**Testing Infrastructure**
- [ ] Vitest setup and configuration
- [ ] Unit test examples (services)
- [ ] E2E test examples (controllers)
- [ ] Test database setup/teardown utilities
- [ ] CI/CD pipeline (GitHub Actions)

### Phase 2: Core Business Logic (Not Started)
**Treatment Reports** (Core Feature!)
- [ ] Treatment report entity with immutability rules
- [ ] File upload support (photos/attachments)
- [ ] Clock in/out functionality
- [ ] Automatic duration calculation
- [ ] Contractor vs in-house work tracking
- [ ] Contractor name/company fields (supervisor editable only)
- [ ] Product and equipment usage tracking
- [ ] Supervisor override capabilities

**Scheduling System**
- [ ] Schedule entity with time windows
- [ ] Recurring schedule support (follow-ups every 2 weeks)
- [ ] Building inspection reminders (every 3-4 months)
- [ ] Schedule notifications/alerts
- [ ] Tech assignment and coordination

**Inventory Management**
- [ ] Inventory item entity with stock levels
- [ ] Inventory transaction tracking
- [ ] Product usage recording (linked to treatments)
- [ ] Equipment assignment to technicians
- [ ] Low stock alerts
- [ ] Equipment maintenance due date tracking
- [ ] Cost tracking for supply restocks (PPE, products)
- [ ] Invoice/receipt attachment support

### Phase 3: Permissions & Data Scope (Not Started)
- [ ] Implement hierarchical data filtering by role
- [ ] Viewer sees only their buildings/areas
- [ ] Tech sees all city data
- [ ] Supervisor/Admin sees everything
- [ ] Audit logging (who changed what, when)
- [ ] Data export permissions

### Phase 4: Frontend MVP (Not Started)
- [ ] React app setup with Vite + TypeScript
- [ ] Authentication flow (login, logout, token refresh)
- [ ] Mobile-responsive treatment report form
- [ ] Schedule calendar view
- [ ] Clock in/out interface
- [ ] Admin panel for entity management (12 entities)
- [ ] Redux store with RTK Query integration

### Phase 5: Analytics & Polish (Not Started)
- [ ] Dashboard with charts (pest trends, product usage)
- [ ] Advanced filtering and search
- [ ] PDF/Excel report exports
- [ ] Low inventory notifications
- [ ] Equipment maintenance alerts
- [ ] Performance optimizations
- [ ] Production deployment

---

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- MongoDB instance (local or Atlas)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/pcms.git
   cd pcms
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the `packages/server` directory:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/pcms
   
   # JWT Secrets (generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRY=3600
   JWT_ACTIVATION_SECRET=your-activation-secret-here
   JWT_ACTIVATION_EXPIRY=48h
   
   # SMTP Email Configuration
   SMTP_HOST=smtp.ethereal.email
   SMTP_PORT=587
   SMTP_USER=your-ethereal-email@ethereal.email
   SMTP_PASS=your-ethereal-password
   
   # Application
   PORT=3000
   NODE_ENV=development
   ALLOWED_EMAIL_DOMAIN=@yourcompany.com
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - API: `http://localhost:3000`
   - Swagger Documentation: `http://localhost:3000/api`

---

## Current Project Structure

```
pcms/
├── packages/
│   ├── server/              # NestJS Backend
│   │   ├── src/
│   │   │   ├── auth/        # Authentication module
│   │   │   ├── user/        # User management
│   │   │   ├── employee/    # Employee management
│   │   │   ├── department/  # Department management
│   │   │   ├── treatment/   # Treatment reports (coming soon)
│   │   │   ├── schedule/    # Scheduling (coming soon)
│   │   │   ├── inventory/   # Inventory (coming soon)
│   │   │   ├── mailer/      # Email service
│   │   │   ├── common/      # Shared utilities, entities
│   │   │   └── main.ts      # Application entry point
│   │   └── test/            # E2E tests
│   │
│   ├── client/              # React Frontend (coming soon)
│   │
│   └── common/              # Shared types and interfaces
│       └── lib/
|           └── application/
│           ├── entities/  # TypeScript interfaces
│           └── helpers/   # helper methods
│
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

---

## Testing

```bash
# Run unit tests
npm run test

# Run unit tests in watch mode
npm run test:watch

# Run E2E tests
npm run test:e2e

# Generate test coverage
npm run test:cov
```

---

## API Documentation

Once the server is running, visit `http://localhost:3000/api` to explore the interactive Swagger documentation.

### Key Endpoints (Current)

#### Authentication & Users
- `POST /user` - Create new user (sends activation email)
- `POST /user/activate` - Activate user account with token + password
- `POST /user/resend-activation` - Resend activation email
- `GET /user` - List all users (admin only)
- `GET /user/:id` - Get user by ID

#### Employees
- `POST /employee` - Create employee
- `GET /employee` - List all employees (with department populated)
- `GET /employee/:id` - Get employee details
- `PATCH /employee/:id` - Update employee
- `DELETE /employee/:id` - Soft delete employee

#### Departments
- `POST /department` - Create department
- `GET /department` - List all departments
- `GET /department/:id` - Get department details
- `PATCH /department/:id` - Update department
- `DELETE /department/:id` - Soft delete department

... etc.
---

## Roadmap

See the [GitHub Projects board](https://github.com/yourusername/pcms/projects/1) for detailed task tracking and progress (Working in updating it).

**Upcoming Milestones:**
- **Milestone 1:** Backend Foundation - User/Employee management, static entities
- **Milestone 2:** Core Business Logic - Treatment reports, scheduling, inventory
- **Milestone 3:** Permissions & Data Scope - Role-based access, hierarchical filtering
- **Milestone 4:** Frontend MVP - React app with core features
- **Milestone 5:** Analytics & Production - Dashboards, reports, deployment

---

## Contributing

I am a noob dev and this is a personal portfolio project, but feedback and suggestions are always welcome! Feel free to:
- Open an issue for bugs or feature requests
- Submit a pull request with improvements
- Star the repo if you find it interesting

---

## License

This project is licensed under the MIT License

---

## Author

**Manuel Alva < Д />**
- Portfolio: https://portfolio-react-v1-phi.vercel.app/
- LinkedIn: www.linkedin.com/in/manuel-alva-770809
- GitHub: https://github.com/barrera77

---

## Acknowledgments

- Built to solve real-world inefficiencies in pest control field operations
- Inspired by hands-on supervisory experience in the industry
- Special thanks to the pest control technicians who inspired this solution

---

## Screenshots

*Coming soon once the frontend is developed!*

---

**Note:** This is an active development project. The backend is currently ~35% complete with user management and basic entity structure in place. Frontend development will begin after backend completion.

---

Made with a lot of coffee, energy drinks and frustration with inadequate field management tools
