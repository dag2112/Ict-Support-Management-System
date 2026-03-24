# ICT Support Management System — Backend

Express.js + TypeScript + Prisma + PostgreSQL

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment:
   ```bash
   cp .env.example .env
   # Edit .env with your PostgreSQL credentials
   ```

3. Run database migrations and generate Prisma client:
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```

4. Seed the database:
   ```bash
   npm run seed
   ```

5. Start development server:
   ```bash
   npm run dev
   ```

API runs on **http://localhost:5000**

## API Endpoints

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| POST | /api/auth/login | All | Login |
| GET | /api/auth/me | All | Get current user |
| GET | /api/requests | All | List requests (role-filtered) |
| POST | /api/requests | Requester | Submit request |
| PUT | /api/requests/:id/approve | Approver | Approve request |
| PUT | /api/requests/:id/reject | Approver | Reject request |
| PUT | /api/requests/:id/assign | Manager | Assign technician |
| PUT | /api/requests/:id/status | Technician | Update status |
| GET | /api/spares | Tech/Manager/Store | List spare requests |
| POST | /api/spares | Technician | Request spare part |
| PUT | /api/spares/:id/approve | Manager | Approve spare |
| PUT | /api/spares/:id/allocate | Storekeeper | Allocate spare |
| POST | /api/feedback | Requester | Submit feedback |
| GET | /api/assets | Tech/Manager/Admin | List assets |
| POST | /api/assets | Manager/Admin | Add asset |
| GET | /api/reports/summary | Manager/Admin | Analytics summary |
| GET | /api/reports/technician-performance | Manager/Admin | Tech performance |
| GET | /api/notifications | All | My notifications |

## Default Credentials (after seed)
All users have password: `password123`
