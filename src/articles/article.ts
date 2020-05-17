"use strict";

import { Document, Schema } from "mongoose";
const mongoose = require("mongoose");

export interface IServices extends Document {
  name: string;
  value: string;
  description: string;
}
export interface IArticle extends Document {
  itemId: string;
  itemName: string;
  itemBrand: string;
  itemDescription: string;
  qtyStock: number;
  unitPrice: number;
  totalPrice: number;
  sales: IServices[];
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
    type: Number,
    trim: true,
    required: "Quantity is required"
  },
  unitPrice: {
    type: Number,
    trim: true,
    required: "Unit Price is required"
  },
  totalPrice: {
    type: Number,
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
        type: Number,
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
