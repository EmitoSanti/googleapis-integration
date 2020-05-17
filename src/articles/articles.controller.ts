import * as express from "express";
import * as error from "../server/error";
import { ArticlesService } from "./articles.service";

export class ArticlesController {
  static dropArticles(req: express.Request, res: express.Response) {
    console.log("ArticlesController dropArticles()");

    ArticlesService.dropArticles()
      .then((response: any) => {
        return res.json(response);
      })
      .catch((err: any) => error.handle(res, err));
  }
}