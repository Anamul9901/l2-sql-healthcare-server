import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import router from "./app/routes";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";

const app: Application = express();
app.use(cors());

// parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send({
    massage: "Ph health care server..",
  });
});

// 1s e ai rout e chack korbe, error asle neser rout e jabe
app.use("/api/v1", router);

// uporer rout e error asle ai route e ase error show korbe. ai route e o error asle neser rout e jabe
app.use(globalErrorHandler);

// uporer rout e error asa mane user wrong rout e hite korse. mane 'rout not found' error dekhate hobe.
app.use((req: Request, res: Response, next: NextFunction) => {
  // console.log(req)
  res.status(404).json({
    success: false,
    message: "API NOT FOUND!",
    error: {
      path: req.originalUrl,
      message: "Your requested path is not found!",
    },
  });
});

export default app;
