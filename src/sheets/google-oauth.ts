"use strict";

import { Document, Schema } from "mongoose";
const mongoose = require("mongoose");

export interface IToken extends Document {
  access_token: string;
  refresh_token: string;
  scope: string;
  token_type: string;
  expiry_date: string;
}
export interface IGoogleOAuth extends Document {
  token: IToken;
  created: Date;
  updated: Date;
  enabled: Boolean;
}

/**
 * Google OAuth Schema
 */
const GoogleOAuthSchema = new Schema({
  token: {
    access_token: {
      type: String,
      trim: true
    },
    refresh_token: {
      type: String,
      trim: true
    },
    scope: {
      type: String,
      trim: true
    },
    token_type: {
      type: String,
      trim: true
    },
    expiry_date: {
      type: String,
      trim: true
    }
  },
  created: {
    type: Date,
    default: Date.now()
  },
  updated: {
    type: Date,
    default: Date.now()
  },
  enabled: {
    type: Boolean,
    default: true
  }
}, { collection: "google-oauth" });

GoogleOAuthSchema.pre("save", function (this: IGoogleOAuth, next) {
  this.updated = new Date();
  next();
});

export let GoogleOAuth = mongoose.model("GoogleOAuth", GoogleOAuthSchema);
