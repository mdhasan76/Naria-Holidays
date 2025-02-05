import { Schema, Types } from "mongoose";
import { IDocumentBase } from "./interface";

export const documentBaseSchemaModel = new Schema<IDocumentBase>({
  createdBy: {
    name: { type: String, required: true },
    id: { type: Types.ObjectId, required: true },
  },
  updatedBy: {
    type: { name: { type: String }, id: { type: Schema.Types.ObjectId } },
    required: false,
  },
  isDeleted: { type: Boolean, default: false },
  deletedBy: {
    type: {
      name: { type: String, required: true },
      id: { type: Schema.Types.ObjectId, required: true },
    },
    required: false,
  },
  deletedAt: { type: Date },
});
