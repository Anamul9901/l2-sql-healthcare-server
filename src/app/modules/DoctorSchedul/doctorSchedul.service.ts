import { Prisma } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { IAuthUser } from "../../interfaces/common";
import { IPaginationOptions } from "../../interfaces/pagination";
import { paginationHelper } from "../../../helpars/paginationHelper";
import ApiError from "../../errors/ApiError";

const insertIntoDB = async (
  user: any,
  payload: {
    scheduleIds: string[];
  }
) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user.email,
      isDeleted: false,
    },
  });

  const doctorScheduleData = payload.scheduleIds?.map((scheduleId) => ({
    doctorId: doctorData.id,
    scheduleId,
  }));

  const result = await prisma.doctorSchedules.createMany({
    data: doctorScheduleData,
  });

  return result;
};

const getMySchedule = async (
  filters: any,
  options: IPaginationOptions,
  user: IAuthUser
) => {
  const { startDate, endDate, ...filterData } = filters;

  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper.calculatePaginatin(options);

  const andConditions: Prisma.DoctorSchedulesWhereInput[] = [];

  if (startDate && endDate) {
    andConditions.push({
      AND: [
        {
          schedule: {
            startDateTime: {
              gte: startDate,
            },
          },
        },
        {
          schedule: {
            endDateTime: {
              lte: endDate,
            },
          },
        },
      ],
    });
  }

  //   console.log(Object.keys(filterData)); // aikhane key gulu array akare debe
  if (Object.keys(filterData).length > 0) {
    // conver string to boolien of isBooked filter
    if (
      typeof filterData.isBooked === "string" &&
      filterData.isBooked === "true"
    ) {
      filterData.isBooked = true;
    } else if (
      typeof filterData.isBooked === "string" &&
      filterData.isBooked === "false"
    ) {
      filterData.isBooked = false;
    }

    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  //   console.dir(andConditions, {depth: 'indinity'})

  const whereContitions: Prisma.DoctorSchedulesWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.doctorSchedules.findMany({
    where: whereContitions,
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder
        ? {
            // [sortBy]: sortOrder,
          }
        : {},
  });

  const total = await prisma.doctorSchedules.count({
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

const deleteFromDB = async (user: IAuthUser, scheduleId: string) => {
  const doctorDelete = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });

  const isBookedSchedule = await prisma.doctorSchedules.findUnique({
    where: {
      doctorId_scheduleId: {
        doctorId: doctorDelete.id,
        scheduleId: scheduleId,
      },
      isBooked: true,
    },
  });

  if (isBookedSchedule) {
    throw new ApiError(
      404,
      "You can not delete the schedule, because of the schedule already booked!"
    );
  }

  const isExistBook = await prisma.doctorSchedules.findUniqueOrThrow({
    where: {
      doctorId_scheduleId: {
        doctorId: doctorDelete.id,
        scheduleId: scheduleId,
      },
    },
  });

 

  // composite key theke delete korte gele aivabe delete korte hobe. @@id onujaye
  const result = await prisma.doctorSchedules.delete({
    where: {
      doctorId_scheduleId: {
        doctorId: doctorDelete.id,
        scheduleId: scheduleId,
      },
    },
  });

  return result;
};

export const DoctorSchedulService = {
  insertIntoDB,
  getMySchedule,
  deleteFromDB,
};
