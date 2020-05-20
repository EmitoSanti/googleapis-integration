"use strict";

import { Document, Schema } from "mongoose";
const mongoose = require("mongoose");

export interface ISales extends Document {
  name: string;
  value: string;
  description: string;
}
export interface IArticle extends Document {
  itemId: string;
  itemName: string;
  itemBrand: string;
  itemDescription: string;
  qtyStock: string;
  unitPrice: string;
  totalPrice: string;
  sales: ISales[];
  discontinue: Boolean;
  created: Date;
  updated: Date;
  enabled: Boolean;
}

/**
 * Article Schema
 */
const ArticleSchema = new Schema({
  itemId: {
    type: String,
    trim: true,
    unique: true,
    required: "Item Id is required"
  },
  itemName: {
    type: String,
    trim: true,
    required: "Item Name is required"
  },
  itemBrand: {
    type: String,
    trim: true,
    required: "Item Brand is required"
  },
  itemDescription: {
    type: String,
    trim: true,
    required: "Item Description is required"
  },
  qtyStock: {
    type: String,
    trim: true,
    required: "Quantity is required"
  },
  unitPrice: {
    type: String,
    trim: true,
    required: "Unit Price is required"
  },
  totalPrice: {
    type: String,
    trim: true,
    required: "Total Price is required"
  },
  sales: [
    {
      name: {
        type: String,
        trim: true
      },
      value: {
        type: String,
        trim: true
      },
      description: {
        type: String,
        trim: true
      }
    }
  ],
  discontinue: {
    type: Boolean,
    default: false
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
}, { collection: "articles" });

ArticleSchema.index({ itemId: 1, itemName: 1 });

ArticleSchema.pre("save", function (this: IArticle, next) {
  this.updated = new Date();
  next();
});

export let Article = mongoose.model("Article", ArticleSchema);
