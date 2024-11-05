import { Prisma, PrismaClient } from "@prisma/client";
import { adminSearcgAbleFirlds } from "./admin.constant";
import { paginationHelper } from "../../../helpars/paginationHelper";

const prisma = new PrismaClient();

const getAllFromDb = async (params: any, options: any) => {
  //   console.log({ params });
  const { searchTerm, ...filterData } = params;
  //   console.log(filterData); //* aikhane upore destracture korar karone, searchTerm bade onno gulu show korbe
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper.calculatePaginatin(options);
  console.log({ limit, page, sortBy, sortOrder });

  const andConditions: Prisma.AdminWhereInput[] = [];

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

  //   console.log(Object.keys(filterData)); // aikhane key gulu array akare debe
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: filterData[key],
        },
      })),
    });
  }

  //   console.dir(andConditions, {depth: 'indinity'})

  const whereContitions: Prisma.AdminWhereInput = { AND: andConditions };
  //   console.log({whereContitions})

  const result = await prisma.admin.findMany({
    where: whereContitions,
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : {
            createdAt: "desc",
          },
  });
  return result;
};

export const AdminService = {
  getAllFromDb,
};
