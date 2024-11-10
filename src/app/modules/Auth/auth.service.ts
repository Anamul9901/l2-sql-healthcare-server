import prisma from "../../../shared/prisma";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

  const accessToken = jwt.sign(
    {
      email: userData.email,
      role: userData.role,
    },
    "secrate_key",
    {
      algorithm: "HS256",
      expiresIn: "15m",
    }
  );
  console.log({ accessToken });
  return accessToken;
};

export const AuthService = {
  loginUser,
};
