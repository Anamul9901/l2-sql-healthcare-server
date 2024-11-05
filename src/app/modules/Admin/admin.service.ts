import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getAllFromDb = async (params: any) => {
  const andConditions: Prisma.AdminWhereInput[] = [];


  const adminSearcgAbleFirlds = ["name", "email"] 
  if (params.searchTerm) {
    andConditions.push({
      OR: adminSearcgAbleFirlds.map((field) => ({
        [field]: {
          contains: params?.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

//   console.dir(andConditions, {depth: 'indinity'})

  const whereContitions: Prisma.AdminWhereInput = { AND: andConditions };
  //   console.log({whereContitions})

  const result = await prisma.admin.findMany({
    where: whereContitions,
  });
  return result;
};

export const AdminService = {
  getAllFromDb,
};
