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


  export const DoctorController = {
    getAllFromDB
  }