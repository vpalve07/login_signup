const express = require("express");
const route = require("./router/router");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ====== Handling json object errors ====== //

app.use(function (err, req, res, next) {
  if (err.message) {
    return res.status(400).send({ status: false, message: err.message });
  } else next();
});

mongoose
  .connect(process.env.mongo_url, { useNewUrlParser: true })
  .then(() => console.log("MongoDB is connected"))
  .catch((err) => console.log(err));

app.use("/", route);
app.listen(process.env.port, function () {
  console.log(`Express app running on ${process.env.port}`);
});
