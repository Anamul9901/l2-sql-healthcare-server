import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { ScheduleService } from "./schedule.service";
import sendResponse from "../../../shared/sendResponse";
import pick from "../../../shared/pick";
import { IAuthUser } from "../../interfaces/common";

const inserIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await ScheduleService.inserIntoDB(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Schedule created successfully!",
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req: Request & {user?: IAuthUser}, res: Response) => {
  const filters = pick(req.query, ["startDate", "endDate"]);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const user = req.user;
  const result = await ScheduleService.getAllFromDB(filters, options, user as IAuthUser);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Schedule fetched successfully!",
    data: result,
  });
});

const getByIdFromDB = catchAsync(async (req: Request & {user?: IAuthUser}, res: Response) => {

  const user = req.user;
  const {id} = req.params;
  const result = await ScheduleService.getByIdFromDB(user as IAuthUser, id);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Schedule fetched successfully!",
    data: result,
  });
});

const deleteSchedul = catchAsync(async (req: Request & {user?: IAuthUser}, res: Response) => {

  const {id} = req.params;
  const result = await ScheduleService.deleteSchedul(id);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Schedule deleted successfully!",
    data: result,
  });
});

export const ScheduleController = {
  inserIntoDB,
  getAllFromDB,
  getByIdFromDB,
  deleteSchedul
};
