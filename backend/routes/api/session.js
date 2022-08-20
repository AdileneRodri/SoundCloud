const express = require("express");
const { setTokenCookie, restoreUser } = require("../../utils/auth");
const { User } = require("../../db/models");
// const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const router = express.Router();

const validateLogin = [
  handleValidationErrors,
];

// Log in users
router.post("/login", validateLogin, async (req, res, next) => {
  const { credential, password } = req.body;
  const user = await User.login({ credential, password });
  
  if (!credential || !password) {
    const err = new Error("Login failed");
    err.status = 400;
    err.message = "Validation error";
    err.errors = {
      email: "Email is required",
      password: "Password is required",
    };
    return res.status(400).json({ message: err.message, statusCode: err.status, errors: err.errors });
  }
  if (!user) {
    const err = new Error("Login failed");
    err.status = 401;
    err.message = "Login failed";
    err.errors = ["The provided credentials were invalid."];
    return res.status(401).json({ message: "Invalid credentials", statusCode: err.status });
  }
  const accessToken = setTokenCookie(res, user);
  let userData = user.toSafeObject();
  
  return res.json({
    id: userData.id,
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    username: userData.username,
    token: accessToken,
  });
});

// Restore session user
router.get("/", restoreUser, (req, res) => {
  const { user } = req;
  let userData = user.toSafeObject();
  if (user) {
    return res.json({
      id: userData.id,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      username: userData.username,
    });
  } else return res.json({});
});

// Log out user
router.delete("/", (_req, res) => {
  res.clearCookie("token");
  return res.json({ message: "success" });
});

module.exports = router;
