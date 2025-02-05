import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { Secret } from "jsonwebtoken";
import { config } from "../config";
import ApiError from "../errors/ApiError";
import catchAsync from "../shared/catchAsync";
import { JwtHelper } from "../helpers/jwtHelpers";
import { RoleName } from "../shared/interface";
import { IUser } from "../app/modules/user/user.interface";

/**
 * Extend express Request interface to include user and businessId properties
 */

export interface IDecodedUser extends IUser {
  modules?: {
    [key: string]: {
      [key: string]: string[];
    };
  };
  roleName?: RoleName;
}

declare module "express" {
  interface Request {
    user?: IDecodedUser;
    businessId: any;
    moduleName?: string;
    resourceName?: string;
    functionName?: string;
  }
}

/**
 * Authentication middleware factory.
 *
 * @param {...Role[]} requiredRoles - The roles required to access the route.
 * @returns {Function} Middleware function to handle authentication and role-based access control.
 */
const auth = () =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // Extract authorization token from the request headers
    const token: Secret | undefined = req.headers.authorization?.split(" ")[1];
    // console.log(token, "this is token");
    // If no token is provided, throw an unauthorized error
    if (!token) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "You are not authorized. Please provide a valid token in the headers."
      );
    }

    // Initialize verifiedUser
    let verifiedUser: IDecodedUser | null = null;
    try {
      // Verify the token
      verifiedUser = JwtHelper.verifyToken(
        token,
        config.jwt.secret as Secret
      ) as IDecodedUser;
    } catch (err) {
      // If token verification fails, throw an unauthorized error
      throw new ApiError(httpStatus.UNAUTHORIZED, err.message);
    }

    // If the user is not verified, throw an unauthorized error
    if (!verifiedUser) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized: Invalid User");
    }

    // Attach user and businessId to the request object
    req.user = verifiedUser;
    // console.log(req.user, "this is user");
    // User has permission, proceed to the next middleware
    next();
  });

export default auth;
