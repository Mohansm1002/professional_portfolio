# Portfolio Frontend

React + Vite frontend for the portfolio.

## Run

```powershell
npm.cmd run dev
```

The frontend reads `frontend/.env` by default for local runs. Use `frontend/.env.example` for local setup and `frontend/.env.production.example` for deployment variables.

Default local API:

```powershell
VITE_API_BASE_URL=http://localhost:18080/api/v1
```

The production build also creates static `index.html` fallbacks for the admin routes so direct links like `/admin/login` and `/admin/messages` load correctly on static hosts.
