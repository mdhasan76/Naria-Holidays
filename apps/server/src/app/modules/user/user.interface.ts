import { Model, Types } from "mongoose";

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
export type UserMethods = {
  doesPasswordMatched(
    givenPassword: string,
    savedPassword: string
  ): Promise<boolean>;
} & Model<IUser>;
export type IUserFilters = {
  searchTerm?: string;
};
