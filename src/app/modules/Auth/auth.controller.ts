import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { AuthService } from "./auth.service";
import sendResponse from "../../../shared/sendResponse";

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.loginUser(req.body);

  const {refreshToken} = result;


  // refresh toke cookie te set kore debo, fole eita sequre thake, keu read korte parbe nah
  res.cookie('refreshToken', refreshToken, {
    secure: false, // production e true hobe must
    httpOnly: true
  })


  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Logged in successfully!",
    data: {
        accessToken: result.accessToken,
        needPasswordChange: result.needPasswordChange,
    }
  });
});

export const AuthController = {
  loginUser,
};
