"use strict";

import * as express from "express";
import { SheetsController } from "../sheets/sheet.controller";

export function init(app: express.Express) {
  // Use with postman, insomnia or other.
  app.route("/google/newcode").get(SheetsController.getNewCode); // Generate new Google OAuth Authorization.
  app.route("/google/authorize").get(SheetsController.authorize); // Check if the Google OAuth Authorization is valid.
  app.route("/google/startmigration").get(SheetsController.startMigration); // Migrate from Google Sheet to MongoDB.

  // Not use with postman, insomnia or other.
  app.route("/google/code/").get(SheetsController.setNewCode); // This endpoint is only used by Google OAuth.
}
