import { Types } from "mongoose";

export interface IGenericResponse<T> {
  statusCode?: number;
  success?: boolean;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
  data?: T;
  message?: string;
}

export interface IPaginationOption {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface IGenericDataWithMeta<T> {
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
  data: T;
  message?: string;
}

export interface IGenericData<T> {
  data: T;
  message?: string;
}
export interface IGenericResponse<T> {
  statusCode?: number;
  success?: boolean;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
  data?: T;
  message?: string;
}

export interface IDocumentBase extends Document {
  _id: Types.ObjectId;
  createdBy: {
    name: string;
    id: Types.ObjectId | string;
  };
  updatedBy?: {
    name: string;
    id: Types.ObjectId;
  };
  isDeleted: boolean;
  updatedAt?: Date;
  createdAt?: Date;
  deletedBy?: {
    name: string;
    id: Types.ObjectId;
  };
  deletedAt?: Date;
}

export interface IStatus<T> {
  name: T;
  status: boolean;
  by: {
    name: string;
    id: Types.ObjectId;
  };
  at: Date;
  note?: string;
  business?: Types.ObjectId;
}

export interface By {
  name: string;
  id: string;
}
export interface ITimelineEntry<T = string> {
  action: T; // Description of the action, e.g., "Created", "Updated", "Deleted"
  timestamp: Date; // When the action occurred
  performedBy?: Types.ObjectId; // Reference to the user who performed the action
  details?: string; // Additional information about the action (optional)
}

export type IRTKResponse<T = any> = {
  error: {
    status: number;
    data: {
      message: string;
      status: "Success" | "Error";
      statusCode: number;
      errorMessages: { path: string; message: string }[];
    };
  };
  data: {
    data: T;
    message: string;
    statusCode: number;
    success: boolean;
  };
};

export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export interface IUser {
  _id: Types.ObjectId | any;
  userName: string;
  email: string;
  password: string;
  displayImage: string;
  createdAt: Date;
  updatedAt: Date;
}
export enum TaskStatus {
  PENDING = "pending",
  COMPLETED = "completed",
}

// Define the Task interface
export interface ITask extends IDocumentBase {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  title: string;
  description: string;
  dueDate: Date;
  status: TaskStatus;
}
