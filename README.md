# Damayanti API

Express.js REST API for the Damayanti application with full CRUD operations for all database entities.

## Features

- ✅ Full CRUD operations for all entities (Users, Containers, Sensor Data, Reports, Sheeps, Sheep Reports)
- ✅ JWT Authentication & Authorization
- ✅ Input validation with Joi
- ✅ PostgreSQL database with connection pooling
- ✅ RESTful API design
- ✅ Error handling middleware
- ✅ Security middleware (Helmet, CORS)
- ✅ Request logging
- ✅ Environment configuration

## Database Schema

The API supports the following entities:

- **Users**: User management with authentication
- **Containers**: Container tracking with location and user assignment
- **Sensor Data**: Temperature, humidity, gas, and pH readings from containers
- **Reports**: User-generated reports for containers
- **Sheeps**: Sheep management
- **Sheep Reports**: Feeding time and status tracking for sheeps

## Installation

1. **Clone the repository**
```bash
git clone <your-repo>
cd damayanti-api
```

2. **Install dependencies**
```bash
npm install
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
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication
- `POST /api/users/auth/register` - Register new user
- `POST /api/users/auth/login` - Login user

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
- `GET /` - API information and available endpoints

## Query Parameters

### Pagination
Most GET endpoints support pagination:
- `limit` - Number of records to return (default: 50)
- `offset` - Number of records to skip (default: 0)

### Filters
- **Containers**: `user_id`
- **Sensor Data**: `container_id`, `user_id`, `date_from`, `date_to`
- **Reports**: `user_id`, `container_id`
- **Sheep Reports**: `sheep_id`, `status`, `date_from`, `date_to`
- **Sheeps**: `name` (search)

## Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Request/Response Examples

### Register User
```bash
POST /api/users/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "full_name": "John Doe"
}
```

### Create Sensor Data
```bash
POST /api/sensor-data
Authorization: Bearer <token>
Content-Type: application/json

{
  "container_id": "123e4567-e89b-12d3-a456-426614174000",
  "temperature": 25.5,
  "humidity": 60.2,
  "gas": 0.03,
  "ph": 7.2,
  "user_id": "123e4567-e89b-12d3-a456-426614174001"
}
```

### Response Format
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data
  },
  "pagination": {
    "total": 100,
    "limit": 50,
    "offset": 0,
    "hasMore": true
  }
}
```

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

## Error Handling

The API includes comprehensive error handling:
- Validation errors (400)
- Authentication errors (401)
- Authorization errors (403)
- Not found errors (404)
- Database constraint errors (400)
- Internal server errors (500)

## Security Features

- Helmet.js for security headers
- CORS configuration
- JWT token authentication
- Input validation and sanitization
- SQL injection prevention with parameterized queries
- Password hashing with bcrypt

## Development

```bash
# Install dependencies
npm install

# Run in development mode with auto-reload
npm run dev

# Run tests
npm test
```

## License

ISC