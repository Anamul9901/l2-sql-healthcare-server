import { Request, Response } from "express";
import { AdminService } from "./admin.service";

const getAllFromDB = async (req: Request, res: Response) => {
  const result = await AdminService.getAllFromDb();
  res.status(200).json({
    success: true,
    message: "Admin data retrieve",
    data: result,
  });
};

export const AdminController = {
  getAllFromDB,
};
