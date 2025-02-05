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
  businessId: Types.ObjectId;
  createdBy: {
    name: string;
    id: Types.ObjectId | string;
  };
  updatedBy: {
    name: string;
    id: Types.ObjectId;
    note?: string;
  };
  isDeleted: boolean;
  updatedAt?: Date;
  createdAt?: Date;
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
