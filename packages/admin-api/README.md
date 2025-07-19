# Huly Admin API

This package provides a REST API service for managing Huly platform instances. It's designed to be deployed alongside your Huly compose setup.

## Features

- **Account Management**: Create, list, and manage user accounts
- **Workspace Management**: Create, configure, and manage workspaces
- **Backup & Restore**: Backup and restore workspace data
- **Database Operations**: Migrations, indexing, and maintenance
- **Statistics**: Platform usage and health metrics
- **Security**: Role-based access control and API key authentication

## Installation

### Using Docker Compose

Add this service to your existing Huly `docker-compose.yml`:

```yaml
services:
  # ... your existing Huly services

  admin-api:
    image: huly-tools/admin-api:latest
    ports:
      - "3001:3001"
    environment:
      - HULY_DB_URL=mongodb://mongodb:27017/huly
      - HULY_TRANSACTOR_URL=ws://transactor:3333
      - HULY_ACCOUNT_URL=http://account:3000
      - HULY_FRONT_URL=http://front:8080
      - API_SECRET=your-secret-key-here
      - CORS_ORIGIN=http://localhost:4321
    depends_on:
      - mongodb
      - transactor
      - account
    networks:
      - huly-network
```

### Manual Installation

1. Clone and build:
```bash
git clone https://github.com/your-org/huly-tools
cd huly-tools/packages/admin-api
npm install
npm run build
```

2. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Start the service:
```bash
npm start
```

## Configuration

### Environment Variables

- `HULY_DB_URL`: MongoDB connection string
- `HULY_TRANSACTOR_URL`: Huly transactor WebSocket URL
- `HULY_ACCOUNT_URL`: Huly account service URL
- `HULY_FRONT_URL`: Huly frontend URL
- `API_SECRET`: Secret key for API authentication
- `CORS_ORIGIN`: Allowed CORS origin for the admin dashboard
- `PORT`: API server port (default: 3001)

### API Authentication

The API uses API key authentication. Include the key in requests:

```bash
curl -H "X-API-Key: your-api-key" http://localhost:3001/api/accounts
```

## API Endpoints

### Accounts
- `GET /api/accounts` - List all accounts
- `POST /api/accounts` - Create new account
- `PUT /api/accounts/:id` - Update account
- `DELETE /api/accounts/:id` - Delete account

### Workspaces
- `GET /api/workspaces` - List all workspaces
- `POST /api/workspaces` - Create new workspace
- `PUT /api/workspaces/:id` - Update workspace
- `DELETE /api/workspaces/:id` - Delete workspace

### Backup & Restore
- `POST /api/backup` - Create backup
- `GET /api/backups` - List backups
- `POST /api/restore` - Restore from backup

### Database Operations
- `POST /api/db/migrate` - Run database migrations
- `POST /api/db/index` - Rebuild indexes
- `POST /api/db/clean` - Clean database

### Statistics
- `GET /api/stats` - Get platform statistics
- `GET /api/health` - Health check

## Usage with Admin Dashboard

The admin dashboard at `http://localhost:4321` will automatically connect to this API when properly configured.

## Security

- Always use HTTPS in production
- Keep API keys secure and rotate them regularly
- Configure CORS properly for your domain
- Monitor API access logs
- Use firewall rules to restrict access

## Development

```bash
npm run dev    # Start development server
npm run build  # Build for production
npm run lint   # Run linting
```

## License

MIT
