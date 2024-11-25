import express from "express";
import { PatientController } from "./patient.controller";

const router = express.Router();

router.get("/", PatientController.getAllFromDB);

router.get("/:id", PatientController.getByIdFromDB);

router.patch("/:id", PatientController.updateIntoDB);

router.delete("/:id", PatientController.deleteFromDB);

export const PatientRoutes = router;
