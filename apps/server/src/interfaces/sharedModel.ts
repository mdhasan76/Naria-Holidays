import { Schema } from "mongoose";

// Define the schema for IDocumentBase
export const documentBaseSchema = new Schema({
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
    type: {
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
    required: false,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});
