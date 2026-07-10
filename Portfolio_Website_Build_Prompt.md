# Professional Developer Portfolio — Master Build Prompt
### (Landing Page + Fully Customizable Admin Panel)

> This document is written as a **ready-to-use build prompt**. Paste it into Claude Code / Cursor / any AI dev tool section-by-section, or hand it to a developer as the spec. It is based on the dark, animated developer-portfolio design shown in the reference video (glassmorphism cards, gradient accents, floating tech-stack icons around the hero photo, stats bar, project grid, timeline, testimonials, contact form).

---

## 1. TECH STACK (matches your CCTV platform stack)

| Layer | Choice |
|---|---|
| Frontend | React 18 + Vite + TailwindCSS + Framer Motion (for animations) |
| Icons | lucide-react + react-icons (for tech-stack logos) |
| Backend | Node.js + Express |
| Database / Auth / Storage | Supabase (Postgres + Supabase Auth (Email/Password for admin) + Storage for images/resume) |
| State | React Context / Zustand for admin panel |
| Deployment target | Vercel/Netlify (frontend) + Render/Railway (API) — mention if you want this added |

Everything on the public landing page is **driven by data from Supabase** — no hardcoded text/images — so the Admin Panel can fully control it.

---

## 2. LANDING PAGE — SECTION-BY-SECTION SPEC

### Global style
- Theme: dark mode base (`#0A0A12` background), glass cards (`bg-white/5 backdrop-blur border border-white/10 rounded-2xl`)
- Accent: purple → blue → cyan gradient (`from-indigo-500 via-purple-500 to-cyan-400`), used on buttons, glow blobs, underlines, active nav state
- Font: `Sora` or `Poppins` for headings, `Inter` for body
- Motion: fade-up on scroll (Framer Motion `whileInView`), floating/orbit animation on hero icons, hover-lift on all cards, gradient-glow blur blobs behind sections
- Fully responsive (mobile-first), sticky navbar with blur-on-scroll

### 2.1 Navbar
```
┌───────────────────────────────────────────────────────────┐
│ LOGO/Name        Home  About  Skills  Projects  Contact   [Hire Me] │
└───────────────────────────────────────────────────────────┘
```
- Sticky, transparent → blurred glass on scroll
- Mobile: hamburger → slide-in drawer
- "Hire Me" button = gradient pill, links to Contact section
- All nav labels + logo text/logo image pulled from admin

### 2.2 Hero Section
```
┌─────────────────────────────────────────────────────────────────┐
│  🟢 Available for Work                                           │
│                                                                    │
│  Hi, I'm [Name]                         ┌───────────────────┐   │
│  I'm a < Full Stack Developer >         │   gradient glow    │   │
│  (typewriter loop through roles array)  │   ┌───────────┐   │   │
│                                          │   │  PROFILE  │   │   │
│  Short bio / tagline paragraph          │   │   PHOTO   │   │   │
│                                          │   └───────────┘   │   │
│  [Download Resume]  [Contact Me →]      │ ⚛️  🟢  🐘  ▲ (orbit│   │
│  🔗 GitHub  LinkedIn  Twitter  Instagram│    tech icons)     │   │
│                                          └───────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```
- "Available for Work" = toggleable pulsing-dot badge (admin can turn on/off + edit text)
- Name, roles array (for typewriter effect), bio, profile photo, resume file, social links, 4–6 orbiting tech icons — **all admin-editable**
- Two CTA buttons: primary (gradient) + secondary (outline)

### 2.3 Stats Bar
```
[ 50+ Projects ]  [ 3+ Years Exp ]  [ 20+ Happy Clients ]  [ 100% Satisfaction ]
```
- 4 stat cards, each = icon + big number (count-up animation on scroll) + label
- Admin: add/remove/reorder stat cards, edit icon, number, label

### 2.4 About Section
```
┌───────────────┐   Who I Am
│   About Photo │   Paragraph bio (rich text)
│   (rounded,   │   • Highlight point 1
│   glow border)│   • Highlight point 2
└───────────────┘   [Download CV]
```
- Admin: photo, heading, rich-text bio, list of highlight bullets, CV file upload

### 2.5 Skills / Tech Stack Section
```
"My Tech Stack"
[React] [Node.js] [Tailwind] [Supabase] [PostgreSQL] [Figma] ... (icon grid)
```
- Grid of skill badges/cards: icon + name + optional proficiency % bar or level dots
- Grouped by category (Frontend / Backend / Tools) — category tabs optional
- Admin: full CRUD (add skill, choose icon from library or upload custom SVG, set proficiency %, set category, drag-to-reorder)

### 2.6 Services Section (What I Do)
```
┌──────────┐ ┌──────────┐ ┌──────────┐
│ 🖥️ Icon  │ │ 📱 Icon  │ │ 🎨 Icon  │
│ Web Dev  │ │ App Dev  │ │ UI/UX    │
│ desc...  │ │ desc...  │ │ desc...  │
└──────────┘ └──────────┘ └──────────┘
```
- Card grid (3–4 cols desktop, 1 col mobile), hover-glow + lift
- Admin: full CRUD per service card (icon, title, description, order)

### 2.7 Projects / Portfolio Section
```
Filter:  [ All ] [ Web ] [ Mobile ] [ UI/UX ]

┌───────────────┐ ┌───────────────┐ ┌───────────────┐
│  Project Image │ │  Project Image │ │  Project Image │
│  (hover overlay│ │                │ │                │
│  🔗 Live 🐙 Code│ │                │ │                │
│  Title          │ │                │ │                │
│  Tag Tag Tag    │ │                │ │                │
└───────────────┘ └───────────────┘ └───────────────┘
```
- Filterable grid by category, hover overlay reveals Live Demo / GitHub / "View Details" (opens modal with full description, gallery, tech tags, links)
- Admin: full CRUD per project — title, category, cover image, gallery images (multi-upload), description, tech-tag chips, live URL, repo URL, featured toggle, order/drag-reorder

### 2.8 Experience / Timeline Section
```
●──── 2024–Present   Senior Developer @ Company
│      description...
●──── 2022–2024      Developer @ Company
│      description...
●──── 2021–2022      Intern @ Company
```
- Vertical timeline (alternating left/right on desktop, single column mobile)
- Admin: CRUD per entry (role, company, start/end date or "Present", description, logo/icon)

### 2.9 Testimonials Section
```
◀  ┌─────────────────────────────┐  ▶
   │ ⭐⭐⭐⭐⭐  "Quote text..."     │
   │ 👤 Photo  Name — Designation │
   └─────────────────────────────┘
        ● ○ ○ ○  (dots)
```
- Auto-playing carousel, swipeable on mobile
- Admin: CRUD (client photo, name, designation/company, quote, star rating)

### 2.10 Contact Section
```
┌──────────────────┐   ┌────────────────────────────┐
│ Let's Talk        │   │ Name        [__________]   │
│ 📧 email          │   │ Email       [__________]   │
│ 📞 phone          │   │ Subject     [__________]   │
│ 📍 location       │   │ Message     [__________]   │
│ 🔗 social icons   │   │            [Send Message]  │
└──────────────────┘   └────────────────────────────┘
```
- Form submits to backend → stored in `contact_messages` table + optional email notification (Nodemailer/Resend)
- Admin: edit contact info/socials shown here; view/manage submitted messages (see Admin Panel §3.9)

### 2.11 Footer
```
Logo/Name   Quick Links   Social Icons
© 2026 [Name]. All rights reserved.        [▲ Back to top]
```
- Admin: footer text, quick links, copyright, socials (can reuse header socials)

---

## 3. ADMIN PANEL — FULLY CUSTOMIZABLE CONTROL CENTER

Login-protected (Supabase Auth, email+password) route at `/admin`. Sidebar layout, dark theme matching public site.

```
┌──────────────┬─────────────────────────────────────────┐
│ Dashboard    │                                          │
│ Hero         │      [Selected section editor]           │
│ About        │                                          │
│ Skills       │                                          │
│ Services     │                                          │
│ Projects     │                                          │
│ Experience   │                                          │
│ Testimonials │                                          │
│ Messages     │                                          │
│ Theme/Colors │                                          │
│ SEO/Settings │                                          │
│ Media Library│                                          │
└──────────────┴─────────────────────────────────────────┘
```

### 3.1 Dashboard (overview)
- Cards: total projects, total messages (unread count badge), total skills, resume last-updated date
- "Live Preview" button → opens public site in new tab

### 3.2 Hero Manager
- Fields: Name, availability badge (toggle + text), roles[] (repeatable input for typewriter), bio, profile photo upload, resume PDF upload, primary/secondary button text+links, social links (repeatable: platform + URL), orbiting tech icons (pick from icon library, up to 6)
- Live preview pane on the right as you edit

### 3.3 About Manager
- About photo upload, heading, rich-text editor (bio), highlight bullet list (add/remove), CV file (can reuse Hero's resume)

### 3.4 Skills Manager
- Table/grid view of skills, "+ Add Skill" modal (name, icon picker/upload, category dropdown, proficiency slider)
- Drag-and-drop reorder, inline edit/delete, category management (add/rename/delete categories)

### 3.5 Services Manager
- CRUD cards: icon picker, title, description, drag-reorder, show/hide toggle

### 3.6 Projects Manager
- Table with thumbnail, title, category, featured flag, actions (edit/delete/duplicate)
- Add/Edit form: title, category (dropdown, manageable), cover image, gallery (multi-image upload with drag reorder), description (rich text), tech tags (chip input), live URL, repo URL, featured toggle, publish/draft toggle
- Drag-and-drop to control display order

### 3.7 Experience Manager
- CRUD timeline entries: role, company, company logo, start date, end date/"Present" toggle, description, drag-reorder

### 3.8 Testimonials Manager
- CRUD: client photo, name, designation/company, quote, star rating (1–5), show/hide toggle

### 3.9 Messages (Inbox)
- Table of contact-form submissions: name, email, subject, message, received date, read/unread status
- Mark as read, reply via mailto, delete, filter by unread/all, export CSV

### 3.10 Theme & Branding
- Color pickers: primary gradient start/end color, background color, accent color — updates CSS variables live
- Font selector (Google Fonts dropdown for heading/body)
- Logo upload, favicon upload
- Dark/Light default mode toggle (if you want both themes supported)

### 3.11 SEO & Site Settings
- Site title, meta description, OG image upload, favicon
- Google Analytics / tracking script field
- Custom domain note field
- Social preview card preview

### 3.12 Media Library
- Grid of all uploaded images/files (from Supabase Storage), search/filter, delete unused files, copy URL

### 3.13 Admin Users (optional, if multiple admins)
- Invite additional admin, roles (Owner/Editor), reset password

---

## 4. DATABASE SCHEMA (Supabase / PostgreSQL)

| Table | Key Columns |
|---|---|
| `admin_users` | id, email, role, created_at |
| `hero_content` | id, name, availability_badge (bool), availability_text, roles (text[]), bio, profile_image_url, resume_url, primary_btn_text/link, secondary_btn_text/link, updated_at |
| `about_content` | id, heading, bio (text), highlights (text[]), photo_url, updated_at |
| `social_links` | id, platform, url, icon, order_index |
| `stats` | id, icon, number, suffix, label, order_index |
| `skills` | id, name, icon_url, category_id, proficiency, order_index |
| `skill_categories` | id, name, order_index |
| `services` | id, icon, title, description, order_index, is_visible |
| `projects` | id, title, slug, category_id, cover_image_url, description, live_url, repo_url, is_featured, is_published, order_index, created_at |
| `project_categories` | id, name |
| `project_images` | id, project_id (FK), image_url, order_index |
| `project_tags` | id, project_id (FK), tag_name |
| `experience` | id, role, company, company_logo_url, start_date, end_date, is_present, description, order_index |
| `testimonials` | id, client_name, designation, company, photo_url, quote, rating, is_visible, order_index |
| `contact_messages` | id, name, email, subject, message, is_read, created_at |
| `site_settings` | id, site_title, meta_description, og_image_url, favicon_url, primary_color, secondary_color, bg_color, font_heading, font_body, analytics_script, updated_at |
| `media_library` | id, file_url, file_name, file_type, uploaded_at |

Use Supabase **Row Level Security**: public `SELECT` allowed on all content tables (for the landing page); `INSERT/UPDATE/DELETE` restricted to authenticated admin role only. `contact_messages` allows public `INSERT` only.

---

## 5. API ENDPOINTS (Express, if not using Supabase client directly from frontend)

```
Public (landing page reads):
GET  /api/hero
GET  /api/about
GET  /api/stats
GET  /api/skills
GET  /api/services
GET  /api/projects?category=&featured=
GET  /api/projects/:slug
GET  /api/experience
GET  /api/testimonials
GET  /api/settings
POST /api/contact              (rate-limited, spam-protected)

Admin (JWT-protected via Supabase Auth):
PUT    /api/admin/hero
PUT    /api/admin/about
POST   /api/admin/stats            PUT/DELETE /api/admin/stats/:id
POST   /api/admin/skills           PUT/DELETE /api/admin/skills/:id
POST   /api/admin/services         PUT/DELETE /api/admin/services/:id
POST   /api/admin/projects         PUT/DELETE /api/admin/projects/:id
POST   /api/admin/experience       PUT/DELETE /api/admin/experience/:id
POST   /api/admin/testimonials     PUT/DELETE /api/admin/testimonials/:id
GET    /api/admin/messages         PATCH /api/admin/messages/:id (mark read)  DELETE /api/admin/messages/:id
PUT    /api/admin/settings
POST   /api/admin/media/upload     DELETE /api/admin/media/:id
```

---

## 6. FRONTEND FOLDER STRUCTURE

```
src/
├── components/
│   ├── landing/
│   │   ├── Navbar.jsx
│   │   ├── Hero.jsx
│   │   ├── StatsBar.jsx
│   │   ├── About.jsx
│   │   ├── Skills.jsx
│   │   ├── Services.jsx
│   │   ├── Projects.jsx
│   │   ├── ProjectModal.jsx
│   │   ├── Experience.jsx
│   │   ├── Testimonials.jsx
│   │   ├── Contact.jsx
│   │   └── Footer.jsx
│   ├── admin/
│   │   ├── AdminLayout.jsx (sidebar + topbar)
│   │   ├── DashboardHome.jsx
│   │   ├── HeroEditor.jsx
│   │   ├── AboutEditor.jsx
│   │   ├── SkillsManager.jsx
│   │   ├── ServicesManager.jsx
│   │   ├── ProjectsManager.jsx
│   │   ├── ExperienceManager.jsx
│   │   ├── TestimonialsManager.jsx
│   │   ├── MessagesInbox.jsx
│   │   ├── ThemeSettings.jsx
│   │   ├── SeoSettings.jsx
│   │   └── MediaLibrary.jsx
│   └── ui/ (shared: Button, Card, Modal, ImageUploader, RichTextEditor, IconPicker)
├── pages/
│   ├── Landing.jsx
│   ├── AdminLogin.jsx
│   └── AdminDashboard.jsx
├── context/ (AuthContext, ThemeContext)
├── lib/ (supabaseClient.js, api.js)
└── hooks/ (useCountUp, useTypewriter, useScrollReveal)
```

---

## 7. WHAT MAKES IT "FULLY CUSTOMIZABLE"

Every visible piece of text, image, color, icon, and order on the landing page maps to a row/column an admin can edit — nothing is hardcoded in JSX. Concretely, the admin can:
- Rewrite every heading/paragraph/button label on the site
- Reorder or hide entire sections' items (skills, services, projects, timeline, testimonials) via drag-and-drop
- Swap the color theme and fonts without touching code
- Add unlimited projects/skills/testimonials/experience entries
- Manage all uploaded media in one place
- Read and manage contact form submissions without checking email/server logs

---

**Next step suggestion:** I can turn any single section above (e.g., Hero + Admin Hero Editor, or Projects + Projects Manager) into actual React + Tailwind + Supabase code first, so you can validate the pattern before I generate the rest — similar to how we built the Admin Panel, Referral System, and Technician Portal docs. Let me know which section to build first.
