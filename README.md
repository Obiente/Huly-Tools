# Huly Tools

Modern admin dashboard and API for managing Huly platform instances. Manage users, workspaces, backups, and database operations from a secure web interface and a flexible API designed for easy integration with Huly.

## Overview

Dashboard: Use our hosted dashboard at [huly.obiente.org](https://huly.obiente.org). Everything runs client-side and is deployed on GitHub Pages for maximum security. No backend required; just connect to your own Huly API.

API: The API is built to make interfacing with Huly simple and reliable. Deploy the API service as part of your own Huly Docker Compose setup for seamless platform management and automation.

## Main Features

Intuitive dashboard for real-time platform management
API designed for easy integration and automation with Huly
Fast setup and secure deployment

## Deployment

**Dashboard:**
Visit [huly.obiente.org](https://huly.obiente.org) and connect to your Huly API instance.

**API:**
Add the following service to your `docker-compose.yml`:

```yaml
services:
  huly-admin-api:
    image: huly-tools/admin-api:latest
    ports:
      - "3001:3001"
    environment:
      - HULY_DB_URL=mongodb://mongodb:27017/huly
      - HULY_TRANSACTOR_URL=ws://transactor:3333
      - HULY_ACCOUNT_URL=http://account:3000
      - HULY_FRONT_URL=http://front:8080
      - API_SECRET=your-secure-api-key-here
      - CORS_ORIGIN=https://huly.obiente.org
    depends_on:
      - mongodb
      - transactor
      - account
    networks:
      - huly-network
```

## Architecture

`apps/admin`: Admin Dashboard
`packages/admin-api`: Admin API

## Configuration

Set API keys and endpoints in the dashboard UI. API environment variables are managed via `.env` or Docker Compose.

---

**Note:** Huly Tools is still early in development. Features and stability may change rapidly. Please use with caution and report any issues or feedback.

Made by Obiente with love.
