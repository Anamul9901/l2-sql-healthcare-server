import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { AppointmentService } from "./appointment.service";
import sendResponse from "../../../shared/sendResponse";
import { IAuthUser } from "../../interfaces/common";
import pick from "../../../shared/pick";

const createAppointment = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;

    const result = await AppointmentService.createAppointment(
      user as IAuthUser,
      req.body
    );

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Appointment booked successfully!",
      data: result,
    });
  }
);

const getMyAppointment = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const filter = pick(req.query, ["status", "paymentStatus"]);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

    const result = await AppointmentService.getMyAppointment(
      user as IAuthUser,
      filter,
      options
    );

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Appointment fetch successfully!",
      data: result,
    });
  }
);

export const AppointmentController = {
  createAppointment,
  getMyAppointment,
};
