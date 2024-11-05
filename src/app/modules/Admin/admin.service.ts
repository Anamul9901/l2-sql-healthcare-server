import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getAllFromDb = async (params: any) => {
  const andConditions: Prisma.AdminWhereInput[] = [];

  if (params.searchTerm) {
    andConditions.push({
      OR: [
        {
          name: {
            contains: params?.searchTerm,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: params?.searchTerm,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  // console.dir(andConditions, {depth: 'indinity'})

  const whereContitions: Prisma.AdminWhereInput = { AND: andConditions };

  const result = await prisma.admin.findMany({
    where: whereContitions,
  });
  return result;
};

export const AdminService = {
  getAllFromDb,
};
