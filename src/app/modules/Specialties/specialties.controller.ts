import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { SpecialtiesService } from "./specialties.service";

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await SpecialtiesService.insertIntoDB(req);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Specialties create successfully!",
    data: result,
  });
});

const getAllSpecialties = catchAsync(async (req: Request, res: Response) => {
  const result = await SpecialtiesService.getAllSpecialties();

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Specialties retrive successfully!",
    data: result,
  });
});

const deleteSpecialties = catchAsync(async (req: Request, res: Response) => {
  const result = await SpecialtiesService.deleteSpecialties(req.params.id);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Specialties deleted successfully!",
    data: null,
  });
});

export const SpecialtiesController = {
  insertIntoDB,
  getAllSpecialties,
  deleteSpecialties
};
