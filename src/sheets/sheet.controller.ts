import * as express from "express"; // revisar si esta bien .. creeria que si por el tipado de los parametros
import { SheetsService } from "./sheets.service"; // ver esto falla index.ts creo
import { ArticlesService } from "../articles/articles.service";

export class SheetsController {
  static getNewCode(req: express.Request, res: express.Response) {
    console.log("SheetsController getNewCode()");

    SheetsService.getNewCode()
      .then((response: any) => {
        console.log("googleURL: ", response);
        res.status(200).send(response);
      })
      .catch((err: any) => {
        res.status(400).json(err);
        // error.handle(res, err);
      });
  }

  static setNewCode(req: express.Request, res: express.Response) {
    console.log("SheetsController setNewCode() code: " + JSON.stringify(req.query.code));
    console.log("SheetsController setNewCode() scope: " + JSON.stringify(req.query.scope));
    const newCode = req.query.code;

    SheetsService.setNewCode(newCode)
      .then((token: any) => {
        return SheetsService.createGoogleOAuth(token);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  }

  static authorize(req: express.Request, res: express.Response) {
    console.log("SheetsController authorize()");

    SheetsService.readGoogleOAuth()
      .then((token) => {
        return SheetsService.authorization(token);
      })
      .then((response) => {
        res.status(200).json("authorized");
      })
      .catch((err) => {
        // err viene con el path del archivo que fallo si lo mando al front crea una pista para romper la seguridad de la plataforma
        const error = {
          errno: err.errno,
          code: err.code,
          syscall: err.syscall
        };
        res.status(400).json(error);
      });
  }

  static startMigration(req: express.Request, res: express.Response) {
    console.log("SheetsController startMigration()");
    let authorization: any = {};

    SheetsService.readGoogleOAuth()
      .then((token: any) => {
        console.log("token: " + token);
        return SheetsService.authorization(token);
      })
      .then((response: any) => {
        console.log("response token: " + JSON.stringify(response));
        authorization = response;
        return ArticlesService.dropArticles();
      })
      // .then((response: any) => { // sacar a una funcionalidad por afuera de este flujo ... que el usuario valla eligiendo que pagina ordenar.
      //   console.log("Drop Articles Collection: " + response);
      //   return SheetsService.sortByBrand(authorization);
      // })
      .then((response: any) => {
        console.log("Articles Collection is dropped?: " + JSON.stringify(response));
        return SheetsService.getAllData(authorization);
      })
      .then((resp) => {
        console.log("resp: " + JSON.stringify(resp));
        res.status(200);
      })
      .catch((err) => {
        console.log("err: " + JSON.stringify(err));
        res.status(400).json(err);
        // error.handle(res, err); usar handle??
      });
  }
}