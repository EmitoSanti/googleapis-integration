"use strict";

import * as dotenv from "dotenv";
let config: Config;

export function getConfig(environment: any): Config {
  const enV: any = environment;
  if (enV) { }
  if (!config) {
    dotenv.config({ path: ".env" });

    config = {
      port: parseInt(process.env.PORT) || 3000,
      logLevel: process.env.LOG_LEVEL || "debug",
      mongoDb: process.env.MONGODB || "mongodb://localhost/googleapis-integration"
    };
  }
  return config;
}

export interface Config {
  port: number;
  logLevel: string; // 'debug' | 'verbose' | 'info' | 'warn' | 'error';
  mongoDb: string;
}
