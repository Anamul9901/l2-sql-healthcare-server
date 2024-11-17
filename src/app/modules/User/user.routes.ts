import express, { NextFunction, Request, Response } from "express";
import { userController } from "./user.controller";
import { jwtHelpers } from "../../../helpars/jwtHelpers";
import configs from "../../../configs";
import { Secret } from "jsonwebtoken";

const router = express.Router();

const auth = (...roles: string[]) => {
  console.log(roles);
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;

      if(!token){
        throw new Error('You are not authorized!')
      }
      const verifiedUser = jwtHelpers.verifyToken(
        token,
        configs.jwt.jwt_secret as Secret
      );

      // includes means verifiedUser.role er role er sathe jode roles er moddhe thaka role na mathc hoi  
      if(roles.length && !roles.includes(verifiedUser.role)){
        throw new Error('You are not authorized!')
      }
      next()
    } catch (err) {
      next(err);
    }
  };
};

router.post("/", auth("ADMIN", "SUPER_ADMIN"), userController.createAdmin);

export const userRoutes = router;
