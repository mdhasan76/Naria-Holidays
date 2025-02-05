// Import dependencies
import mongoose, { Schema, Document, model } from "mongoose";
import { IDocumentBase } from "../../../interfaces/sharedInterface";

export enum TaskStatus {
  PENDING = "pending",
  COMPLETED = "completed",
}

// Define the Task interface
export interface ITask extends IDocumentBase {
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  dueDate: Date;
  status: TaskStatus;
}
export type ITaskFilters = {
  searchTerm?: string;
};
