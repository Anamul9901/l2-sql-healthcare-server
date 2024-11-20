import { NextFunction, Request, Response } from "express";
import { jwtHelpers } from "../../helpars/jwtHelpers";
import configs from "../../configs";
import { Secret } from "jsonwebtoken";
import ApiError from "../errors/ApiError";

const auth = (...roles: string[]) => {
  return async (req: Request & {user?: any}, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        throw new ApiError(401, "You are not authorized!");
      }
      const verifiedUser = jwtHelpers.verifyToken(
        token,
        configs.jwt.jwt_secret as Secret
      );

      req.user = verifiedUser;

      // includes means verifiedUser.role er role er sathe jode roles er moddhe thaka role na mathc hoi
      if (roles.length && !roles.includes(verifiedUser.role)) {
        throw new ApiError(403, "Forbidden!");
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};

export default auth;
