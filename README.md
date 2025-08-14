# TodoCalendar Backend - Node.js

English | [中文](README-zh.md)

A robust backend API service for TodoCalendar application built with Node.js, Express, and TypeScript. This service provides user authentication, task management, and calendar functionality with MySQL database support.

## 🚀 Features

- **User Authentication**: Register, login with JWT token authentication
- **OAuth2 Integration**: Google OAuth2 login support
- **Task Management**: Create, read, update, delete tasks with date-based organization
- **Database Integration**: MySQL database with connection pooling
- **Input Validation**: Comprehensive request validation
- **Containerization**: Docker and Docker Compose support
- **Testing**: Unit tests with Jest framework
- **Environment Support**: Development and production configurations

## 🛠 Tech Stack

- **Runtime**: Node.js 22
- **Framework**: Express.js 5.x
- **Language**: TypeScript
- **Database**: MySQL 8.0
- **Authentication**: JWT + Google OAuth2
- **Testing**: Jest
- **Package Manager**: pnpm
- **Containerization**: Docker

## 📋 Prerequisites

- Node.js 22 or higher
- pnpm package manager
- MySQL 8.0
- Docker (optional)

## 🔧 Installation

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd TODOCalender-backend-node
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   Create environment files in `env/` directory:
   
   **env/.env.dev** (Development)
   ```env
   ENV=dev
   MYSQL_HOST=localhost
   MYSQL_DATABASE=todocalendar_dev
   MYSQL_ROOT_USER=root
   MYSQL_ROOT_PASSWORD=your_root_password
   MYSQL_USER=user
   MYSQL_PASSWORD=your_password
   JWT_SECRET=your_jwt_secret_key
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   FRONTEND_URL=http://localhost:5173
   ```

4. **Start development server**
   ```bash
   pnpm run dev
   ```

### Docker Deployment

1. **Development Environment**
   ```bash
   ./run.sh dev
   ```

2. **Production Environment**
   ```bash
   ./run.sh prod
   ```

The application will be available at:
- Development: `http://localhost:8081`
- Production: `http://localhost:8080`

## 📁 Project Structure

```
TODOCalender-backend-node/
├── src/
│   ├── api/                # API route handlers
│   │   ├── auth.ts        # Authentication routes
│   │   ├── oauth.ts       # OAuth2 routes
│   │   ├── tasks.ts       # Task management routes
│   │   └── user.ts        # User routes
│   ├── data/
│   │   └── db.ts          # Database connection and operations
│   ├── model/
│   │   ├── taskModel.ts   # Task model and operations
│   │   └── userModel.ts   # User model and operations
│   ├── app.ts             # Express application setup
│   └── utils.ts           # Utility functions and validation
├── __tests__/             # Test files
├── env/                   # Environment configuration files
├── docker-compose.yml     # Docker compose configuration
├── Dockerfile            # Docker configuration
└── run.sh                # Deployment script
```

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/user` - Get current user info
- `POST /api/auth/logout` - User logout

### OAuth2
- `GET /api/oauth2/authorize/google` - Initiate Google OAuth2 flow
- `GET /api/oauth2/callback/google` - Google OAuth2 callback

### Tasks
- `POST /api/tasks/all` - Get tasks by date
- `POST /api/tasks/create` - Create new task
- `POST /api/tasks/update/:id` - Update task
- `POST /api/tasks/delete/:id` - Delete task

### Users
- User management routes (placeholder)

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    provider VARCHAR(255),
    providerId VARCHAR(255)
);
```

### Calendar Table
```sql
CREATE TABLE calendar (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    details VARCHAR(255),
    checked BOOLEAN NOT NULL,
    important BOOLEAN NOT NULL,
    createTime DATETIME NOT NULL,
    expireTime DATETIME,
    updateTime DATETIME NOT NULL,
    createDate DATE NOT NULL,
    userName VARCHAR(255) NOT NULL
);
```

## 🧪 Testing

Run all tests:
```bash
pnpm test
```

The test suite includes:
- Database operations testing
- Utility functions testing
- API endpoint testing

## 🔐 Authentication

The application supports two authentication methods:

1. **JWT Authentication**: Traditional email/password with JWT tokens
2. **Google OAuth2**: Social login via Google accounts

JWT tokens are stored in HTTP-only cookies for security and have a 24-hour expiration.

## 🐳 Docker Configuration

The application includes comprehensive Docker support:

- **Multi-stage builds** for optimized production images
- **Health checks** for MySQL database
- **Resource limits** for CPU and memory usage
- **Network isolation** with custom bridge network
- **Volume persistence** for MySQL data

## 🚀 Deployment

### Development
```bash
./run.sh dev
```

### Production
```bash
./run.sh prod
```

### Manual Docker Commands
```bash
# Development
ENV_FILE=env/.env.dev docker compose --project-name myapp_dev up --build -d

# Production  
ENV_FILE=env/.env.prod APP_PORT=8080 docker compose --project-name myapp_prod up --build -d
```

## 📝 Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `ENV` | Environment (dev/prod) | - | Yes |
| `APP_PORT` | Application port | 8081 | No |
| `MYSQL_HOST` | MySQL host | localhost | Yes |
| `MYSQL_DATABASE` | Database name | todocalendar_dev | Yes |
| `MYSQL_ROOT_USER` | Root user | root | Yes |
| `MYSQL_ROOT_PASSWORD` | Root password | - | Yes |
| `MYSQL_USER` | App user | user | Yes |
| `MYSQL_PASSWORD` | App password | - | Yes |
| `JWT_SECRET` | JWT secret key | - | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | - | Yes |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret | - | Yes |
| `FRONTEND_URL` | Frontend URL | http://localhost:5173 | Yes |

## 📄 API Response Format

All API responses follow a consistent format:

```json
{
  "result": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

## 🔍 Monitoring

View application logs:
```bash
# Development
docker compose -p myapp_dev logs -f app

# Production
docker compose -p myapp_prod logs -f app
```

Access MySQL:
```bash
# Development
docker exec -it myapp_dev-mysql-1 bash

# Production
docker exec -it myapp_prod-mysql-1 bash
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Ensure MySQL is running and accessible
   - Check environment variables
   - Verify network connectivity in Docker

2. **Authentication Issues**
   - Verify JWT_SECRET is set
   - Check Google OAuth2 credentials
   - Ensure cookies are enabled

3. **Port Conflicts**
   - Check if ports 8080/8081 are available
   - Modify APP_PORT in environment file

### Debug Mode

Enable debug logging by setting `ENV=dev` in your environment file.

## 📞 Support

For support and questions, please open an issue in the repository.