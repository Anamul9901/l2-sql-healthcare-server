import express from "express";
import { AdminController } from "./admin.controller";

const router = express.Router();

router.get("/", AdminController.getAllFromDB);

router.get("/:id", AdminController.getByIdFromDB);

// put method: jode thake tahole update kore dey, jode na thake tahole create kore dey
router.patch("/:id", AdminController.updateIntoDB);

export const AdminRoutes = router;
