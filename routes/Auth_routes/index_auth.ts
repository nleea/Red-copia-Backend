import { Router } from "express";
import { signup, Signin } from "./auth.funtions";
import { check } from "express-validator";

const route = Router({ strict: true });

route
  .route("/signup")
  .post(
    [
      check("email").isEmail(),
      check("password").isLength({ min: 8 }),
      check("user").not().isEmpty(),
    ],
    signup
  );

route
  .route("/signin")
  .post([check("email").isEmail(), check("password").not().isEmpty()], Signin);

export { route };
