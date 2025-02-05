import httpStatus from "http-status";
import { UserSearchableFields } from "./user.constant";
import { IUser, IUserFilters } from "./user.interface";
import ApiError from "../../../errors/ApiError";
import { searchHelper } from "../../../helpers/searchHelper";
import {
  IPaginationOption,
  IGenericResponse,
} from "../../../interfaces/sharedInterface";
import { UserModel } from "./user.model";

// Create new User
const createUser = async (data: IUser): Promise<IUser> => {
  const user = new UserModel(data);
  await user.save();
  return user;
};
// Update user
const updateUser = async (
  id: string,
  payload: Partial<IUser>
): Promise<IUser | null> => {
  const { displayImage } = payload;
  const updatePayload: any = {};
  if (displayImage) {
    updatePayload.displayImage = displayImage;
  }
  const result = await UserModel.findOneAndUpdate({ _id: id }, updatePayload, {
    new: true,
  });
  return result;
};

// Get users by pagination
const getUsers = async (
  filters: IUserFilters,
  pagination: IPaginationOption
): Promise<IGenericResponse<IUser[]>> => {
  const option = searchHelper(filters, pagination, UserSearchableFields);

  const result = await UserModel.find(option.whereCondition)
    .sort(option.sortCondition)
    .skip(option.skip)
    .limit(option.limit as number);
  const total = await UserModel.countDocuments(option.whereCondition);

  return {
    meta: {
      limit: option.limit,
      page: option.page,
      total,
    },
    data: result,
  };
};

// Delete User to DB
const deleteUser = async (userId: string): Promise<string> => {
  const user = await UserModel.findByIdAndUpdate(userId, {
    isDeleted: true,
    deletedAt: new Date(),
  });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  return "Success";
};

// Get single users
const getUserById = async (id: string): Promise<IUser | null> => {
  const user = await UserModel.findOne({ _id: id });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  return user;
};

export const UserService = {
  createUser,
  updateUser,
  deleteUser,
  getUsers,
  getUserById,
};
