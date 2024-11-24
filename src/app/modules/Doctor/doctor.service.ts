import { Prisma } from "@prisma/client";
import { paginationHelper } from "../../../helpars/paginationHelper";
import { IPaginationOptions } from "../../interfaces/pagination";
import prisma from "../../../shared/prisma";
import { IDoctorFilterRequest } from "./doctor.interface";
import { doctorSearcgAbleFirlds } from "./doctor.constant";

const getAllFromDb = async (
    params: IDoctorFilterRequest,
    options: IPaginationOptions
  ) => {
    const { searchTerm, ...filterData } = params;
    //   console.log(filterData); //* aikhane upore destracture korar karone, searchTerm bade onno gulu show korbe
    const { limit, page, skip, sortBy, sortOrder } =
      paginationHelper.calculatePaginatin(options);
    // console.log({ limit, page, sortBy, sortOrder });
  
    const andConditions: Prisma.DoctorWhereInput[] = [];
  
    if (params.searchTerm) {
      andConditions.push({
        OR: doctorSearcgAbleFirlds.map((field) => ({
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
            equals: (filterData as any)[key],
          },
        })),
      });
    }
  
    andConditions.push({
      isDeleted: false,
    });
  
    //   console.dir(andConditions, {depth: 'indinity'})
  
    const whereContitions: Prisma.DoctorWhereInput = { AND: andConditions };
    //   console.log({whereContitions})
  
    const result = await prisma.doctor.findMany({
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
  
    const total = await prisma.doctor.count({
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

  
  export const DoctorService = {
    getAllFromDb
  }