"use strict";

import * as error from "../server/error";
import { google } from "googleapis";
import { GoogleOAuth, IGoogleOAuth } from "./google-oauth";
// import * as fs from "fs"; // The code using this dependency fails if the server application does not have write permissions.
import { ArticlesService } from "../articles/articles.service";
import {
  SCOPES,
  SPREAD_SHEET_ID,
  VERSION_GOOGLE_API,
  RANGE_EASY,
  CREDENCIALS,
  PAGES_NAMES
} from "./sheets.constants";

export class SheetsService {
  static sheets = google.sheets(VERSION_GOOGLE_API);
  static oAuth2Client = new google.auth.OAuth2( // Using OAuth 2.0 to Access Google APIs. developers.google.com/identity/protocols/oauth2
    CREDENCIALS.web.client_id,
    CREDENCIALS.web.client_secret,
    CREDENCIALS.web.redirect_uris[0]
  ); // oAuth2Client has it global reach on the SheetsService. Because it is important that there is only one oAuth2Client object.

  /* Google OAuth */
  static getNewCode() { // We request authorization to Google OAuth. developers.google.com/people/quickstart/nodejs
    console.log("SheetsService getNewCode()");

    const promise = new Promise((resolve, reject) => {
      const authUrl = this.oAuth2Client.generateAuthUrl({
        access_type: "offline",
        scope: SCOPES
      });
      console.log("Authorize this app by visiting this url: ", authUrl); // URL to do the last step to have Google OAuth authorization.
      /* Browse to the provided URL in your web browser.
        If you are not already logged into your Google account, you will be prompted to log in.
        If you are logged into multiple Google accounts, you will be asked to select one account to use for the authorization.
        The token will be sent directly to the server application.
      */
      // if (err) return reject(err); // callbacks?
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
    return promise; // next promise, The token will save in DB.
  }

  static createGoogleOAuth(data: any) { // We save the token generated and sent by Google OAuth in MongoDB.
    console.log("SheetsService createGoogleOAuth(): " + JSON.stringify(data)); // Analyze JSON structure. jsoneditoronline.org

    const googleToken = {
      token: {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        scope: data.scope,
        token_type: data.token_type,
        expiry_date: data.expiry_date
      }
    };
    console.log("Google OAuth token received: " + JSON.stringify(googleToken));
    return new Promise<IGoogleOAuth>((resolve, reject) => {
      try {
        resolve(GoogleOAuth.create(googleToken));
      }
      catch (err) {
        reject(err);
      }
    });
  }

  static async readGoogleOAuth() { // We get the last Google OAuth Token that we previously saved.
    console.log("SheetsService readGoogleOAuth()");

    try {
      const token = await GoogleOAuth.findOne({}).sort({ $natural: -1 }).limit(1); // We get the last document where we keep the tokens.
      if (!token) {
        throw error.newError(error.ERROR_NOT_FOUND, "Token not found.");
      }
      console.log("Last token found: " + JSON.stringify(token.token));
      return token.token;
    } catch (err) {
      return err;
    }
  }

  static authorization(token: any) { // Authorization is obtained from the user's credentials and valid token.
    console.log("SheetsService authorization()");

    const promise = new Promise((resolve, reject) => {
      this.oAuth2Client.setCredentials(token);
      console.log("Credenciales access generated: " + JSON.stringify(this.oAuth2Client));
      // if (err) return reject(err); // callbacks?
      return resolve(this.oAuth2Client);
    });
    return promise;
  }

  /* Google Sheets */
  static getAllData(authorization: any) {
    console.log("SheetsService getAllData() :" + JSON.stringify(authorization));

    const auth = authorization;
    const pagesSheet: string[] = PAGES_NAMES; // Array with file page names.
    const allRanges: any[] = []; // Array with file page names, concatenated to range.

    pagesSheet.forEach((page) => {
      const pageSanitized = page.trim(); // developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/String/Trim
      const range = `${pageSanitized}${RANGE_EASY}`; // ES6 to concatenate, Template literals (Template strings).
      allRanges.push(range);
    });

    console.log("allRanges: " + JSON.stringify(allRanges)); // Analyze JSON structure. jsoneditoronline.org
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

        // Mapping of the data received.
        // In a nutshell. For each page you get an array of arrays of the rows.
        console.log("Data: " + JSON.stringify(res.data)); // Analyze JSON structure. jsoneditoronline.org
        const values = res.data.valueRanges;
        values.forEach((val: any) => {
          const columns = val.values;
          if (columns) {
            const allRows = columns.map((column: any) => {
              return {
                itemId: column[0], // By column index
                itemName: column[1],
                itemBrand: column[2],
                itemDescription: column[3],
                qtyStock: column[4],
                unitPrice: column[5],
                totalPrice: column[6],
                sales: [
                  {
                    name: "Local Sale Price",
                    value: column[8]
                  },
                  {
                    name: "Export Price",
                    value: column[10]
                  }
                ]
              };
            });
            // In a nutshell. The map function is used to create an array of objects. Each object contains the data from one row.
            console.log("allRows: " + JSON.stringify(allRows)); // Analyze JSON structure. jsoneditoronline.org/
            ArticlesService.migrationArticles(allRows)
              .then(() => {
                return resolve("Migration completed.");
              })
              .catch((error) => {
                return reject(error);
              });
          } else {
            return reject("No data found.");
          }
        });
      });
    });
    return promise;
  }
}
