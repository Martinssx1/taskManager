# Full Stack Task Manager

A full-stack task management application built with React, Express, MySQL, and JWT authentication. Users can register, log in securely, and manage their personal tasks through a clean and responsive interface.

## Features

- User registration
- Secure login with JWT authentication
- Protected API routes
- Create tasks
- View all personal tasks
- Update existing tasks
- Delete tasks
- Filter tasks by status
- Responsive React frontend
- MySQL database integration

## Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- React Router
- Lucide React

### Backend

- Node.js
- Express.js
- MySQL
- JWT (jsonwebtoken)
- bcrypt
- dotenv

## Project Structure

```
FullStackTaskApp
│
├── Frontend
│   ├── src
│   ├── public
│   └── package.json
│
└── my-backend
    ├── controllers
    ├── middleware
    ├── routes
    ├── db.js
    └── package.json
```

## Installation

### Clone the repository

```bash
git clone <repository-url>
```

### Install frontend dependencies

```bash
cd Frontend
npm install
```

### Install backend dependencies

```bash
cd ../my-backend
npm install
```

## Environment Variables

Create a `.env` file inside the backend folder.

Example:

```
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=task_api

JWT_SECRET_KEY=your_secret_key
```

## Database

Create a MySQL database and import the required tables.

Example tables:

- users
- tasktable

## Running the application

### Start the backend

```bash
cd my-backend
npm run dev
```

or

```bash
node index.js
```

### Start the frontend

```bash
cd Frontend
npm run dev
```

The frontend will typically run on:

```
http://localhost:5173
```

The backend will run on:

```
http://localhost:3000
```

## API Endpoints

### Authentication

- POST `/auth/signup`
- POST `/auth/login`

### Tasks

- GET `/tasks`
- POST `/tasks`
- PUT `/tasks/:id`
- DELETE `/tasks/:id`

All task routes require a valid JWT token.

## Future Improvements

- Task categories
- Search functionality
- Pagination
- File attachments
- Due date reminders
- Dark mode
- Real-time updates using WebSockets
- Unit and integration tests

## What I Learned

This project helped me practice:

- Building REST APIs with Express
- Connecting React to a backend
- MySQL database design
- Password hashing with bcrypt
- JWT authentication
- Protected routes
- CRUD operations
- React Context
- React Hooks
- Organizing backend code with routes, controllers, and middleware

## Screenshots

### Login

![Login](./screenshots/login.png)

### Dashboard

![Dashboard](./screenshots/dashboard.png)

### Addtasks

![Addtask](./screenshots/Addtask.png)
