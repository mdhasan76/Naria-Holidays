import { z } from "zod";
import { TaskStatus } from "./task.interface";

// Define the Zod schema for task validation
const taskValidationSchema = z.object({
  userId: z.string().regex(/^[a-fA-F0-9]{24}$/),
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title cannot exceed 100 characters"),
  description: z.string().min(1, "Description is required"),
  dueDate: z.preprocess(
    (arg) => {
      if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
    },
    z.date().refine((date) => !isNaN(date.getTime()), "Invalid date")
  ),
  status: z.nativeEnum(TaskStatus).optional(),
});
export const TaskValidation = { taskValidationSchema };
