import { Request, Response } from "express";
import httpStatus from "http-status";
import { UserService } from "./user.service";
import { sendResponse } from "../../../shared/customResponse";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import { UserFilterableField } from "./user.constant";
import { IUser } from "./user.interface";
import { PaginationOptions } from "../../../interfaces/sharedInterface";

// create User
const createUser = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const result = await UserService.createUser(data);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Create user successfully",
    data: result,
  });
});

// Update User
const updateUser = async (req: Request, res: Response) => {
  const data = req.body;
  const id = req.params.id;
  const result = await UserService.updateUser(id, data);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Updated User Successfully",
    data: result,
  });
};

// Delete User
const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await UserService.deleteUser(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Delete User Successfully",
    data: result,
  });
});

// Get User by pagination
const getUsers = catchAsync(async (req: Request, res: Response) => {
  const paginationOption = pick(req.query, PaginationOptions);

  const filters = pick(req.query, UserFilterableField);
  const result = await UserService.getUsers(filters, paginationOption);
  sendResponse<IUser[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Get Users Successfully",
    meta: result.meta,
    data: result.data,
  });
});

// get User by id
const getUserById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await UserService.getUserById(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Get User Success",
    data: result,
  });
});

export const UserController = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
