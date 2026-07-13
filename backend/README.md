# Portfolio Backend

Spring Boot API for the customizable developer portfolio.

## Run

```powershell
mvn.cmd spring-boot:run
```

Without PostgreSQL/Docker, you can smoke-test the API with the in-memory local profile:

```powershell
mvn.cmd spring-boot:run -Dspring-boot.run.profiles=local
```

Default settings:

- API: `http://localhost:18080/api/v1`
- PostgreSQL: Neon pooled database `ep-royal-block-at4q08vt-pooler.c-9.us-east-1.aws.neon.tech/neondb`
- Seeded admin: `mohan2005@admin.com`
- Seeded password: `mohanadmin`

Override with environment variables when needed:

```powershell
$env:DATABASE_URL="jdbc:postgresql://ep-royal-block-at4q08vt-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require&channelBinding=require"
$env:DATABASE_USERNAME="neondb_owner"
$env:DATABASE_PASSWORD="<database-password>"
$env:JWT_SECRET="replace-with-a-long-random-secret-of-at-least-32-characters"
```

## Main Endpoints

Public:

- `GET /api/v1/hero`
- `GET /api/v1/about`
- `GET /api/v1/stats`
- `GET /api/v1/skills`
- `GET /api/v1/services`
- `GET /api/v1/projects`
- `GET /api/v1/projects/{slug}`
- `GET /api/v1/experience`
- `GET /api/v1/testimonials`
- `GET /api/v1/settings`
- `POST /api/v1/contact`
- `POST /api/v1/auth/login`

Protected with `Authorization: Bearer <token>`:

- `PUT /api/v1/admin/hero`
- `PUT /api/v1/admin/about`
- `PUT /api/v1/admin/settings`
- CRUD routes for `stats`, `skills`, `services`, `projects`, `experience`, `testimonials`
- `GET/PATCH/DELETE /api/v1/admin/messages`
- `POST /api/v1/admin/media/upload`
- `DELETE /api/v1/admin/media/{id}`
