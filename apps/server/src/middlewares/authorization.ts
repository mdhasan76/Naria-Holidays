import { Request } from "express";
import ApiError from "../errors/ApiError";
import httpStatus from "http-status";
import { UserModel } from "../app/modules/user/user.model";
export const checkIfSelf = async (req: Request): Promise<boolean> => {
  // Check user does exist and get employee id from user data for compare the requester and employee
  const doesUserExist: any = await UserModel.findById(req.user?._id);
  if (!doesUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User Not found");
  }

  const result = doesUserExist?.employee.toString() == req.params.employeeId;

  if (!result) {
    throw new ApiError(
      httpStatus.METHOD_NOT_ALLOWED,
      "This route is only accessible for authenticated person"
    );
  }
  return result;
};
