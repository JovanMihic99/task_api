# Task API

A dockerized REST API for managing tasks.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)

## Features

- CRUD operations for Tasks
- Database Migrations and Seeding
- JWT based User authentication
- Admin authorization for managing users
- Integration and Unit tests
- Detailed API Documentation for all endpoints

## Technologies Used

- **[Node.js](https://nodejs.org/)**: JavaScript runtime built on Chrome's V8 engine, used for building the backend of the API.
- **[Express.js](https://expressjs.com/)**: Web application framework for Node.js, used to create API routes and handle requests.
- **[Docker](https://www.docker.com/)**: Platform for developing, shipping, and running applications in containers, ensuring consistency across environments.
- **[PostgreSQL](https://www.postgresql.org/)**: Open-source relational database management system, used for storing and managing task data.
- **[Prisma](https://www.prisma.io/)**: A database toolkit that simplifies database access and management, used for interacting with PostgreSQL.
- **[Bcrypt](https://www.npmjs.com/package/bcrypt)**: Library for hashing passwords, used for secure authentication.
- **[JSONWebToken](https://jwt.io/)**: A compact, URL-safe means of representing claims to be transferred between two parties, used for user authentication.
- **[Swagger UI](https://swagger.io/tools/swagger-ui/)**: A tool for documenting and testing API endpoints in a user-friendly interface.
- **[TypeScript](https://www.typescriptlang.org/)**: A superset of JavaScript that adds static types, used to improve code quality and development experience.
- **[Jest](https://jestjs.io/)**: A testing framework for JavaScript, used for writing unit and integration tests.



## Installation

To run the API using Docker, follow these steps:

### 1. Clone the repository:

```bash
git clone https://github.com/JovanMihic99/task_api.git
```

### 2. Navigate to the project directory:

```bash
cd task_api
```
### 3. Add execution permissions to entripoint.sh
```bash
chmod +x entrypoint.sh
```
### 4. Environment variables:

Ensure that you have a `.env` file in the project root directory. The `.env` file should contain the following configurations:

```env
DATABASE_HOST=postgresql-db
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=task_api

DATABASE_URL=postgresql://${DATABASE_USER}:${DATABASE_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}

ACCESS_TOKEN_SECRET=YourSecret
```

You can customize the values (such as `DATABASE_USER`, `DATABASE_PASSWORD`, etc.) if you want a different setup.

### 5. Build the Docker image:

```bash
docker compose build
```

### 6. Run the Docker containers:
#### Production Environment
To start the API in `production` environment run:
```bash
docker compose up 
```
#### Development environment
To start the API in `dev` environtment run:
```bash
MODE=dev docker compose up 
```

#### Test environment
To start Unit and Integration tests run this command: 
```bash
MODE=test docker-compose run --rm task-api
```

## Usage

The API will be running on `http://localhost:3000`

When first starting the app, the database will be seeded with 100 randomly generated `basic users` (with their tasks respectively) and one `admin` user.
To log into the `admin` account send a `POST` request to the login route (more details available at API docs) with the following request body: 
```
{
"email": "admin@email.com",
"password": "password" 
}
```

### API Documentation

The Swagger-based API documentation can be found at `http://localhost:3000/api-docs/` (app must be running in `production` or `dev` environment).

### Available Routes

- **POST** `/api/users/signup`: Register a new user
- **POST** `/api/users/login`: Login to get an access token
- **GET** `/api/users`: Get all users (admin only)
- **POST** `/api/tasks`: Create a new task (authenticated users only)
- **GET** `/api/tasks`: Retrieve tasks (authenticated users only)
- **PUT** `/api/tasks/:id`: Update an existing task (authenticated users only)
- **DELETE** `/api/tasks/:id`: Delete a task (authenticated users only)
