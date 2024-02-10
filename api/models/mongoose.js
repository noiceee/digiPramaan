const mongoose = require("mongoose");
require("dotenv").config;

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

const mongoURL = `mongodb+srv://${dbUser}:${dbPassword}@cluster0.exyuhea.mongodb.net/?retryWrites=true&w=majority`;

mongoose.Promise = global.Promise;

mongoose.connect(mongoURL).catch((err) => {
  console.log(err);
});

mongoose.connection.on("connected", (msg) => {
  console.log("Database Connected Successfully");
});

mongoose.connection.on("error", (err) => {
  console.log("Error : " + err);
});

module.exports = { mongoose };
