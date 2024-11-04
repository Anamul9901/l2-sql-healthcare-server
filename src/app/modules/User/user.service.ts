import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

const createAdmin = async (data: any) => {
  // console.log({ data });
  const userData = {
    email: data.admin.email,
    password: data.password,
    role: UserRole.ADMIN,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    const createdUserData = await transactionClient.user.create({
      data: userData,
    });

    const createdAdminData = await transactionClient.admin.create({
      data: data.admin,
    });

    return createdAdminData;
  });
  return result;
};

export const userService = {
  createAdmin,
};
