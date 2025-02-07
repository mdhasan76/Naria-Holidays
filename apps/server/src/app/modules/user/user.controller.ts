import { Request, Response } from "express";
import httpStatus from "http-status";
import { UserService } from "./user.service";
import { sendResponse } from "../../../shared/customResponse";
import catchAsync from "../../../shared/catchAsync";

// Update User
const updateUser = async (req: Request, res: Response) => {
  const data = req.body;
  const id = req.user._id;
  const result = await UserService.updateUser(id, data);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Updated User Successfully",
    data: result,
  });
};

// get User by id
const getUserById = catchAsync(async (req: Request, res: Response) => {
  console.log(req.user, "this is");
  const result = await UserService.getUserById(req.user._id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Get User Successfully",
    data: result,
  });
});

export const UserController = {
  getUserById,
  updateUser,
};
