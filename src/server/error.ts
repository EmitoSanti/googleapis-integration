"use strict";

import * as express from "express";
import { NextFunction } from "express-serve-static-core";

export const ERROR_UNAUTHORIZED = 401;
export const ERROR_NOT_FOUND = 404;
export const ERROR_BAD_REQUEST = 400;
export const ERROR_INTERNAL_ERROR = 500;

export class ValidationErrorItem {
  path: string;
  message: string;
}
export class ValidationErrorMessage {
  code?: number;
  error?: string;
  messages?: ValidationErrorItem[];
}

export function newArgumentError(argument: string, err: string): ValidationErrorMessage {
  const result = new ValidationErrorMessage();
  result.messages = [{
    path: argument,
    message: err
  }];
  return result;
}

export function newError(code: number, err: string): ValidationErrorMessage {
  const result = new ValidationErrorMessage();
  result.code = code;
  result.error = err;
  return result;
}

export function handle(res: express.Response, err: any): express.Response {
  if (err instanceof ValidationErrorMessage) {
    if (err.code) {
      res.status(err.code);
    } else {
      res.status(400);
    }
    const send: any = {};
    if (err.error) {
      send.error = err.error;
    }
    if (err.messages) {
      send.messages = err.messages;
    }

    return res.send(send);
  } else if (err.code) {
    return res.send(sendMongoose(res, err));
  } else {
    return res.send(sendUnknown(res, err));
  }
}

export function logErrors(err: any, req: express.Request, res: express.Response, next: NextFunction) {
  if (!err) return next();

  console.error(err.message);

  res.status(err.status || ERROR_INTERNAL_ERROR);
  res.send({
    error: err.message
  });
}


export function handle404(req: express.Request, res: express.Response) {
  res.status(ERROR_NOT_FOUND);
  res.send({
    url: req.originalUrl,
    error: "Not Found"
  });
}

function sendUnknown(res: express.Response, err: any): ValidationErrorMessage {
  res.status(ERROR_INTERNAL_ERROR);
  return { error: err };
}

function sendMongoose(res: express.Response, err: any): ValidationErrorMessage {
  res.status(ERROR_BAD_REQUEST);

  try {
    switch (err.code) {
      case 11000:
      case 11001:
        const fieldName = err.errmsg.substring(
          err.errmsg.lastIndexOf("index:") + 7,
          err.errmsg.lastIndexOf("_1")
        );
        return {
          messages: [{
            path: fieldName,
            message: "This registry already exists."
          }]
        };
      default:
        res.status(ERROR_BAD_REQUEST);
        return { error: err };
    }
  } catch (ex) {
    res.status(ERROR_INTERNAL_ERROR);
    return { error: err };
  }
}
