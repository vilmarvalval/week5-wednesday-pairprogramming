require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");

const jobRouter = require("../routes/jobRouter");
const {
  unknownEndpoint,
  errorHandler,
} = require("../middleware/customMiddleware");
const connectDB = require("../config/db");
const cors = require("cors");

// Middlewares
app.use(cors());
app.use(express.json());


// Use the jobRouter for all "/jobs" routes
app.use("/api/jobs", jobRouter);

app.use(unknownEndpoint);
app.use(errorHandler);

mongoose
  .connect("mongodb://localhost:27017/w5-fepp-test")
  .then(() => {
    console.log("connected to db");
  })
  .catch((error) => {
    console.error(error);
  });

module.exports = app;
