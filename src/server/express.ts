"use strict";

import * as bodyParser from "body-parser";
import * as compression from "compression";
import * as cors from "cors";
import * as express from "express";
import * as helmet from "helmet";
import * as morgan from "morgan";
import * as path from "path";
import * as error from "../server/error";
import * as routes from "./routes";
import { Config } from "./environment";

export function init(appConfig: Config): express.Express {
  const app = express();
  app.set("port", appConfig.port);

  app.use(cors({
    origin: true,
    optionsSuccessStatus: 200,
    credentials: true
  }));

  if (appConfig.logLevel == "debug") {
    app.use(morgan("dev"));
  }

  app.use(bodyParser.urlencoded({ extended: true, limit: "20mb" }));
  app.use(bodyParser.json({ limit: "5mb" }));

  app.use(compression());

  app.use(helmet.xssFilter());
  app.use(helmet.noSniff());
  app.use(helmet.ieNoOpen());

  app.disable("x-powered-by");

  app.use(express.static(path.join(__dirname, "../public"), { maxAge: 31557600000 }));

  app.get("/", (req, res, next) => { res.redirect("index.html"); });

  routes.init(app);

  app.use(error.logErrors);
  app.use(error.handle404);

  return app;
}
