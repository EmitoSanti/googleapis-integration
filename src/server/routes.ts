"use strict";

import * as express from "express";
import { SheetsController } from "../sheets/sheet.controller"; // ver esto falla index.ts creo

// Routes
export function init(app: express.Express) {
  // sheets
  app.route("/v1/google/newcode").get(SheetsController.getNewCode); // nuevo token Auth
  app.route("/v1/google/code/").get(SheetsController.setNewCode); // front-end no lo debe usar
  app.route("/v1/google/authorize").get(SheetsController.authorize); // verifica si el token esta habilitado
  app.route("/v1/google/startmigration").get(SheetsController.startMigration);
}

// usar put para actualizar algo persistido (resiviendo datos) put('/:appId),
// usar post para crear algo y persistirlo (resiviendo datos) .post('/') post('/fork9
// usar delete cuando se tiene que borrar algun registro en espesifico .delete('/:appId')
