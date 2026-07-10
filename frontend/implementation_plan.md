# Professional Developer Portfolio Implementation Plan

This plan outlines the steps to build the frontend of the dark-themed, animated, and fully customizable developer portfolio, followed by a detailed specification for the backend.

## User Review Required

> [!IMPORTANT]  
> Please review the proposed approach for the frontend mock data. Since the backend is not built yet, the frontend will initially use a `mockData.js` file that mimics the exact structure of the PostgreSQL database. This will allow the UI to be fully data-driven from the start. Once the backend is ready, we simply swap the mock data import with API calls.
> 
> Also, do you prefer `npm`, `yarn`, or `pnpm` for package management? I will use `npm` by default if not specified.

## Proposed Changes

We will divide the work into building the frontend first, followed by providing the backend details.

### 1. Frontend Setup & Tooling
- Initialize a React 18 application using Vite in the workspace.
- Install and configure **Tailwind CSS** for styling, adhering to the dark theme (`#0A0A12`) and glassmorphism specifications.
- Install dependencies: `framer-motion` (animations), `lucide-react` & `react-icons` (icons), `react-router-dom` (routing).

### 2. Frontend Architecture & Routing
- Set up the folder structure as specified: `src/components`, `src/pages`, `src/context`, `src/lib`, `src/ui`, `src/hooks`.
- Configure React Router to separate the public landing page (`/`) from the admin panel (`/admin/*`).
- Create a centralized mock data store (`src/lib/mockData.js`) mapping exactly to the proposed database schema.

### 3. Core UI Components & Landing Page
- Build reusable UI components in `src/ui/`: `Button`, `Card`, `Section`, `Badge`.
- Implement the **Landing Page** (`src/pages/Landing.jsx`) composed of:
  - `Navbar`: Sticky, glassmorphism, responsive.
  - `Hero`: Orbiting tech icons, typewriter effect for roles, glowing blobs.
  - `StatsBar`, `About`, `Skills`, `Services`, `Projects`, `Experience`, `Testimonials`, `Contact`, `Footer`.
- Integrate `framer-motion` for scroll reveals, hover lifts, and specific animations like the Hero's orbiting icons.

### 4. Admin Panel Skeleton
- Build the `AdminLayout` with a sidebar navigation.
- Implement the `AdminDashboard` and a few key editors (e.g., `HeroEditor`, `ProjectsManager`) to demonstrate the customizable control center pattern.
- Mock the authentication flow to allow entry into the `/admin` routes.

---

## Backend Specification

Once the frontend is built and validated, the backend will be constructed to make the portfolio dynamic. Here is the full detail of the backend to be built, updated per your requirements:

### Architecture
- **Language/Runtime**: Java
- **Framework**: Spring Boot
- **Database**: PostgreSQL
- **Authentication**: Spring Security with JWT (JSON Web Tokens) for Admin access
- **Storage**: Amazon S3 (or Local File System) for uploading images, resume PDFs, etc.
- **ORM/Data Access**: Spring Data JPA / Hibernate

### Database Schema (PostgreSQL)
The database will contain tables representing each section of the site:
- `admin_users`, `hero_content`, `about_content`, `social_links`, `stats`, `skills`, `skill_categories`, `services`, `projects`, `project_categories`, `project_images`, `project_tags`, `experience`, `testimonials`, `contact_messages`, `site_settings`.
- **Security**: The backend Spring Security config will expose public read-only endpoints, while requiring a valid JWT for any `POST/PUT/DELETE` operations.

### RESTful API Endpoints (Spring Boot Controllers)
The Spring Boot server will serve JSON responses to the frontend.

**Public Endpoints (Read-Only):**
- `GET /api/v1/hero`, `/api/v1/about`, `/api/v1/stats`, `/api/v1/skills`, `/api/v1/services`, `/api/v1/projects`, `/api/v1/experience`, `/api/v1/testimonials`, `/api/v1/settings`
- `POST /api/v1/contact` (Accepts contact form submissions, stores in DB, optionally triggers an email via JavaMailSender. Needs rate limiting).
- `POST /api/v1/auth/login` (Authenticates admin and returns JWT).

**Protected Admin Endpoints (Requires JWT):**
- `PUT /api/v1/admin/hero`, `/api/v1/admin/about`, `/api/v1/admin/settings`
- `POST / PUT / DELETE` routes for `stats`, `skills`, `services`, `projects`, `experience`, `testimonials`
- `GET / PATCH / DELETE /api/v1/admin/messages`
- `POST /api/v1/admin/media/upload`, `DELETE /api/v1/admin/media/:id`

## Verification Plan

### Automated Verification
- Verify that the Vite dev server starts without errors and the build succeeds (`npm run build`).
- Verify ESLint passes on the new codebase.

### Manual Verification
- The user will interact with the local development server to ensure the landing page reflects the dark, animated aesthetic specified.
- The user will navigate to the `/admin` route to verify the dashboard layout.
