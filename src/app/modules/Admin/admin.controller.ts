import { Request, Response } from "express";
import { AdminService } from "./admin.service";
import pick from "../../../shared/pick";
import { adminFilterableFields } from "./admin.constant";

const getAllFromDB = async (req: Request, res: Response) => {
  // console.log(req.query)
  try {
    const filters = pick(req.query, adminFilterableFields);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    // console.log(options);
    const result = await AdminService.getAllFromDb(filters, options);
    res.status(200).json({
      success: true,
      message: "Admin data retrieve",
      meta: result.meta,
      data: result.data,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.name || "Something went wrong",
      error: err,
    });
  }
};

const getByIdFromDB = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await AdminService.getByIdFromDB(id);
    res.status(200).json({
      success: true,
      message: "Admin data retrieve by id",
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

const updateIntoDB = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;
    console.log(data);
    const result = await AdminService.updateIntoDB(id, data);
    res.status(200).json({
      success: true,
      message: "Updated successfully",
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

const deleteFromDB = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await AdminService.deleteFromDB(id);
    res.status(200).json({
      success: true,
      message: "Admin data deleted!",
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

const softDeleteFromDB = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await AdminService.softDeleteFromDB(id);
    res.status(200).json({
      success: true,
      message: "Admin data deleted!",
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

export const AdminController = {
  getAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
  softDeleteFromDB,
};
