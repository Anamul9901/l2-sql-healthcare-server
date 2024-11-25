import { RequestHandler } from "express";
import pick from "../../../shared/pick";
import { patientFilterableFields } from "./patient.constant";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { PatientService } from "./patient.service";

const getAllFromDB: RequestHandler = catchAsync(async (req, res) => {
    // console.log(req.query)
  
    const filters = pick(req.query, patientFilterableFields);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    // console.log(options);
    const result = await PatientService.getAllFromDb(filters, options);
  
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Patient data retrieve",
      meta: result.meta,
      data: result.data,
    });
  });

  export const PatientController = {
    getAllFromDB
  }

