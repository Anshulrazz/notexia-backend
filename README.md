# Notexia Backend

Backend for the Notexia student collaboration platform. This service provides APIs for user authentication, content management, and AI-powered features.

## Features

-   **User Authentication**: Secure user registration and login using JWT.
-   **Role-Based Access Control**: Different roles for students, moderators, and admins.
-   **Note Sharing**: Upload, view, and download notes and project files.
-   **Doubt Forum**: Ask questions and get answers from the community.
-   **Blog**: A space for students to write and share articles.
-   **Bookmarking**: Save important notes, doubts, and blogs for later.
-   **User Profiles**: Track reputation, points, and contributions.
-   **AI Services**:
    -   Generate hints for doubts.
    -   Automatically generate tags for content.
    -   Summarize blog posts.
    -   Generate answers for doubts.

## Tech Stack

-   **Backend**: Node.js, Express.js
-   **Database**: MongoDB with Mongoose
-   **Authentication**: JSON Web Tokens (JWT)
-   **AI**: OpenAI, Google Generative AI, and other models.
-   **File Uploads**: Multer
-   **Security**: Helmet, CORS, express-rate-limit, sanitize-html

## Getting Started

### Prerequisites

-   Node.js (v18 or higher)
-   MongoDB instance (local or cloud)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd ANSHUL/Backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the `Backend` directory and add the following variables:

    ```env
    # Environment
    NODE_ENV=development

    # MongoDB
    MONGO_URI=<your_mongodb_connection_string>

    # JWT
    JWT_SECRET=<your_jwt_secret>
    JWT_EXPIRE=7d

    # OpenAI (if used)
    OPENAI_API_KEY=<your_openai_api_key>
    ```

### Running the application

-   **Development mode (with hot-reloading):**
    ```bash
    npm run dev
    ```

-   **Production mode:**
    ```bash
    npm start
    ```

The server will start on the port specified in your environment or code (default is usually 3000 or 5000).

## API Endpoints

A collection of API endpoints and their payloads is available in the `API_ENDPOINTS.json` file.

## Folder Structure

```
.
├── config/         # Database and external service configurations
├── controllers/    # Express route handlers and business logic
├── middlewares/    # Custom middlewares (auth, error handling, etc.)
├── models/         # Mongoose schemas and models
├── routes/         # Express route definitions
├── services/       # Business logic for services like AI
├── server.js       # Main application entry point
└── ...
```