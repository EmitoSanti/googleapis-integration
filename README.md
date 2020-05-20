# Integration of googleapis

This repository contains the node.js implementation of googleapis.

## References

### Google

+ This document explains how web server applications use Google API Client Libraries: [Google OAuth](https://developers.google.com/identity/protocols/oauth2/web-server)
+ Reads and writes Google Sheets. [Google Sheets API](https://developers.google.com/sheets/api/reference/rest)
+ Google APIs Node.js Client library for using Google APIs. [Google APIs Node.js Client](https://www.npmjs.com/package/googleapis)
+ Node.js Quickstart for Googleapis Sheets: [Node.js Quickstart](https://developers.google.com/people/quickstart/nodejs)
+ Enable Google Sheet API and create user usage credentials [Google Cloud Platform](https://console.cloud.google.com/)

### Other repositories

Server application seed: [Nestor Marsollier Repository](https://github.com/nmarsollier/ecommerce)

### More info

My medium profile: [Emilino Santi](https://medium.com/@losantiemi)
Note: **I'm writing a post explaining the implementation of googleapis. Soon, step by step**

## Dependencies

### Node.JS

Install Node.JS [nodejs.org](https://nodejs.org/en/)

### MongoDb

Install MongoDb [mongodb.com](https://docs.mongodb.com/manual/installation/)

## Run server application

### Run mongodb

Start mongod services

### Run on the root folder

```bash
npm install
npm run dev
```

Note: **The scripts in the package.json are set to run on the heroku platform. The "npm start" command should not be used in local.**

## Run endpoints in postman, insomnia or other

+ Generate new Google OAuth Authorization. [http://localhost:8080/google/newcode](http://localhost:8080/google/newcode)
+ Check if the Google OAuth Authorization is valid. [http://localhost:8080/google/authorize](http://localhost:8080/google/authorize)
+ Migrate from Google Sheet to MongoDB. [http://localhost:8080/google/startmigration](http://localhost:8080/google/startmigration)
