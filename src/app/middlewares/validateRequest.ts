import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

// er maddhome controller r service e jabar age e request e konu error thakle ta handle kora jabe.
const validateRequest =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
      });
      return next();
    } catch (err) {
      next(err);
    }
  };

export default validateRequest;
