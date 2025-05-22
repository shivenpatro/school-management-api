# School Management API

This repository contains a simple Node.js + Express API backed by MySQL that allows you to:

1. Add new schools via `/addSchool` (POST)
2. Retrieve a list of schools sorted by distance from a given location via `/listSchools` (GET)

## Requirements

- Node.js >= 14.x
- MySQL 5.7+/8.x

## Setup

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Copy `env.sample` to `.env` and fill in your MySQL credentials:

```bash
cp env.sample .env
```

3. Start the server (development mode with auto-reload):

```bash
npm run dev
```

The API will be available at `http://localhost:3000` (or the `PORT` specified in `.env`).

> The first time the server starts it will automatically create the `schools` table if it does not exist.

## API Reference

### 1. Add School

```
POST /addSchool
```

Body (JSON):

```json
{
  "name": "ABC High School",
  "address": "123 Main St, City",
  "latitude": 12.9716,
  "longitude": 77.5946
}
```

### 2. List Schools

```
GET /listSchools?latitude=<userLat>&longitude=<userLon>
```

Returns an array of schools ordered by proximity with a `distance` field (km).

## Postman Collection

Import `SchoolManagementAPI.postman_collection.json` into Postman to try the endpoints quickly. Set the `base_url` collection variable to your deployed server URL if different.

## Deployment

The API can be deployed to any Node-compatible platform (e.g., Render, Railway, Vercel, Heroku). Ensure the environment variables are configured and the database is reachable from the platform.

---

### Deliverables

1. **Source code repository** – this GitHub repo: <REPLACE_WITH_REPO_LINK>
2. **Live API endpoints** – e.g., `https://your-app.onrender.com/addSchool` and `/listSchools` (replace with actual URL).
3. **Postman collection** – provided in the repository; also share via email or link. 