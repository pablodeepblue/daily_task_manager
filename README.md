# Week Planner

[![CI](../../actions/workflows/ci.yml/badge.svg)](../../actions/workflows/ci.yml)
![React 19](https://img.shields.io/badge/React-19-149eca?logo=react&logoColor=white)
![React Router 8](https://img.shields.io/badge/React_Router-8-ca4245?logo=reactrouter&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-ready-2496ed?logo=docker&logoColor=white)

A responsive weekly task planner built with React Router, React, TypeScript,
and Tailwind CSS. It supports day-by-day planning, full and minimum task views,
task completion tracking, plan locking, and task reordering.

## Tech tags

`react` `react-router` `typescript` `tailwindcss` `vite` `docker`

## Requirements

- Node.js 24 or later
- npm
- Docker (optional, for containerized runs)

## Run locally

Install dependencies and start the development server:

```bash
npm ci
npm run dev
```

Open <http://localhost:5173>.

## Validate and build

```bash
npm run typecheck
npm run build
npm run start
```

The production server listens on <http://localhost:3000> by default.

## Run with Docker

Build the production image and start it:

```bash
docker build -t week-planner .
docker run --rm -p 3000:3000 week-planner
```

Open <http://localhost:3000>.

The image uses a multi-stage build: dependencies are installed, the React Router
application is compiled, and only production dependencies plus the generated
`build/` output are copied into the final Node 24 Alpine image.

## Continuous integration

GitHub Actions runs for every push and pull request. The workflow:

1. Installs dependencies with `npm ci`.
2. Runs TypeScript and React Router type generation checks.
3. Creates a production build.
4. Builds the Docker image to catch container deployment failures.

See [.github/workflows/ci.yml](.github/workflows/ci.yml) for the complete CI
definition.

## Project structure

```text
app/
  routes/home.tsx             # Home route
  welcome/week-planner.tsx    # Planner UI and interactions
  app.css                     # Global Tailwind entry point
.github/workflows/ci.yml      # CI checks
Dockerfile                    # Production image
```
