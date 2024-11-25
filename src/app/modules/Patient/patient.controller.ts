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

const getByIdFromDB: RequestHandler = catchAsync(async (req, res) => {

    const result = await PatientService.getByIdFromDB(req.params.id);
  
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Patient data retrieve",
      data: result
    });
  });

const updateIntoDB: RequestHandler = catchAsync(async (req, res) => {
    const {id} = req.params;


    const result = await PatientService.updateIntoDB(id, req.body);
  
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Patient data retrieve",
      data: result
    });
  });

const deleteFromDB: RequestHandler = catchAsync(async (req, res) => {
    const {id} = req.params;


    const result = await PatientService.deleteFromDB(id);
  
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Patient deleted successfully!",
      data: result
    });
  });

  export const PatientController = {
    getAllFromDB,
    getByIdFromDB,
    updateIntoDB,
    deleteFromDB
  }

