import { Request, Response } from "express";
import { AdminService } from "./admin.service";

const getAllFromDB = async (req: Request, res: Response) => {
  // console.log(req.query)
  try {
    const result = await AdminService.getAllFromDb(req.query);
    res.status(200).json({
      success: true,
      message: "Admin data retrieve",
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
};
