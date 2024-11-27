import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { DoctorSchedulService } from "./doctorSchedul.service";
import sendResponse from "../../../shared/sendResponse";
import { IAuthUser } from "../../interfaces/common";
import pick from "../../../shared/pick";

const insertIntoDB = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const result = await DoctorSchedulService.insertIntoDB(user, req.body);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Doctor Schedule created successfully!",
      data: result,
    });
  }
);

const getMySchedule = catchAsync(async (req: Request & {user?: IAuthUser}, res: Response) => {
  const filters = pick(req.query, ["startDate", "endDate", "isBooked"]);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const user = req.user;
  const result = await DoctorSchedulService.getMySchedule(filters, options, user as IAuthUser);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "My Schedule fetched successfully!",
    data: result,
  });
});

export const DoctorScheduleController = {
  insertIntoDB,
  getMySchedule 
};
