"use strict";
import { MongoError } from "mongodb";
import * as mongoose from "mongoose";
import * as env from "./server/environment";
import { Config } from "./server/environment";
import * as express from "./server/express";

const PORT = process.env.PORT || 8080;
process.env.NODE_ENV = process.env.NODE_ENV || "local";
let urlMongodb: string;
if (process.env.NODE_ENV === "local") {
  urlMongodb = "mongodb://localhost/googleapis-integration";
} else {
  urlMongodb = "YOUR URI MONGODB ATLAS";
}
process.env.URLDB = urlMongodb;
const conf: Config = env.getConfig(process.env);
process.on("unhandledRejection", (reason, p) => {
  console.error("Unhandled Rejection at: Promise ", p, " reason: ", reason);
});

mongoose.connect(process.env.URLDB, { useUnifiedTopology: true, useCreateIndex: true, useNewUrlParser: true, useFindAndModify: false }, function (err: MongoError) {
  if (err) {
    console.error("Could not connect to MongoDB.");
    console.error(err.message);
    process.exit();
  } else {
    console.log("MongoDB connection open.");
  }
});

const app = express.init(conf);

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}` + " NODE_ENV: " + process.env.NODE_ENV);
});

module.exports = app;
