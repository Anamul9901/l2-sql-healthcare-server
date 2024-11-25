import { Patient, Prisma } from "@prisma/client";
import { paginationHelper } from "../../../helpars/paginationHelper";
import { IPaginationOptions } from "../../interfaces/pagination";
import prisma from "../../../shared/prisma";
import { IPatientFilterRequest } from "./patient.interface";
import { patientSearcgAbleFirlds } from "./patient.constant";

const getAllFromDb = async (
  params: IPatientFilterRequest,
  options: IPaginationOptions
) => {
  const { searchTerm, ...filterData } = params;
  //   console.log(filterData); //* aikhane upore destracture korar karone, searchTerm bade onno gulu show korbe
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper.calculatePaginatin(options);
  // console.log({ limit, page, sortBy, sortOrder });

  const andConditions: Prisma.PatientWhereInput[] = [];

  if (params.searchTerm) {
    andConditions.push({
      OR: patientSearcgAbleFirlds.map((field) => ({
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

  const whereContitions: Prisma.PatientWhereInput = { AND: andConditions };
  //   console.log({whereContitions})

  const result = await prisma.patient.findMany({
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
    include: {
      medicalReport: true,
      patientHealthData: true,
    },
  });

  const total = await prisma.patient.count({
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

const getByIdFromDB = async (id: string): Promise<Patient | null> => {
  const result = await prisma.patient.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      medicalReport: true,
      patientHealthData: true,
    },
  });

  return result;
};

const updateIntoDB = async (id: string, payload: any) => {
  console.log(id, payload);
  await prisma.patient.findUniqueOrThrow({
    where: { id, isDeleted: false },
  });
  const result = await prisma.patient.update({
    where: { id },
    data: payload,
    include: {
      patientHealthData: true,
      medicalReport: true,
    },
  });

  return result;
};

export const PatientService = {
  getAllFromDb,
  getByIdFromDB,
  updateIntoDB,
};
