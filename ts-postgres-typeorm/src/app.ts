import * as bodyParser from "body-parser";
import * as express from "express";
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import * as morgan from "morgan";
import { Routes } from "./routes";

function handleError(err, req, res, next) {
  res.status(err.statusCode || 500).send({ errors: err.message });
}

// create express app
const app = express();
app.use(morgan("tiny"));
app.use(bodyParser.json());

// register express routes from defined application routes
Routes.forEach((route) => {
  (app as any)[route.method](
    route.route,
    ...route.validation,
    async (req: Request, res: Response, next: Function) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          throw { statusCode: 400, message: errors.array() };
        }
        const result = await new (route.controller as any)()[route.action](
          req,
          res,
          next
        );
        res.json(result);
      } catch (error) {
        next(error);
      }
    }
  );
});

// setup express app here
// ...

app.use(handleError);
// start express server

export default app;
