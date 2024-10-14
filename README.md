Exelaki Backend
===============

Overview
--------

This is the backend codebase for the Exelaki budgeting application. It provides APIs for managing users, budgets, income, expenses, and authentication. The backend is developed using Node.js and Express, with MongoDB as the database.

Prerequisites
-------------

To run the project, ensure you have the following installed:

-   Node.js (v16.x or higher)

-   npm or Yarn as the package manager

-   MongoDB (local or cloud-based instance)

Installation
------------

### Clone the repository:

```
git clone <repository-url>
cd exelaki-backend
```

### Install the dependencies:

```
npm install
# or
yarn install
```

Running the Development Server
------------------------------

To start the development server, run the following command:

### `npm start`

or

### `yarn start`

The server should be available at `http://localhost:5000`.

Project Structure
-----------------

-   `**src/config**`: Configuration files, including database setup and middleware.

-   `**src/controllers**`: Controllers that handle incoming requests and interact with models to perform CRUD operations.

-   `**src/models**`: Mongoose models representing the application's data structure.

-   `**src/routes**`: Defines the API endpoints and maps them to controllers.

-   `**src/middleware**`: Custom middleware functions for tasks such as authentication.

-   `**src/services**`: Business logic and functions interacting with third-party services.

-   `**src/utils**`: Utility functions used throughout the application.

Authentication Flow
-------------------

The backend uses JWT (JSON Web Token) for authentication.

-   **Login**: Generates an access token and refresh token upon successful authentication.

-   **Middleware**: Protects routes by verifying access tokens.

-   **Token Refresh**: Provides a mechanism to refresh tokens and maintain user sessions.

Available Scripts
-----------------

### `npm start`

Runs the server in production mode.

### `npm run dev`

Runs the server in development mode using Nodemon for hot-reloading.

Environment Variables
---------------------

Create a `.env` file in the root directory and configure the following environment variables:

```
PORT=5000
MONGO_URI=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>
REFRESH_TOKEN_SECRET=<your-refresh-token-secret>
```

These environment variables are used to configure the server, connect to the database, and manage authentication.

Dependencies
------------

-   **Express**: A minimal and flexible Node.js web application framework.

-   **Mongoose**: An ODM (Object Data Modeling) library for MongoDB and Node.js.

-   **JWT**: For issuing and verifying tokens for user authentication.

-   **Cookie-Parser**: Parses cookies attached to client requests for managing sessions.

Important Files
---------------

-   `**src/index.js**`: The entry point for the backend server.

-   `**src/controllers/authController.js**`: Manages user authentication (login, signup, token refresh).

-   `**src/routes/auth.js**`: Defines authentication routes.

Future Enhancements
-------------------

-   **Role-Based Access Control (RBAC)**: Add different user roles and permissions.

-   **API Rate Limiting**: Limit requests to prevent abuse.

-   **Improved Logging**: Implement a more comprehensive logging system for easier debugging and monitoring.

Contributing
------------

Contributions are welcome. To contribute:

1.  Fork the repository.

2.  Create a feature branch (`git checkout -b feature-name`).

3.  Commit your changes (`git commit -m 'Add some feature'`).

4.  Push to the branch (`git push origin feature-name`).

5.  Open a pull request.

License
-------

This project is licensed under the MIT License.