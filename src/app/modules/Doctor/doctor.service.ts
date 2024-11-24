import { Doctor, Prisma, UserStatus } from "@prisma/client";
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

const findByIdFromDB = async (id: string): Promise<Doctor | null> => {
  const result = await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });
  return result;
};

const softDeleteFromDB = async (id: string): Promise<Doctor | null> => {
  await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  const result = await prisma.$transaction(async (transactionClient) => {
    const doctorData = await transactionClient.doctor.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });

    await transactionClient.user.update({
      where: {
        email: doctorData.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });

    return doctorData;
  });

  return result;
};

const deleteFromDB = async (id: string): Promise<Doctor | null> => {
  await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const result = await prisma.$transaction(async (transactionClient) => {
    const doctorDeleteData = await transactionClient.doctor.delete({
      where: {
        id,
      },
    });

    await transactionClient.user.delete({
      where: {
        email: doctorDeleteData.email,
      },
    });

    return doctorDeleteData;
  });

  return result;
};

const updateIntoDB = async (id: string, payload: any) => {
  const { specialties, ...doctorData } = payload;

  const doctorInfo = await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  await prisma.$transaction(async (transactionClient) => {
    await transactionClient.doctor.update({
      where: {
        id,
      },
      data: doctorData,
    });

    if (specialties && specialties.length > 0) {
      // delete specilties
      const deleteSpecialtiesIds = specialties.filter(
        (speciality: any) => speciality.isDeleted
      );
      for (const specialty of deleteSpecialtiesIds) {
        await transactionClient.doctorSpecialties.deleteMany({
          where: {
            doctorId: doctorInfo.id,
            specialitiesId: specialty.specialitiesId,
          },
        });
      }

      // create specilties
      const createSpecialtiesIds = specialties.filter(
        (speciality: any) => !speciality.isDeleted
      );
      for (const specialty of createSpecialtiesIds) {
        await transactionClient.doctorSpecialties.create({
          data: {
            doctorId: doctorInfo.id,
            specialitiesId: specialty.specialitiesId,
          },
        });
      }
    }
  });

  const result = await prisma.doctor.findUnique({
    where: {
      id: doctorInfo.id,
    },
    include: {
      doctorSpecialties: {
        include: {
          specialities: true,
        },
      },
    },
  });

  return result;
};

export const DoctorService = {
  getAllFromDb,
  findByIdFromDB,
  softDeleteFromDB,
  deleteFromDB,
  updateIntoDB,
};
