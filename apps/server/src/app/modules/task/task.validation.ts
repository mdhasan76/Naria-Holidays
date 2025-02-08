import { z } from "zod";
import { TaskStatus } from "./task.interface";

// Define the Zod schema for task validation
const taskValidationSchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(1, "Title is required")
      .max(100, "Title cannot exceed 100 characters"),
    description: z.string().min(1, "Description is required"),
    dueDate: z.string(),
    status: z.nativeEnum(TaskStatus).optional(),
  }),
});
export const TaskValidation = { taskValidationSchema };
