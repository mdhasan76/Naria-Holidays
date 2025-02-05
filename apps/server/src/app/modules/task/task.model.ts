import { model, Schema } from "mongoose";
import { ITask, TaskStatus } from "./task.interface";
import { documentBaseSchema } from "../../../interfaces/sharedModel";

// Define Mongoose schema for Task
const taskSchema = new Schema<ITask>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, maxlength: 100 },
    description: { type: String, required: true },
    dueDate: { type: Date, required: true },
    status: {
      type: String,
      enum: TaskStatus,
      default: TaskStatus.PENDING,
    },
    ...documentBaseSchema.obj,
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

// Create and export the Task model
export const TaskModel = model<ITask>("Task", taskSchema);
