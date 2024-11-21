import { NextFunction, Request, Response } from "express";
import { userService } from "./user.service";

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

export const userController = {
  createAdmin,
  createDoctor,
  createPatient
};
