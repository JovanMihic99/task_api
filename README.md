# Task API

A dockerized REST API for managing tasks.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)

## Features

- Create new tasks
- Retrieve a list of tasks for authenticated users
- Update existing tasks
- Delete tasks
- User authentication with JWT
- Admin authorization for managing users
- Integration and Unit tests

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

### 3. Create an `.env` file:

In the root directory of the project, create a `.env` file to store your environment variables. The `.env` file should contain the following configuration:

```env
DATABASE_HOST=postgresql-db
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=task_api

DATABASE_URL=postgresql://${DATABASE_USER}:${DATABASE_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}

ACCESS_TOKEN_SECRET=YourSecret
```

You can customize the values (such as `DATABASE_USER`, `DATABASE_PASSWORD`, etc.) if you have a different setup.

### 4. Build the Docker image:

```bash
docker build -t task_api .
```

### 5. Run the Docker image:

```bash
docker compose up --build
```

This will start the PostgreSQL database, apply migrations, seed the database and start the Task API server.

## Usage

The API will be running on `http://localhost:3000` (or the port you’ve configured).

### API Documentation

The Swagger-based API documentation can be accessed at `http://localhost:3000/api-docs/`.

### Available Routes

- **POST** `/api/users/signup`: Register a new user
- **POST** `/api/users/login`: Login to get an access token
- **GET** `/api/users`: Get all users (admin only)
- **POST** `/api/tasks`: Create a new task (authenticated users only)
- **GET** `/api/tasks`: Retrieve tasks (authenticated users only)
- **PUT** `/api/tasks/:id`: Update an existing task (authenticated users only)
- **DELETE** `/api/tasks/:id`: Delete a task (authenticated users only)