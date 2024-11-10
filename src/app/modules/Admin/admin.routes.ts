import express, { NextFunction, Request, Response } from "express";
import { AdminController } from "./admin.controller";

const router = express.Router();

const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  console.log("req", req.body);
  next();
};

router.get("/", AdminController.getAllFromDB);

router.get("/:id", AdminController.getByIdFromDB);

// put method: jode thake tahole update kore dey, jode na thake tahole create kore dey
router.patch("/:id", validateRequest, AdminController.updateIntoDB);

router.delete("/:id", AdminController.deleteFromDB);

router.delete("/soft/:id", AdminController.softDeleteFromDB);

export const AdminRoutes = router;
