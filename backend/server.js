require("dotenv").config({ path: require("path").join(__dirname, ".env") });
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const db = require('./config/db');
const bcrypt = require('bcrypt');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files (serve the top-level frontend directory)
app.use(express.static(path.join(__dirname, "..", "frontend")));

// API Routes
app.use("/auth", require("./routes/auth"));
app.use("/orders", require("./routes/orders"));
app.use("/requests", require("./routes/requests"));
app.use("/quotations", require("./routes/quotations"));
app.use("/payments", require("./routes/payments"));

// Catch-all route to serve the main app
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "index.html"));
});

// Global Error Handler
app.use(require("./middleware/errorHandler"));

// Ensure an Admin user exists on startup
async function ensureAdminUser() {
  try {
    const [rows] = await db.execute('SELECT * FROM Users WHERE Role = ?', ['Admin']);
    if (rows.length === 0) {
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
      const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
      const adminName = process.env.ADMIN_NAME || 'Administrator';

      const hashed = await bcrypt.hash(adminPassword, 10);
      await db.execute('INSERT INTO Users (Name, Email, Password, Role) VALUES (?, ?, ?, ?)', [adminName, adminEmail, hashed, 'Admin']);
      console.log(`Created default admin user: ${adminEmail}`);
    }
  } catch (err) {
    console.error('Failed to ensure admin user:', err.message || err);
  }
}

// Start server
app.listen(PORT, async () => {
  console.log(`Server running at http://localhost:${PORT}`);
  await ensureAdminUser();
});
