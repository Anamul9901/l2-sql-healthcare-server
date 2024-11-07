import { Admin, Prisma, UserStatus } from "@prisma/client";
import { adminSearcgAbleFirlds } from "./admin.constant";
import { paginationHelper } from "../../../helpars/paginationHelper";
import prisma from "../../../shared/prisma";

const getAllFromDb = async (params: any, options: any) => {
  //   console.log({ params });
  const { searchTerm, ...filterData } = params;
  //   console.log(filterData); //* aikhane upore destracture korar karone, searchTerm bade onno gulu show korbe
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper.calculatePaginatin(options);
  // console.log({ limit, page, sortBy, sortOrder });

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

  andConditions.push({
    isDeleted: false
  })

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

  const total = await prisma.admin.count({
    where: whereContitions,
  });
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getByIdFromDB = async (id: string) => {
  const result = await prisma.admin.findUnique({
    where: {
      id,
      isDeleted: false
    },
  });
  return result;
};

const updateIntoDB = async (id: string, data: Partial<Admin>) => {
  // id na thakle aikhan theke not found error show korbe.
  const isExist = await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false
    },
  });

  // foregn key update hobe nah. jemon: email
  const result = await prisma.admin.update({
    where: {
      id,
    },
    data,
  });
  return result;
};

const deleteFromDB = async (id: string) => {
  // for not fount error message
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const result = await prisma.$transaction(async (transactionClient) => {
    const adminDletedData = await transactionClient.admin.delete({
      where: {
        id,
      },
    });

    const userDeletedData = await transactionClient.user.delete({
      where: {
        email: adminDletedData.email,
      },
    });

    return adminDletedData;
  });

  return result;
};

const softDeleteFromDB = async (id: string) => {
  // for not fount error message
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false
    },
  });

  const result = await prisma.$transaction(async (transactionClient) => {
    const adminDletedData = await transactionClient.admin.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });

    const userDeletedData = await transactionClient.user.update({
      where: {
        email: adminDletedData.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });

    return adminDletedData;
  });

  return result;
};

export const AdminService = {
  getAllFromDb,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
  softDeleteFromDB,
};
