# Contract and Payment Service Application

This application is a **Contract and Payment Service** built with NestJS, Prisma, and PostgreSQL. It manages profiles, contracts, and jobs, focusing on efficient handling of transactions, concurrency, and adherence to best practices in software development.

## Table of Contents

- [Contract and Payment Service Application](#contract-and-payment-service-application)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Installation](#installation)
  - [Database Setup](#database-setup)
  - [Seeding the Database](#seeding-the-database)
  - [Running the Application](#running-the-application)
  - [Testing](#testing)
    - [Unit Tests](#unit-tests)
    - [End-to-End (E2E) Tests](#end-to-end-e2e-tests)
  - [API Documentation](#api-documentation)
  - [Technologies Used](#technologies-used)
  - [Project Structure](#project-structure)
  - [Reference](#reference)
  - [Author](#author)
  - [License](#license)

## Features

- **Profile Management**: Manages client and contractor profiles.
- **Contract and Job Management**: Handles contracts between clients and contractors, and tracks jobs associated with contracts.
- **Payment Processing**: Manages payments for jobs, ensuring transaction safety and handling race conditions.
- **Admin Functionality**: Provides admin APIs to retrieve the best profession and best clients based on earnings.
- **Authentication**: Basic authentication using middleware to verify `profile-id` from headers.

## Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/m-azra3l/contract-payment-service.git
   cd contract-payment-service
   ```

2. **Install Dependencies**:

   Make sure you have [Node.js](https://nodejs.org/) installed, then run:

   ```bash
   yarn install
   ```

3. **Set Up Environment Variables**:

   Create a `.env` file in the root directory and configure your database connection:

   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/contract_payment"
   PORT=5000
   ```

## Database Setup

1. **Prisma Migrations**:

   Run Prisma migrations to set up your database schema:

   ```bash
   npx prisma migrate dev --name init
   ```

2. **Prisma Client**:

   Generate the Prisma Client to interact with your database:

   ```bash
   npx prisma generate
   ```

## Seeding the Database

The application includes a seed script to populate the database with initial data:

1. **Run the Seed Script**:

   ```bash
   yarn seed
   ```

   This script creates 4 clients and 4 contractors, each with associated contracts and jobs.

## Running the Application

Start the application by running:

```bash
yarn start
```

The server will start on the port specified in your `.env` file (`5000` by default).

## Testing

### Unit Tests

To run unit tests, use:

```bash
yarn test
```

### End-to-End (E2E) Tests

To run E2E tests, use:

```bash
yarn test:e2e
```

These tests cover the major functionalities, ensuring that each part of the application works correctly in isolation (unit tests) and as a whole (E2E tests).

## API Documentation

Swagger is used to document the API. Once the application is running, you can access the API documentation at:

```
http://localhost:5000/api-docs
```

## Technologies Used

- **NestJS**: A progressive Node.js framework for building efficient, reliable, and scalable server-side applications.
- **Prisma**: An ORM that helps manage data in databases with ease and efficiency.
- **PostgreSQL**: A powerful, open-source object-relational database system.
- **Swagger**: API documentation made easy.
- **Jest**: Testing framework for unit and E2E tests.

## Project Structure

```
contract-payment-service/
│
├── prisma/
|   ├── migrations/
│   ├── schema.prisma
│   ├── seed.ts
|
├── src/
│   ├── admin/
│   │   ├── admin.controller.ts
│   │   ├── admin.module.ts 
│   │   ├── admin.service.ts
│   ├── app/
|   |   ├── app.controller.ts
│   |   ├── app.module.ts
│   |   ├── app.service.ts
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.middleware.ts
|   |   ├── auth.module.ts
│   ├── balances/
│   │   ├── balances.controller.ts
│   │   ├── balances.module.ts
│   │   ├── balances.service.ts
│   ├── config/
│   │   ├── app.config.ts
│   ├── contracts/
│   │   ├── contracts.controller.ts
│   │   ├── contracts.module.ts
│   │   ├── contracts.service.ts
│   │   ├── dto/
│   │   ├── entities/
│   ├── jobs/
│   │   ├── jobs.controller.ts
│   │   ├── jobs.module.ts
│   │   ├── jobs.service.ts
│   ├── prisma/
│   │   ├── prisma.module.ts
│   │   ├── prisma.service.ts
│   ├── main.ts
|
├── test/
│   ├── admin/
|   |   ├── admin.controller.spec.ts
|   |   ├── admin.e2e-specs.ts
|   |   ├── admin.service.ts
│   ├── app/
|   |   ├── app.controller.spec.ts
|   |   ├── app.e2e-spec.ts
│   ├── auth/
|   |   ├── auth.e2e-spec.ts
|   |   ├── auth.middleware.spec.ts
│   ├── balances/
│   │   ├── balances.controller.spec.ts
│   │   ├── balances.e2e-spec.ts
│   │   ├── balances.service.spec.ts
│   ├── contracts/
│   │   ├── contracts.controller.spec.ts
│   │   ├── contracts.e2e-spec.ts
│   │   ├── contracts.service.spec.ts
│   ├── jobs/
│   │   ├── jobs.controller.spec.ts
│   │   ├── jobs.e2e-spec.ts
│   │   ├── jobs.service.spec.ts
│   ├── prisma/
│   │   ├── prisma.e2e-spec.ts
│   │   ├── prisma.service.spec.ts
|   ├── jest-e2e.json
│
├── .env(ignored)
├── .eslintrc.js
├── .gitignore
├── .prettierrc
├── Backend Engineer - Coding Exercise.pdf
├── jest.config.js
├── LICENSE
├── nest-cli.json
├── package.json
├── README.md
├── tsconfig.build.json
├── tsconfig.json
├── yarn.lock(ignored)
```

## Reference

This application was built as part of a coding exercise. For more details on the requirements and design, please refer to the provided document: **[Backend Engineer - Coding Exercise](./[Backend%20Engineer%20-%20Coding%20Exercise.pdf](https://github.com/m-azra3l/contract-payment-service/blob/main/Backend%20Engineer%20-%20%20Coding%20Exercise.pdf))**.

## Author

- [Michael Damilare Adesina](https://github.com/m-azra3l)

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
