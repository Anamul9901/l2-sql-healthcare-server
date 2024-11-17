import prisma from "../../../shared/prisma";
import * as bcrypt from "bcrypt";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { jwtHelpers } from "../../../helpars/jwtHelpers";
import { UserStatus } from "@prisma/client";
import configs from "../../../configs";

const loginUser = async (payload: { email: string; password: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.password,
    userData.password
  );
  //   console.log({isCorrectPassword})
  if (!isCorrectPassword) {
    throw new Error("Password incorrect!");
  }

  const accessToken = jwtHelpers.generateToken(
    { email: userData.email, role: userData.role },
    configs.jwt.jwt_secret as Secret,
    configs.jwt.expires_in as string
  );

  const refreshToken = jwtHelpers.generateToken(
    { email: userData.email, role: userData.role },
    configs.jwt.refresh_token_secret as Secret,
    configs.jwt.refresh_token_expires_in as string
  );

  //   console.log({ accessToken });
  return {
    accessToken,
    refreshToken,
    needPasswordChange: userData.needPasswordChange,
  };
};

const refreshToken = async (token: string) => {
  let decodedData;
  try {
    decodedData = jwtHelpers.verifyToken(token, configs.jwt.refresh_token_secret as Secret);
    console.log(decodedData);
  } catch (err) {
    throw new Error("You are not authorized!");
  }

  console.log(decodedData);
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedData.email,
      status: UserStatus.ACTIVE,
    },
  });

  const accessToken = jwtHelpers.generateToken(
    { email: userData.email, role: userData.role },
    configs.jwt.jwt_secret as Secret,
    configs.jwt.expires_in as string
  );

  return {
    accessToken,
    refreshToken,
    needPasswordChange: userData.needPasswordChange,
  };
};

export const AuthService = {
  loginUser,
  refreshToken,
};
