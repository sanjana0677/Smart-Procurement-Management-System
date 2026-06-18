require("dotenv").config({
  path: require("path").join(__dirname, "../../.env"),
});
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

// Register a new user
router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // 1. Check for required fields
    if (!name || !email || !password || !role) {
      throw new Error("Required field missing");
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedName || !trimmedEmail || !trimmedPassword || !role) {
      throw new Error("Required field missing");
    }

    // 2. Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      throw new Error("Invalid input data");
    }

    // 3. Validate name format
    if (trimmedName.length < 2 || trimmedName.length > 100) {
      throw new Error("Invalid input data");
    }

    // 4. Validate password (at least 6 characters for security)
    if (trimmedPassword.length < 6) {
      throw new Error("Invalid input data");
    }

    // 5. Validate role
    if (!["Customer", "Seller", "Admin"].includes(role)) {
      throw new Error("Invalid input data");
    }

    // 6. Check if user exists
    const [existingUsers] = await db.execute(
      "SELECT * FROM Users WHERE Email = ?",
      [trimmedEmail],
    );
    if (existingUsers.length > 0) {
      throw new Error("Email already exists");
    }

    // 7. Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(trimmedPassword, saltRounds);

    // 8. Insert user
    const [result] = await db.execute(
      "INSERT INTO Users (Name, Email, Password, Role) VALUES (?, ?, ?, ?)",
      [trimmedName, trimmedEmail, hashedPassword, role],
    );

    res.status(201).json({
      message: "User registered successfully",
      userId: result.insertId,
    });
  } catch (error) {
    next(error);
  }
});

// Login
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new Error("Required field missing");
    }

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      throw new Error("Required field missing");
    }

    // Find user
    const [users] = await db.execute("SELECT * FROM Users WHERE Email = ?", [
      trimmedEmail,
    ]);
    if (users.length === 0) {
      const err = new Error("Invalid credentials");
      err.status = 401;
      throw err;
    }

    const user = users[0];

    // Check password
    const passwordMatch = await bcrypt.compare(trimmedPassword, user.Password);
    if (!passwordMatch) {
      const err = new Error("Invalid credentials");
      err.status = 401;
      throw err;
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.User_ID, role: user.Role, name: user.Name },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.User_ID,
        name: user.Name,
        email: user.Email,
        role: user.Role,
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
