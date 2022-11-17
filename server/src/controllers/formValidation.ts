import { NextFunction, Request, Response } from "express";
import * as Yup from "yup";

const formSchema = Yup.object({
  username: Yup.string()
    .required("Username required")
    .min(5, "Username too short")
    .max(20, "Username too long"),
  password: Yup.string()
    .required("Password required")
    .min(5, "Password too short")
    .max(20, "Password too long"),
});

export const validateForm = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const formData = req.body;
  formSchema
    .validate(formData)
    .catch((err) => {
      console.log(err.errors);
      return res.status(422).send("error");
    })
    .then((valid) => {
      if (valid) {
        console.log("data is good");
        return next();
      }
      return res.status(422).send();
    });
};
