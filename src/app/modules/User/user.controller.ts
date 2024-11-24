import { NextFunction, Request, Response } from "express";
import { userService } from "./user.service";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import { userFilterableFields } from "./user.constant";
import sendResponse from "../../../shared/sendResponse";

const createAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const result = await userService.createAdmin(req);
    // res.send(result);
    res.status(200).json({
      success: true,
      message: "Admin created successfuly!",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.name || "Something went wrong",
      error: err,
    });
  }
};

const createDoctor = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const result = await userService.createDoctor(req);
    res.status(200).json({
      success: true,
      message: "Doctor created successfuly!",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.name || "Something went wrong",
      error: err,
    });
  }
};

const createPatient = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const result = await userService.createPatient(req);
    res.status(200).json({
      success: true,
      message: "Patient created successfuly!",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.name || "Something went wrong",
      error: err,
    });
  }
};

const getAllFromDB = catchAsync(async (req, res) => {
  // console.log(req.query)

  const filters = pick(req.query, userFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  // console.log(options);
  const result = await userService.getAllFromDb(filters, options);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User data retrieve",
    meta: result.meta,
    data: result.data,
  });
});

const changeProfileStatus = catchAsync(async (req, res) => {
  
  const {id} = req.params


  const result = await userService.changeProfileStatus(id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Status Updated",
    data: result,
  });
});

const getMyProfile = catchAsync(async (req, res) => {

  const user = req.user

  const result = await userService.getMyProfile(user);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "My profile data fetched!",
    data: result,
  });
});

const updateMyProfile = catchAsync(async (req, res) => {

  const user = req.user

  const result = await userService.updateMyProfile(user, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "My profile updated!",
    data: result,
  });
});

export const userController = {
  createAdmin,
  createDoctor,
  createPatient,
  getAllFromDB,
  changeProfileStatus,
  getMyProfile,
  updateMyProfile
};
