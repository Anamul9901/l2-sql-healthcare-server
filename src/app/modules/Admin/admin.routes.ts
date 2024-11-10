import express, { NextFunction, Request, Response } from "express";
import { AdminController } from "./admin.controller";
import { AnyZodObject, z } from "zod";

const router = express.Router();

const update = z.object({
  body: z.object({
    name: z.string().optional(),
    contactNumber: z.string().optional(),
  }),
});


// er maddhome controller r service e jabar age e request e konu error thakle ta handle kora jabe.
const validateRequest =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body
      });
      return next();
    } catch (err) {
      next(err);
    }
  };

router.get("/", AdminController.getAllFromDB);

router.get("/:id", AdminController.getByIdFromDB);

// put method: jode thake tahole update kore dey, jode na thake tahole create kore dey
router.patch("/:id", validateRequest(update), AdminController.updateIntoDB);

router.delete("/:id", AdminController.deleteFromDB);

router.delete("/soft/:id", AdminController.softDeleteFromDB);

export const AdminRoutes = router;
