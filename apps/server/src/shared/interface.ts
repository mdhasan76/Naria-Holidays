export enum RoleName {
  SUPER_ADMIN = "super admin",
  ADMIN = "admin",
  EMPLOYEE = "employee",
  USER = "user",
}
import { Document, Types } from "mongoose";

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

export interface IDateRangeFilters {
  startDate: Date;
  endDate: Date;
  by?: string;
}

export const PaginationOptions = ["page", "limit", "sortBy", "sortOrder"];
export enum DayName {
  Monday = "Monday",
  Tuesday = "Tuesday",
  Wednesday = "Wednesday",
  Thursday = "Thursday",
  Friday = "Friday",
  Saturday = "Saturday",
  Sunday = "Sunday",
}

export enum PasswordResetChannelType {
  EMAIL = "email",
  SMS = "sms",
  PUSH = "push",
  OTHER = "other",
}
export interface UserName {
  firstName: string;
  lastName: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  area?: {
    id: Types.ObjectId;
    name: string;
  };
}

export enum PaymentMethod {
  CASH = "cash",
  BKASH = "bKash",
  NAGAD = "nagad",
  ROKET = "roket",
  BANK = "bank",
  OTHER = "other",
}

export enum OTPSenderType {
  PASSWORD_RESET = "password_reset",
  ON_MOBILE_NUMBER_CHANGE = "on_mobile_number_change",
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
