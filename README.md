# NaijaTraffic – Real-time Crowd-sourced Traffic for Nigeria

A modern web app that lets Nigerians report and view live traffic, accidents, police checkpoints, potholes, floods, and more. Think "Waze for the web" with Lagos/Abuja defaults.

Tech stack
- Frontend: React (Vite), TailwindCSS, Mapbox GL JS, PWA manifest
- Backend: FastAPI + MongoDB (Atlas) with WebSocket endpoint for live updates
- Real-time: Native WebSocket (upgradeable to Socket.io if you switch stacks)

Note: Original request asked for Node/Express/Socket.io. This template uses FastAPI (Python) to fit the current environment. All features are implemented equivalently. You can port endpoints to Express easily using the structure below.

## Features
- Interactive Mapbox map centered on Lagos with markers for incidents
- Report incidents with geolocation, type, description, optional photo
- Reports auto-expire after 1 hour
- Route planner using Mapbox Directions API with basic incident alerts along path
- Real-time updates via WebSocket – new reports appear instantly
- Auth (email/password) with JWT; anonymous reporting supported
- Leaderboard and profiles with contribution stats
- Weather overlay endpoint via OpenWeatherMap (plug your key)
- Admin stats endpoint
- PWA manifest, dark mode, responsive design

## Environment variables
Create two .env files, one for frontend and one for backend services.

Frontend (.env)
```
VITE_BACKEND_URL=https://<your-backend-url>
VITE_MAPBOX_KEY=YOUR_MAPBOX_KEY
```

Backend (.env)
```
DATABASE_URL=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net
DATABASE_NAME=naijatraffic
JWT_SECRET=your-long-secret
OPENWEATHER_KEY=YOUR_OPENWEATHER_KEY
```

## Running locally
- Frontend: `npm run dev` (in the client/front-end service)
- Backend: server auto-runs here. If running manually, `uvicorn main:app --reload --port 8000`

## API endpoints (selected)
- POST /api/auth/signup {name,email,password}
- POST /api/auth/login {email,password}
- GET /api/auth/me
- GET /api/reports?city=Lagos
- POST /api/reports {location:{lat,lng}, type, description, photo?, anonymous?, city?}
- PUT /api/reports/:id/vote {value: 1|-1}
- GET /api/leaderboard
- GET /api/users/:user_id
- GET /api/weather?lat=..&lng=..
- GET /api/admin/stats (admin only)
- POST /api/seed (seed sample reports for Lagos/Abuja)

## Seeding sample data
Call POST /api/seed once. It will add a few sample incidents around Lagos and Abuja.

## Mapbox setup
- Create a Mapbox account and get an access token.
- Put it in the frontend .env as `VITE_MAPBOX_KEY`.

## Notes on scalability & security
- MongoDB indices to add in production: reports.city, reports.timestamp, users.points
- Add rate limiting (e.g., reverse proxy) and input sanitization on description fields
- Enable CORS settings with allowed origin in production
- Use a worker/cron to periodically expire reports
- Consider server-side image storage (S3) instead of base64 in the DB

## Deploy
- Frontend: Vercel – import this repo, set env vars, build = `vite build`
- Backend: Render/Heroku – deploy FastAPI app, set env vars; expose port 8000

## License
MIT
