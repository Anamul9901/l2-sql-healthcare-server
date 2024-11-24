import { RequestHandler } from "express";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import { doctorFilterableFields } from "./doctor.constant";
import { DoctorService } from "./doctor.service";
import sendResponse from "../../../shared/sendResponse";

const getAllFromDB: RequestHandler = catchAsync(async (req, res) => {
  // console.log(req.query)

  const filters = pick(req.query, doctorFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  // console.log(options);
  const result = await DoctorService.getAllFromDb(filters, options);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Doctor data retrieve",
    meta: result.meta,
    data: result.data,
  });
});

const findByIdFromDB: RequestHandler = catchAsync(async (req, res) => {
  const result = await DoctorService.findByIdFromDB(req.params.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Doctor data retrieve",
    data: result,
  });
});

const softDeleteFromDB: RequestHandler = catchAsync(async (req, res) => {
  const result = await DoctorService.softDeleteFromDB(req.params.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Doctor Delete Successfully!",
    data: null,
  });
});

const deleteFromDB: RequestHandler = catchAsync(async (req, res) => {
  const result = await DoctorService.deleteFromDB(req.params.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Doctor Delete Successfully!",
    data: null,
  });
});

const updateIntoDB: RequestHandler = catchAsync(async (req, res) => {
  const {id} = req.params;
  const result = await DoctorService.updateIntoDB(id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Doctor updated Successfully!",
    data: result,
  });
});

export const DoctorController = {
  getAllFromDB,
  findByIdFromDB,
  softDeleteFromDB,
  deleteFromDB,
  updateIntoDB
};
