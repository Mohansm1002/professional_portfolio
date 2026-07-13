# Deployment Environment

Use these values in the Render service Environment tabs. Keep real `.env` files out of Git; the committed `.env.production.example` files are templates only.

## Backend Service

Service root: `backend`

Set these variables from `backend/.env.production.example`:

```env
DATABASE_URL=jdbc:postgresql://ep-royal-block-at4q08vt-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require&channelBinding=require
DATABASE_USERNAME=neondb_owner
DATABASE_PASSWORD=replace-with-neon-password
CORS_ALLOWED_ORIGINS=https://professional-portfolio-1-4pcp.onrender.com
JWT_SECRET=replace-with-a-long-random-secret-of-at-least-32-characters
JWT_EXPIRATION_MINUTES=720
UPLOAD_DIR=uploads
SEED_ENABLED=true
SEED_ADMIN_EMAIL=mohan2005@admin.com
SEED_ADMIN_PASSWORD=replace-with-admin-password
```

Do not set `PORT` manually on Render; Render provides it and the backend reads it with `server.port=${PORT:18080}`.
If `SEED_ENABLED=true`, `SEED_ADMIN_PASSWORD` is required. This prevents deployments from creating an admin account with a public fallback password.
After the first successful deploy creates or updates the admin account, you can set `SEED_ENABLED=false` to stop resetting the admin password on every backend restart.

## Frontend Service

Service root: `frontend`

Set this build-time variable from `frontend/.env.production.example`:

```env
VITE_API_BASE_URL=https://professional-portfolio-o6m9.onrender.com/api/v1
```

Do not add admin passwords to frontend `VITE_*` variables. Vite exposes those values in the browser bundle.

## Render Notes

- In Render, open each service, go to Environment, then add variables one by one or use Add from `.env`.
- Save with "Save, rebuild, and deploy" after changing frontend `VITE_*` variables because they are baked into the production build.
- Keep the frontend CORS origin in `CORS_ALLOWED_ORIGINS` exactly aligned with the deployed frontend URL.
