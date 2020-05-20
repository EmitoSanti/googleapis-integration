import * as express from "express"; // revisar si esta bien .. creeria que si por el tipado de los parametros
import { SheetsService } from "./sheets.service"; // ver esto falla index.ts creo
import { ArticlesService } from "../articles/articles.service";

export class SheetsController {
  static getNewCode(req: express.Request, res: express.Response) { // We request authorization to Google OAuth.

    SheetsService.getNewCode() // We request authorization to Google OAuth.
      .then((response) => {
        console.log("Browse to the provided URL in your web browser.");
        res.status(200).send(response);
      })
      .catch((error) => {
        res.status(400).json(error);
      });
  }

  static setNewCode(req: express.Request, res: express.Response) { // Google Oauth sends a code that is used to get the token.
    console.log("SheetsController setNewCode() code: " + JSON.stringify(req.query.code));
    console.log("SheetsController setNewCode() scope: " + JSON.stringify(req.query.scope)); // It is not necessary.
    const newCode = req.query.code;

    SheetsService.setNewCode(newCode) // Google Oauth sends a code that is used to get the token.
      .then((token: any) => {
        return SheetsService.createGoogleOAuth(token); // We save the token generated and sent by Google OAuth in MongoDB.
      })
      .then((response) => {
        console.log("response: " + JSON.stringify(response));
        res.status(200).json(response);
      })
      .catch((error) => {
        res.status(400).json(error);
      });
  }

  static authorize(req: express.Request, res: express.Response) { // Authorization is obtained from the user's credentials and valid token.
    console.log("SheetsController authorize()");

    SheetsService.readGoogleOAuth() // We get the last Google OAuth Token that we previously saved.
      .then((token) => {
        return SheetsService.authorization(token); // Authorization is obtained from the user's credentials and valid token.
      })
      .then(() => {
        res.status(200).json("authorized");
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  }

  static startMigration(req: express.Request, res: express.Response) {
    console.log("SheetsController startMigration()");
    let authorization: any = {};

    SheetsService.readGoogleOAuth() // We get the last Google OAuth Token that we previously saved.
      .then((token) => {
        console.log("token: " + token);
        return SheetsService.authorization(token);
      })
      .then((response) => {
        console.log("authorization? " + JSON.stringify(response));
        authorization = response;
        return ArticlesService.dropArticles();
      })
      .then((response) => {
        console.log("Articles Collection is dropped?: " + JSON.stringify(response));
        return SheetsService.getAllData(authorization);
      })
      .then((response) => {
        console.log("response: " + JSON.stringify(response));
        res.status(200).json(response);
      })
      .catch((error) => {
        console.log("error: " + JSON.stringify(error));
        res.status(400).json(error);
      });
  }
}