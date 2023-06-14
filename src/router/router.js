const express = require("express");
const { create_user, login } = require("../controller/signUpLogin");
const router = express.Router();

// ====== Health check for the application ====== //

router.get("/health-check", function (req, res) {
  return res.send({ message: "API working" });
});

// ====== POST api for creating user data ====== //

router.post("/sign-up", create_user);

// ====== POST api for login as a user ====== //

router.post("/sign-in", login);

// ====== all api for handling Invalid http requests ====== //

router.all("/*", function (req, res) {
  res.status(404).send({ status: false, message: "Invalid HTTP request" });
});

module.exports = router;
