# GOUP Event Payment App

GOUP Event Payment App is a backend service designed to manage event registrations, participant management, payment processing, and more. This project uses Next.js, Prisma, PostgreSQL, Redis, and other modern technologies.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js
- Docker
- Docker Compose
- npm (Node package manager)

## Setup Instructions

### Cloning the Repository

Start by cloning the repository to your local machine:

```bash
git clone https://github.com/elshadaghazade/goup_event_payment_app.git
cd goup-event-app
```

## Environment Setup

Copy the **.env.sample** file to create environment-specific files:

```bash
cp .env.sample .env
cp .env.sample .env.development
cp .env.sample .env.test
```

Edit these files to match your local and testing environment configurations. Ensure all necessary variables are set, such as **DATABASE_URL**, **REDIS_HOST**, **REDIS_PORT**, and **PAYMES_SECRET**.

## Docker Containers

Run the following command to start the required Docker containers for PostgreSQL and Redis:

```bash
docker-compose up -d
```

This command starts the development and test databases as well as the Redis container for caching.

## Database Migrations

Apply database migrations to your PostgreSQL instances:

```bash
npm run migrate
```

## Seeding the Database

To populate the database with initial data for testing:

```bash
npm run seed
```

## Running the Application

To start the application in development mode, run:

```bash
npm run dev
```

This command starts the Next.js server with hot reloading enabled.

## Testing

To run the automated tests, use:

```bash
npm run test
```

This command executes the test suite configured for the application.

## Database Documentation

You can view the database schema and relationships via the dbdiagram dashboard:

[GOUP Event App Database Diagram](https://dbdocs.io/elshadaghazade/GOUP_EVENT_APP)