# Whisper Vault Backend

## Overview
Whisper Vault is a backend application built with Node.js, TypeScript, Express, and Socket.IO. It serves as the backend for a secure messaging platform, allowing users to send encrypted messages to one another.

## Features
- **Express API**: A RESTful API for handling authentication and message operations.
- **Socket.IO**: Real-time communication for instant message delivery.
- **Prisma**: An ORM for interacting with a PostgreSQL database.
- **Zod**: Input validation for API requests.

## Getting Started

### Prerequisites
- Node.js (v22 or higher)
- PostgreSQL (v12 or higher)

### Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   cd server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up the environment variables:
   - Copy `.env.example` to `.env` and update the values as needed.

### Database Setup
1. Generate Prisma client:
   ```
   npx prisma generate
   ```

2. Run migrations:
   ```
   npx prisma migrate dev --name init
   ```

### Running the Application
To start the development server, run:
```
npm run dev
```

### API Endpoints
- **Authentication Routes**: `/api/auth` (to be implemented)
- **Message Routes**: `/api/messages` (POST to send messages)
- **Key Routes**: `/api/keys` (to be implemented)

### Socket.IO
The application uses Socket.IO for real-time messaging. Ensure that the front-end is configured to connect to the correct Socket.IO server URL.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements or features.

## License
This project is licensed under the MIT License. See the LICENSE file for details.