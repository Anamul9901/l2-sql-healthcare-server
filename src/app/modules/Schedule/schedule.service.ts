import { addHours, addMinutes, format } from "date-fns";
import prisma from "../../../shared/prisma";
import { Prisma, Schedule } from "@prisma/client";
import { IFilterRequest, ISchedule } from "./schedule.interface";
import { IPaginationOptions } from "../../interfaces/pagination";
import { paginationHelper } from "../../../helpars/paginationHelper";
import { IAuthUser } from "../../interfaces/common";

const inserIntoDB = async (payload: ISchedule): Promise<Schedule[]> => {
  const { startDate, endDate, startTime, endTime } = payload;
  const interverlTime = 30;

  const schedules = [];

  const currentDate = new Date(startDate); // start date //convert regulart to ISO dateTime
  const lastDate = new Date(endDate); // end date

  while (currentDate <= lastDate) {
    const startDateTime = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, "yyyy-MM-dd")}`,
          Number(startTime.split(":")[0])
        ),
        Number(startTime.split(":")[1])
      )
    );

    const endDateTime = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, "yyyy-MM-dd")}`,
          Number(endTime.split(":")[0])
        ),
        Number(endTime.split(":")[1])
      )
    );

    while (startDateTime < endDateTime) {
      const scheduleData = {
        startDateTime: startDateTime,
        endDateTime: addMinutes(startDateTime, interverlTime),
      };
      // console.log(scheduleData);

      const existingSchedule = await prisma.schedule.findFirst({
        where: {
          startDateTime: scheduleData.startDateTime,
          endDateTime: scheduleData.endDateTime,
        },
      });

      if (!existingSchedule) {
        const result = await prisma.schedule.create({
          data: scheduleData,
        });
        schedules.push(result);
      }

      startDateTime.setMinutes(startDateTime.getMinutes() + interverlTime);
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return schedules;
};

const getAllFromDB = async (
  filters: IFilterRequest,
  options: IPaginationOptions,
  user: IAuthUser
) => {
  const { startDate, endDate, ...filterData } = filters;
  //   console.log(filterData); //* aikhane upore destracture korar karone, searchTerm bade onno gulu show korbe

  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper.calculatePaginatin(options);
  // console.log({ limit, page, sortBy, sortOrder });

  const andConditions: Prisma.ScheduleWhereInput[] = [];

  if (startDate && endDate) {
    andConditions.push({
      AND: [
        {
          startDateTime: {
            gte: startDate,
          },
        },
        {
          endDateTime: {
            lte: endDate,
          },
        },
      ],
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

  //   console.dir(andConditions, {depth: 'indinity'})

  const whereContitions: Prisma.ScheduleWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};
  //   console.log({whereContitions})

  const doctorSchedules = await prisma.doctorSchedules.findMany({
    where: {
      doctor: {
        email: user?.email,
      },
    },
  });

  const doctorScheduleIds = doctorSchedules.map(
    (schedule) => schedule.scheduleId
  );

  // console.log(doctorScheduleIds);

  const result = await prisma.schedule.findMany({
    where: {
      ...whereContitions,
      id: {
        notIn: doctorScheduleIds,
      },
    },
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : {},
  });

  const total = await prisma.schedule.count({
    where: {
      ...whereContitions,
      id: {
        notIn: doctorScheduleIds,
      },
    },
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

const getByIdFromDB = async(user: IAuthUser, id: string)=>{

  const findOne = await prisma.schedule.findFirst({
    where: {
      id,
    }
  })
  return findOne
}

export const ScheduleService = {
  inserIntoDB,
  getAllFromDB,
  getByIdFromDB
};
