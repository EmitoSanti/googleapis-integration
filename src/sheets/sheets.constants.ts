/* Google Sheets Constants */
// More info: https://developers.google.com/sheets/api/reference/rest
export const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
export const SPREAD_SHEET_ID = "1EUlXybNcyLwNRYTx0Feay2zF84GWqxOiMjkP4ym3P2U";
export const VERSION_GOOGLE_API = "v4";
export const PAGES_NAMES = [
  "CPUs",
  "GPUs",
  "RAMs"
];
export const RANGE_EASY = "!A2:L"; // PAGENAME!STARTCOLUMNROW:ENDCOLUMNROW or PAGENAME!STARTCOLUMN:ENDCOLUMN
export const RANGE_HARD = {
  sheetId: 0, // The sheet this range is on.
  startRowIndex: 1, // The start row (inclusive) of the range, or not set if unbounded. [startRowIndex, endRowIndex)
  // endRowIndex: 8, // The end row (exclusive) of the range, or not set if unbounded. [startRowIndex, endRowIndex)
  startColumnIndex: 0, // The start column (inclusive) of the range, or not set if unbounded. [startColumnIndex, endColumnIndex)
  endColumnIndex: 12 // he end column (exclusive) of the range, or not set if unbounded. [startColumnIndex, endColumnIndex)
};


/* Auth Google Constants */
export const CREDENCIALS_LOCAL = {
  web: {
    client_id: "573966476276-3htiluaa4t49eq9iei6qt0a7m2mmim3v.apps.googleusercontent.com",
    project_id: "sheet-demo-270600",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_secret: "B-6GGzFJ5KaN7WrD3RTAIL6V",
    redirect_uris: [
      "http://localhost:8080/v1/google/code/"
    ],
    javascript_origins: [
      "http://localhost:8080"
    ]
  }
};

export const CREDENCIALS = {
  web: {
    client_id: "573966476276-1b1j7l480tosiid5rtiii7d7lh5ivobb.apps.googleusercontent.com",
    project_id: "sheet-demo-270600",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_secret: "y_eCBopsYrVgKyzllVnVsxzh",
    redirect_uris: [
      "https://gsm-auth-server.herokuapp.com/v1/google/code/"
    ],
    javascript_origins: [
      "https://gsm-auth-server.herokuapp.com"
    ]
  }
};