const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const userRoutes = require("./routes/userRoutes");
const authService = require("./services/authService"); // Ensure the path is correct based on your project structure
const User = require("./models/User");
const jwt = require("jsonwebtoken");
require("./utils/passport-setup");

// Passport configuration

const app = express();
const PORT = process.env.PORT || 3000;

// Configure session management
app.use(
  session({
    secret: "replace_with_a_real_secret", // Ensure this is a secure secret and ideally environment-specific
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true, httpOnly: true }, // Consider using secure: true in production
  })
);

// Initialize passport for authentication
app.use(passport.initialize());
app.use(passport.session());

// Body parser middleware to parse JSON payloads
app.use(bodyParser.json());

// Middleware to authenticate JWT tokens
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN
  if (!token) return res.sendStatus(401); // No token provided

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Token verification failed
    req.user = user;
    next();
  });
};

// Google OAuth routes
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // Successful authentication, issue token and redirect to the home page.
    const token = authService.generateToken(req.user);
    res.cookie("jwt", token, { httpOnly: true }); // Send JWT in HTTP-only cookie
    res.redirect("/"); // Adjust redirect as necessary
  }
);

// User routes
app.use("/api/users", userRoutes);

// Server listening on defined PORT
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Example protected route
app.get("/protected-route", authenticateToken, (req, res) => {
  res.json({ message: "You are accessing a protected route", user: req.user });
});
