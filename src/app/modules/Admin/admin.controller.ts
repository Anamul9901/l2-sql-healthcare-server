import { NextFunction, Request, RequestHandler, Response } from "express";
import { AdminService } from "./admin.service";
import pick from "../../../shared/pick";
import { adminFilterableFields } from "./admin.constant";
import sendResponse from "../../../shared/sendResponse";

const catchAsync = (fn: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      next(err);
    }
  };
};

// RequestHandler lekle r req, res, next er type lekte hobe nah.
const getAllFromDB: RequestHandler = catchAsync(async (req, res) => {
  // console.log(req.query)

  const filters = pick(req.query, adminFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  // console.log(options);
  const result = await AdminService.getAllFromDb(filters, options);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Admin data retrieve",
    meta: result.meta,
    data: result.data,
  });
});

const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await AdminService.getByIdFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Admin data retrieve by id",
    data: result,
  });
});

const updateIntoDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  const result = await AdminService.updateIntoDB(id, data);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Updated successfully",
    data: result,
  });
});

const deleteFromDB = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const result = await AdminService.deleteFromDB(id);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Admin data deleted!",
      data: result,
    });
  } catch (err: any) {
    next(err);
  }
};

const softDeleteFromDB = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const result = await AdminService.softDeleteFromDB(id);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Admin data deleted!",
      data: result,
    });
  } catch (err: any) {
    next(err);
  }
};

export const AdminController = {
  getAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
  softDeleteFromDB,
};
