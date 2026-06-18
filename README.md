# Smart Procurement Management System

A simple web-based Smart Procurement Management System (SPMS) to manage purchase requests, receive and compare seller quotations, and generate orders.

## Features

- User registration and login (Customer, Seller, Admin)
- Create and manage purchase requests
- Seller quotation submission
- Compare and accept quotations
- Order generation and tracking
- Role-based access control
- JWT authentication and password hashing

## Tech Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express
- Database: MySQL

## Project Structure (important files)

- `backend/` - Express server, API routes, and backend logic
- `frontend/` - Static frontend files (HTML, CSS, JS)
- `database/schema.sql` - Database schema and table definitions

## Quick start

1. Install dependencies for backend:

```powershell
cd backend
npm install
```

2. Create a `.env` file in `backend/` with your DB and PORT settings, for example:

```
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=procure_db
JWT_SECRET=your_jwt_secret
```

3. Start the server:

```powershell
cd backend
npm start
```

4. Open the app in your browser:

http://localhost:3000

## Notes and next steps

- The repository contained duplicate files at the repository root (e.g., `customer.js`, `quotations.js`) which are duplicates of files in `frontend/` and `backend/routes/`. These were removed.
- `backend/node_modules_backup/` contained prebuilt binaries; these are now ignored via `.gitignore`. I recommend removing them from the repository (they can be recreated with `npm rebuild`) but left them in place in case you need to restore them.
- I updated the backend server static path so it serves the top-level `frontend/` directory (the app expects the frontend at project root).

If you'd like, I can also run a linter, refactor code for clarity, or apply further reorganization (move `frontend/` into `backend/` or vice versa). Tell me which you prefer.

---

Author: Sukanya Mamillapalli
