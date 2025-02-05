import { Schema } from "mongoose";

// Define the schema for IDocumentBase
export const documentBaseSchema = new Schema({
  businessId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  createdBy: {
    name: {
      type: String,
      required: true,
    },
    id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  updatedBy: {
    name: {
      type: String,
      required: true,
    },
    id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    note: String, // Optional field
  },
  isDeleted: {
    type: Boolean,
    required: true,
  },
  updatedAt: Date, // Optional field
  createdAt: Date, // Optional field
});
