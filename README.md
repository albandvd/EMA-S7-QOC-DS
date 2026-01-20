# Forest CO2 Absorption API

This project is a REST API that provides calculations for CO2 absorption by forests. It allows users to perform CRUD operations on forests and trees, and to get information about CO2 absorption and deforestation.

## How it was done

The application is written in **TypeScript** and follows a hexagonal architecture pattern, separating the code into four main layers:

*   **presentation**: This layer is responsible for handling HTTP requests and responses. It uses Express to define the API routes and controllers to handle the requests.
*   **application**: This layer contains the application services, which orchestrate the business logic. It uses ports and adapters to communicate with the domain and infrastructure layers.
*   **domain**: This layer contains the core business logic of the application. It includes the models (entities and value objects) and the domain services.
*   **infrastructure**: This layer is responsible for implementing the outbound ports defined in the application layer. It includes adapters for the database, external APIs, etc. In this project, simple in-memory repositories are used.

## How to launch the application

Install the dependencies:
```bash
pnpm i
```
Start the development server:
```bash
pnpm dev
```
Build the project:
```bash
pnpm build
```
Start the production server:
```bash
pnpm start 
```
Unit Test: 
```bash
pnpm test
```

The API will be available at `http://localhost:3000`
The swagger will be available at `http://localhost:3000/docs`