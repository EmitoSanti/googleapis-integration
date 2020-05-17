"use strict";

import * as _ from "lodash";
import * as error from "../server/error";
import { google } from "googleapis";
import { GoogleOAuth, IGoogleOAuth } from "./google-oauth";
import * as fs from "fs"; // The code using this dependency fails if the server application does not have write permissions.
import { ArticlesService } from "../articles/articles.service";
import {
  SCOPES,
  SPREAD_SHEET_ID,
  VERSION_GOOGLE_API,
  RANGE_EASY,
  RANGE_HARD,
  CREDENCIALS_LOCAL,
  CREDENCIALS,
  PAGES_NAMES
} from "./sheets.constants";

export class SheetsService {
  static sheets = google.sheets(VERSION_GOOGLE_API);
  static oAuth2Client = new google.auth.OAuth2(
    CREDENCIALS.web.client_id,
    CREDENCIALS.web.client_secret,
    CREDENCIALS.web.redirect_uris[0]
  );

  static async readGoogleOAuth() {
    console.log("SheetsService readGoogleOAuth()");

    try {
      const token = await GoogleOAuth.findOne({}).sort({ $natural: -1 }).limit(1);
      if (!token) {
        throw error.newError(error.ERROR_NOT_FOUND, "No hay credencial habilitada");
      }
      console.log("readGoogleOAuth token: " + JSON.stringify(token.token));
      return Promise.resolve(token.token);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  static createGoogleOAuth(data: any) {
    console.log("SheetsService createGoogleOAuth(): " + JSON.stringify(data));

    const googleToken = {
      token: {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        scope: data.scope,
        token_type: data.token_type,
        expiry_date: data.expiry_date
      }
    };
    console.log("googleToken: " + JSON.stringify(googleToken));
    return new Promise<IGoogleOAuth>((resolve, reject) => {
      try {
        resolve(GoogleOAuth.create(googleToken));
      }
      catch (error) {
        reject(error);
      }
    });
  }

  static authorization(token: any) {
    console.log("SheetsService authorization()");

    const promise = new Promise((resolve, reject) => {
      this.oAuth2Client.setCredentials(token); // si hay token se puede trabajar con google // se parsea porque viene en texto plano
      console.log("Credenciales access generated: " + JSON.stringify(this.oAuth2Client));
      // if (err) return reject(err); // ver si lo soporta en la documentacion de setCredentials
      return resolve(this.oAuth2Client);
    });
    return promise;
  }

  static getNewCode() {
    console.log("SheetsService getNewCode()");

    const promise = new Promise((resolve, reject) => {
      const authUrl = this.oAuth2Client.generateAuthUrl({
        access_type: "offline",
        scope: SCOPES
      });
      console.log("Authorize this app by visiting this url: ", authUrl);
      // if (err) return reject(err); // ver si lo soporta en la documentacion de generateAuthUrl
      return resolve(authUrl);
    });
    return promise;
  }

  static setNewCode(code: any) {
    console.log("SheetsService setNewCode(): " + JSON.stringify(code));

    const promise = new Promise((resolve, reject) => {
      this.oAuth2Client.getToken(code, (err: any, token: any) => {
        console.log("Token generated: " + JSON.stringify(token));
        if (err) {
          console.log("Error while trying to retrieve access token: ", err);
          return reject("Error while trying to retrieve access token: " + err);
        }
        this.oAuth2Client.setCredentials(token); // It is not necessary.
        /* The following write file function fails if the server application does not have write permissions.
          I chose to save the access token in the DB, saving is done in the next promise in the controller.

          fs.writeFile(`${__dirname}/public/token.json`, JSON.stringify(token, null, 2), (err: any) => {
            if (err) return console.log("Error while trying to write token file", err);
            console.log("Token stored to ", TOKEN_PATH);
          });
        */
        return resolve(token);
      });
    });
    return promise; // next promise, save token in DB.
  }

  static async sortByBrand(authorization: any) {
    console.log("SheetsService sortByBrand()");
    const auth = authorization;
    // const promise = new Promise<any>(async (resolve, reject) => {
    const pagesSheet: string[] = PAGES_NAMES;
    const allRequests: any[] = [];
    _.forEach(pagesSheet, (page, key) => {
      console.log("key: " + key);
      allRequests.push({
        sortRange: {
          range: { // RANGE_HARD
            sheetId: key,
            startRowIndex: 2,
            // endRowIndex: 8,
            startColumnIndex: 0,
            endColumnIndex: 13
          },
          sortSpecs: [
            {
              dimensionIndex: 0, // index column
              sortOrder: "ASCENDING" // DESCENDING
            }
          ]
        }
      });
    });

    const request = {
      spreadsheetId: SPREAD_SHEET_ID,
      resource: {
        requests: allRequests
      },
      auth: auth
    };
    console.log("request: " + JSON.stringify(request, null, 2));
    //   try {
    //     const sheets = google.sheets({ version: VERSION_GOOGLE_API, auth });
    //     const response = await sheets.spreadsheets.batchUpdate(request);
    //     console.log("response: " + JSON.stringify(response, null, 2));
    //     return resolve("It sorted");
    //   } catch (err) {
    //     console.error("error: " + err);
    //     return reject(err);
    //   }
    // });
    const sheets = google.sheets({ version: VERSION_GOOGLE_API, auth });
    const promise = new Promise<any>((resolve, reject) => {
      sheets.spreadsheets.batchUpdate(request, (err: any, res: any) => {
        if (err) {
          console.log("The API returned an error: " + err);
          return reject(err);
        }
        resolve("It sorted");
      });
    });

    return promise;
  }

  static getAllData(authorization: any) { // de any a AUTH
    console.log("SheetsService getAllData()");

    const auth = authorization;
    const pagesSheet: string[] = PAGES_NAMES;
    const allRanges: any[] = [];
    _.forEach(pagesSheet, (page) => {
      const pageSanitized = page.trim();
      const rango = `${pageSanitized}${RANGE_EASY}`;
      const rangoSanitized = rango.toString();
      allRanges.push(rangoSanitized);
    });
    console.log("allRanges: " + JSON.stringify(allRanges));
    const promise = new Promise<any>((resolve, reject) => {
      const sheets = google.sheets({ version: VERSION_GOOGLE_API, auth });
      const request = {
        spreadsheetId: SPREAD_SHEET_ID,
        ranges: allRanges,
        valueRenderOption: "FORMATTED_VALUE",
        dateTimeRenderOption: "SERIAL_NUMBER",
        auth: auth
      };
      sheets.spreadsheets.values.batchGet(request, (err: any, res: any) => {
        if (err) {
          console.log("The API returned an error: " + err);
          return reject(err);
        }
        console.log("Datos: " + JSON.stringify(res.data));
        const values = res.data.valueRanges;
        _.forEach(values, (val) => {
          const columns = val.values;
          if (columns) {
            // console.log("Datos: " + JSON.stringify(rows));
            const allRows = columns.map(function (column: any) { // de any a IArticle
              // console.log("marca: " + `${row[0]}` + "   modelo: " + `${row[1]}` + "   mpn: " + `${row[2]}`);
              return {
                brand: column[0],
                name: column[1],
                mpn: column[2],
                services: [
                  {
                    name: "liberar o base",
                    value: column[3]
                  },
                  {
                    name: "full",
                    value: column[4]
                  },
                  {
                    name: "cuenta google",
                    value: column[5]
                  },
                  {
                    name: "cuenta propietaria",
                    value: column[6]
                  },
                  {
                    name: "software",
                    value: column[7]
                  },
                  {
                    name: "resetear patron",
                    value: column[8]
                  },
                  {
                    name: "fix touch",
                    value: column[9]
                  }
                ],
                additionalServices: [
                  {
                    name: "liberar",
                    value: column[10]
                  },
                  {
                    name: "full",
                    value: column[11]
                  },
                  {
                    name: "cuenta google",
                    value: column[12]
                  },
                  {
                    name: "cuenta propietaria",
                    value: column[13]
                  }
                ]
              };
            });
            console.log("allRows: " + JSON.stringify(allRows));
            ArticlesService.migrationArticles(allRows)
              .then(() => {
                return resolve("Fin migracion");
              })
              .catch(
                (error) => {
                  return reject(error);
                }
              );
          } else {
            console.log("No data found.");
            return reject("Algo se rumpio");
          }
        });
      });
    });
    return promise;
  }
}

async function create(auth: any) {
  const request = {
    resource: {
      properties: {
        title: "HOLA"
      }
    },
    auth: this.oAuth2Client,
  };
  try {
    const response = (await this.sheets.spreadsheets.create(request)).data; // va sin this.
    console.log(JSON.stringify(response, null, 2));
  } catch (err) {
    console.error(err);
  }
}

async function getByValue(auth: any) { // no sirve pa mierda
  console.log("sortByBrand");
  const request = {
    spreadsheetId: "1B0qopCbei9rLXQbfmUzC1try8l93lTdtgBT4LILjDT0", // pasar a constante
    resource: {
      requests: [
        {
          addFilterView: {
            filter: {
              filterViewId: 0,
              title: "A",
              range: {
                sheetId: 0, // index sheet
                startRowIndex: 0, // index start row // se puede borrar para que sea infinita
                endRowIndex: 11, // index end row // se puede borrar para que sea infinita
                startColumnIndex: 0, // index start column // se puede borrar para que sea infinita
                endColumnIndex: 4 // index end column // se puede borrar para que sea infinita
              },
              sortSpecs: [
                {
                  dimensionIndex: 0, // index column
                  sortOrder: "ASCENDING" // DESCENDING
                }
              ],
              criteria: {
                0: {
                  condition: {
                    type: "TEXT_CONTAINS",
                    values: {
                      userEnteredValue: "caca"
                    }
                  }
                }
              }
            }
          }
        }
      ]
    },
    auth: auth
  };
  try {
    const response = (await this.sheets.spreadsheets.batchUpdate(request)).data; // va sin this.
    console.log("response: " + JSON.stringify(response, null, 2));
  } catch (err) {
    console.error("error: " + err);
  }
}
