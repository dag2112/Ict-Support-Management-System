# ICT Support Management System — Frontend

Woldia University | Group 4 | Software Engineering Senior Project

Built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, connected to an Express.js + PostgreSQL backend.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Project Structure](#3-project-structure)
4. [Getting Started](#4-getting-started)
5. [Environment Variables](#5-environment-variables)
6. [Pages and Routes](#6-pages-and-routes)
7. [Components](#7-components)
8. [Context Providers](#8-context-providers)
9. [API Client](#9-api-client)
10. [Role-Based Access](#10-role-based-access)
11. [Dark / Light Mode](#11-dark--light-mode)
12. [Photo Attachments](#12-photo-attachments)
13. [Demo Accounts](#13-demo-accounts)

---

## 1. Project Overview

This is the frontend of the ICT Support Management System for Woldia University ICT Directorate. It replaces the old paper-based support request process with a fully digital, role-based web platform.

Users can submit ICT support requests, track their status, attach photos, and give feedback. Approvers, managers, technicians, storekeepers, and admins each have their own dashboard with the tools they need.

---

## 2. Tech Stack

| Tool | Purpose |
|---|---|
| Next.js 14 (App Router) | React framework, file-based routing |
| TypeScript | Type safety across all components |
| Tailwind CSS | Utility-first styling with dark mode support |
| React Context API | Global state for auth and theme |
| Fetch API | HTTP requests to the backend |

---

## 3. Project Structure

```
ict-support-Frontend/
├── app/                        # Next.js App Router pages
│   ├── page.tsx                # Home / Landing page (/)
│   ├── layout.tsx              # Root layout (wraps all pages)
│   ├── globals.css             # Global Tailwind CSS imports
│   ├── login/
│   │   └── page.tsx            # Login page (/login)
│   └── dashboard/
│       ├── layout.tsx          # Dashboard layout (sidebar + auth guard)
│       ├── page.tsx            # Dashboard home (role-based)
│       ├── submit/page.tsx     # Submit ICT request (Requester)
│       ├── requests/page.tsx   # My requests list + view modal (Requester)
│       ├── approve/page.tsx    # Approve or reject requests (Approver)
│       ├── assign/page.tsx     # Assign technician to request (Manager)
│       ├── tasks/page.tsx      # View and update assigned tasks (Technician)
│       ├── spares/page.tsx     # Approve spare part requests (Manager)
│       ├── store/page.tsx      # Allocate or purchase spares (Store Keeper)
│       ├── reports/page.tsx    # Analytics and performance reports (Manager/Admin)
│       ├── users/page.tsx      # Manage users (Manager/Admin)
│       └── assets/page.tsx     # Manage ICT assets (Admin)
├── components/
│   ├── Sidebar.tsx             # Navigation sidebar with role-based links
│   ├── StatCard.tsx            # Reusable stat/metric card
│   ├── StatusBadge.tsx         # Colored badge for request status
│   ├── ThemeToggle.tsx         # Dark/light mode toggle button
│   ├── FeedbackModal.tsx       # Star rating + comment modal
│   ├── NotificationBell.tsx    # Notification bell icon (in sidebar)
│   └── ChatPanel.tsx           # Chat panel component
├── context/
│   ├── AuthContext.tsx         # JWT auth state (login, logout, user)
│   └── ThemeContext.tsx        # Dark/light mode state and toggle
├── lib/
│   ├── api.ts                  # All API calls to the backend
│   ├── types.ts                # TypeScript type definitions
│   └── mockData.ts             # Static mock data (used during dev)
├── .env.local                  # Environment variables (not committed)
├── tailwind.config.ts          # Tailwind config with darkMode: "class"
├── tsconfig.json               # TypeScript config
└── package.json                # Dependencies and scripts
```

---

## 4. Getting Started

### Prerequisites

- Node.js v18 or higher
- The backend server running on `http://localhost:5000`

### Step 1 — Install dependencies

```bash
cd ict-support-Frontend
npm install
```

### Step 2 — Set up environment variables

Create a `.env.local` file in the `ict-support-Frontend` folder:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Step 3 — Start the development server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

### Step 4 — Build for production

```bash
npm run build
npm run start
```

---

## 5. Environment Variables

| Variable | Description | Default |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL of the backend API | `http://localhost:5000/api` |

---

## 6. Pages and Routes

### `/` — Home Page

The public landing page. Shows the system name, a description, feature highlights, supported roles, and a call-to-action button that leads to the login page. Also has a dark/light mode toggle in the navbar.

### `/login` — Login Page

The login form. Users enter their email and password. On failure, a red toast notification pops up at the top of the screen with the error message and auto-dismisses after 4 seconds.

The page also shows a list of demo accounts. Clicking any account row auto-fills the email and password fields.

### `/dashboard` — Dashboard Home

After login, users are redirected here. The content is different depending on the user's role:

- **Requester** — sees their request stats (total, pending, in progress, fixed), quick action buttons, and a recent requests table.
- **Approver** — sees pending request count, approved/rejected counts, and a link to the approval page.
- **Technician** — sees assigned task counts and a link to the tasks page.
- **Manager** — sees total requests, pending assignments, spare requests count, and links to assign and reports pages.
- **Store Keeper** — sees spare request counts and a link to the store page.
- **Admin** — sees total requests, fixed, pending, escalated counts, and links to users and assets pages.

### `/dashboard/submit` — Submit Request (Requester only)

A form where requesters submit a new ICT support request. Fields include:

- Request Title
- Description
- Issue Type (Hardware, Software, Network, Other)
- Urgency (Low, Medium, High)
- Location
- Photo Attachments (drag and drop or click to upload, up to 3 images, 5MB each)

On success, a confirmation screen appears and the user is redirected to their requests list after 2 seconds.

### `/dashboard/requests` — My Requests (Requester only)

A searchable, filterable table of all requests submitted by the logged-in user. Features:

- Search by request ID, title, or issue type
- Filter by status (Pending, Approved, Rejected, Assigned, Fixed, etc.)
- Click on a request title or "View" to open a detail modal
- The detail modal shows description, location, assigned technician, resolution note, rejection reason, and photo attachments (clickable, opens full image in new tab)
- If a request is Fixed and has no feedback yet, a "Give Feedback" button appears

### `/dashboard/approve` — Pending Requests (Approver only)

A table of all requests with PENDING status. For each request:

- Click the title to open a view modal showing full details and attachments
- Click "Approve" to approve the request (status changes to APPROVED, manager is notified)
- Click "Reject" to open a rejection modal where a reason must be entered before confirming

### `/dashboard/assign` — Assign Technician (Manager only)

Shows all APPROVED requests waiting to be assigned. For each request:

- Shows request number, title, submitter, issue type, urgency, and location
- A dropdown lists all available technicians
- Click "Assign" to assign the selected technician (status changes to ASSIGNED, technician is notified)

### `/dashboard/tasks` — Assigned Tasks (Technician only)

Shows all requests assigned to the logged-in technician. For each task:

- Shows request number, title, description, location, and current status
- If the task is ASSIGNED, three action buttons appear:
  - **Mark Fixed** — marks the request as resolved
  - **Escalate** — escalates the issue to management
  - **Need Spare** — opens a modal to enter the spare part name, then submits a spare request and updates status to NEED_SPARE
- Photo attachments submitted by the requester are shown so the technician can see the issue visually

### `/dashboard/spares` — Spare Requests (Manager only)

A table of all spare part requests submitted by technicians. Managers can approve pending requests, which then notifies the store keeper.

### `/dashboard/store` — Store Management (Store Keeper only)

Shows all APPROVED spare requests. Store keepers can:

- **Allocate** — mark the spare as allocated (updates the parent request status to SPARE_ALLOCATED)
- **Request Purchase** — mark as purchase requested if the spare is not in stock

### `/dashboard/reports` — Reports and Analytics (Manager/Admin)

Shows analytics data fetched from the backend:

- Summary stats: total, fixed, pending, escalated request counts
- Bar chart (progress bars) of requests by issue type
- Technician performance table: assigned, fixed, fix rate percentage
- Requests by urgency breakdown
- Average feedback rating (if feedback exists)

### `/dashboard/users` — Manage Users (Manager/Admin)

A table of all users in the system with their name, email, role, department, and active status. Managers and admins can:

- Add a new user via a modal form (name, email, password, role, department)
- Deactivate a user (soft delete — sets isActive to false)

### `/dashboard/assets` — Asset Management (Admin only)

A table of all registered ICT assets (laptops, printers, servers, etc.) with asset number, type, model, serial number, location, and status. Admins can add new assets via a modal form.

---

## 7. Components

### `Sidebar.tsx`

The left navigation sidebar shown on all dashboard pages. It:

- Shows navigation links based on the logged-in user's role (each role sees only their relevant pages)
- Shows the user's name, role, and first-letter avatar at the bottom
- Includes the ThemeToggle button
- Has a Logout button that clears the JWT token and redirects to `/login`

### `StatCard.tsx`

A simple card component used on dashboard pages to display a metric. Props: `label`, `value`, and optional `color` (background color class).

### `StatusBadge.tsx`

A colored pill badge that displays a request status. Maps backend enum values (PENDING, APPROVED, FIXED, etc.) to human-readable labels and color classes. Supports both light and dark mode.

### `ThemeToggle.tsx`

A button that switches between dark and light mode. Shows a 🌙 moon icon in light mode and a ☀️ sun icon in dark mode. Reads and writes to `ThemeContext`.

### `FeedbackModal.tsx`

A modal dialog for submitting feedback on a resolved request. Contains:

- A 5-star rating selector (click to select)
- An optional comment textarea
- Submit and Cancel buttons
- Calls `POST /api/feedback` on submit
- Shows a success message before closing

### `NotificationBell.tsx`

A bell icon component for showing unread notification count (integrated in the sidebar area).

### `ChatPanel.tsx`

A chat panel component for in-system messaging.

---

## 8. Context Providers

### `AuthContext.tsx`

Manages the authentication state for the entire app. Provides:

- `user` — the currently logged-in user object (id, name, email, role, department)
- `loading` — true while checking the saved token on page load
- `login(email, password)` — calls `POST /api/auth/login`, saves the JWT to localStorage, sets the user state
- `logout()` — removes the token from localStorage, clears user state, redirects to `/login`

On app load, it reads the token from localStorage and calls `GET /api/auth/me` to restore the session automatically. This means users stay logged in after a page refresh.

### `ThemeContext.tsx`

Manages the dark/light mode preference. Provides:

- `dark` — boolean, true if dark mode is active
- `toggle()` — switches between dark and light mode

On load, it checks `localStorage` for a saved preference. If none exists, it checks the OS preference using `window.matchMedia("(prefers-color-scheme: dark)")`. The selected theme is applied by adding or removing the `dark` class on the `<html>` element, which activates Tailwind's dark mode variants.

---

## 9. API Client

`lib/api.ts` is a centralized module that handles all HTTP communication with the backend. It:

- Reads the JWT token from localStorage and adds it as a `Bearer` token in the `Authorization` header on every request
- Throws an error with the backend's error message if the response is not OK
- Exports an `api` object with methods grouped by feature:

```
api.login()               POST /auth/login
api.me()                  GET  /auth/me
api.getRequests()         GET  /requests
api.createRequest()       POST /requests
api.approveRequest()      PUT  /requests/:id/approve
api.rejectRequest()       PUT  /requests/:id/reject
api.assignRequest()       PUT  /requests/:id/assign
api.updateRequestStatus() PUT  /requests/:id/status
api.escalateRequest()     PUT  /requests/:id/escalate
api.getUsers()            GET  /users
api.getTechnicians()      GET  /users/technicians
api.createUser()          POST /users
api.deleteUser()          DELETE /users/:id
api.getSpares()           GET  /spares
api.createSpare()         POST /spares
api.approveSpare()        PUT  /spares/:id/approve
api.allocateSpare()       PUT  /spares/:id/allocate
api.purchaseSpare()       PUT  /spares/:id/purchase
api.submitFeedback()      POST /feedback
api.getAssets()           GET  /assets
api.createAsset()         POST /assets
api.getNotifications()    GET  /notifications
api.markRead()            PUT  /notifications/:id/read
api.getReportSummary()    GET  /reports/summary
api.getTechnicianPerformance() GET /reports/technician-performance
```

Note: Photo attachment uploads use `fetch` directly with `FormData` instead of the `api` helper, because they require `multipart/form-data` encoding.

---

## 10. Role-Based Access

Every user is assigned one of six roles. The frontend enforces role-based access in two ways:

1. **Sidebar navigation** — each role only sees the links relevant to them (defined in `Sidebar.tsx`)
2. **Dashboard content** — `dashboard/page.tsx` renders a completely different view depending on `user.role`

The backend also enforces role-based access on every API endpoint using JWT + RBAC middleware, so the frontend restrictions are a UX layer on top of real server-side security.

| Role | What they can do |
|---|---|
| REQUESTER | Submit requests, track status, view attachments, give feedback |
| APPROVER | Review pending requests, approve or reject with reason |
| TECHNICIAN | View assigned tasks, mark fixed/escalated/need spare, see attachments |
| MANAGER | Assign technicians, approve spares, view reports, manage users |
| STOREKEEPER | Allocate approved spare parts or request purchase |
| ADMIN | Manage all users, manage assets, view reports and audit logs |

---

## 11. Dark / Light Mode

The system supports full dark and light mode across every page and component.

- Toggle button is in the sidebar (dashboard) and navbar (home page)
- Preference is saved to `localStorage` and restored on every page load
- Falls back to the OS preference (`prefers-color-scheme`) on first visit
- Implemented using Tailwind's `darkMode: "class"` strategy
- The `dark` class is toggled on the `<html>` element by `ThemeContext`
- All components use `dark:` prefixed Tailwind classes for dark mode styles

---

## 12. Photo Attachments

Requesters can attach up to 3 photos when submitting a support request.

- The submit form has a drag-and-drop zone or a click-to-upload button
- Accepted formats: JPG, PNG, GIF, WEBP
- Maximum file size: 5MB per image
- Instant preview thumbnails appear below the drop zone after selection
- Each preview has a hover-to-remove (✕) button
- Files are sent as `multipart/form-data` to `POST /api/requests`
- The backend stores files in `ict-support-Backend/uploads/` and saves the paths in the database
- Attachments are displayed in:
  - The requester's request detail modal (`/dashboard/requests`)
  - The approver's view modal (`/dashboard/approve`)
  - The technician's task cards (`/dashboard/tasks`)
- Clicking an attachment image opens it in a new browser tab

---

## 13. Demo Accounts

After running the backend seed (`npm run seed`), these accounts are available:

| Email | Password | Role |
|---|---|---|
| abebe@woldia.edu.et | Abebe@1234 | Requester |
| tigist@woldia.edu.et | Tigist@1234 | Approver |
| yonas@woldia.edu.et | Yonas@1234 | Technician |
| meron@woldia.edu.et | Meron@1234 | Manager |
| dawit@woldia.edu.et | Dawit@1234 | Store Keeper |
| admin@woldia.edu.et | Admin@1234 | Admin |

On the login page, clicking any account row auto-fills the email and password fields.

---

## Scripts

```bash
npm run dev      # Start development server on http://localhost:3000
npm run build    # Build for production
npm run start    # Start production server
```

---

Developed by Group 4 — Woldia University, Department of Software Engineering, 2026.
