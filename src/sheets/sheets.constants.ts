// More info: https://developers.google.com/sheets/api/reference/rest
// And more info: https://developers.google.com/people/quickstart/nodejs

/* Auth Google Constants */
export const CREDENCIALS = {
  web: {
    client_id: "1075529679647-dtiebuer0ocl2hjovabpjls3hh1qohto.apps.googleusercontent.com",
    project_id: "our-sign-277618",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_secret: "J3frjahx-P1XnSpZSMEEyJgP",
    redirect_uris: [
      "http://localhost:8080/google/code/"
    ],
    javascript_origins: [
      "http://localhost:8080"
    ]
  }
};

/* Google Sheets Constants */
export const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

export const SPREAD_SHEET_ID = "1EUlXybNcyLwNRYTx0Feay2zF84GWqxOiMjkP4ym3P2U";

export const VERSION_GOOGLE_API = "v4";

export const PAGES_NAMES = [
  "CPUs",
  "GPUs",
  "RAMs"
];

export const RANGE_EASY = "!A2:K"; // PAGENAME!STARTCOLUMNROW:ENDCOLUMNROW or PAGENAME!STARTCOLUMN:ENDCOLUMN

export const RANGE_HARD = {
  sheetId: 0, // The sheet this range is on.
  startRowIndex: 1, // The start row (inclusive) of the range, or not set if unbounded. [startRowIndex, endRowIndex)
  // endRowIndex: 8, // The end row (exclusive) of the range, or not set if unbounded. [startRowIndex, endRowIndex)
  startColumnIndex: 0, // The start column (inclusive) of the range, or not set if unbounded. [startColumnIndex, endColumnIndex)
  endColumnIndex: 11 // The end column (exclusive) of the range, or not set if unbounded. [startColumnIndex, endColumnIndex)
};