import prisma from "../../../shared/prisma";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { jwtHelpers } from "../../../helpars/jwtHelpers";



const loginUser = async (payload: { email: string; password: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
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
    "secreate_key",
    "5m"
  );

  const refreshToken =  jwtHelpers.generateToken(
    { email: userData.email, role: userData.role },
    "secreate_key_refresh",
    "30d"
  );

  //   console.log({ accessToken });
  return {
    accessToken,
    refreshToken,
    needPasswordChange: userData.needPasswordChange,
  };
};


const refreshToken = async(token: string) =>{
  console.log('refresh', token);
}

export const AuthService = {
  loginUser,
  refreshToken
};
