# Damayanti API

Express.js REST API for the Damayanti application with full CRUD operations for all database entities.

## Installation

1. **Clone the repository**
```bash
git clone <your-repo>
cd damayanti-api
```

2. **Install dependencies**
```bash
bun install
```

3. **Environment setup**
```bash
cp .env.example .env
# Edit .env with your database credentials and JWT secret
```

4. **Database setup**
```bash
# Run your migrations (using your migration tool)
# Make sure PostgreSQL is running and database is created
```

5. **Start the server**
```bash
# Development
bun run dev

# Production
bun start
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users` - Get all users (auth required)
- `GET /api/users/:id` - Get user by ID (auth required)
- `POST /api/users` - Create user (auth required)
- `PUT /api/users/:id` - Update user (auth required)
- `DELETE /api/users/:id` - Delete user (auth required)

### Containers
- `GET /api/containers` - Get all containers
- `GET /api/containers/:id` - Get container by ID
- `POST /api/containers` - Create container (auth required)
- `PUT /api/containers/:id` - Update container (auth required)
- `DELETE /api/containers/:id` - Delete container (auth required)

### Sensor Data
- `GET /api/sensor-data` - Get all sensor data
- `GET /api/sensor-data/:id` - Get sensor data by ID
- `GET /api/sensor-data/latest/:container_id` - Get latest sensor data for container
- `POST /api/sensor-data` - Create sensor data (auth required)
- `PUT /api/sensor-data/:id` - Update sensor data (auth required)
- `DELETE /api/sensor-data/:id` - Delete sensor data (auth required)

### Reports
- `GET /api/reports` - Get all reports
- `GET /api/reports/:id` - Get report by ID
- `POST /api/reports` - Create report (auth required)
- `PUT /api/reports/:id` - Update report (auth required)
- `DELETE /api/reports/:id` - Delete report (auth required)

### Sheeps
- `GET /api/sheeps` - Get all sheeps
- `GET /api/sheeps/:id` - Get sheep by ID
- `POST /api/sheeps` - Create sheep (auth required)
- `PUT /api/sheeps/:id` - Update sheep (auth required)
- `DELETE /api/sheeps/:id` - Delete sheep (auth required)

### Sheep Reports
- `GET /api/sheep-reports` - Get all sheep reports
- `GET /api/sheep-reports/:id` - Get sheep report by ID
- `GET /api/sheep-reports/recent/:status` - Get recent reports by status
- `POST /api/sheep-reports` - Create sheep report (auth required)
- `PUT /api/sheep-reports/:id` - Update sheep report (auth required)
- `DELETE /api/sheep-reports/:id` - Delete sheep report (auth required)

### Utility
- `GET /api/health` - Health check endpoint

## Environment Variables

```env
NODE_ENV=development
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=damayanti_db
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# API
API_VERSION=v1
CORS_ORIGIN=*
```

## Development

```bash
# Install dependencies
bun install

# Run in development mode with auto-reload
bun run dev

# Run tests
bun test
```

## License

ISC