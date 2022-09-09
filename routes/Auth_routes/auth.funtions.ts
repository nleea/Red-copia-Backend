import { Request, Response } from "express";
import User from "../../models/user.models";
import { validationResult } from "express-validator";
import { genSalt, hash, compare } from "bcryptjs";
import jwt from "jsonwebtoken";

export async function signup(req: Request, res: Response) {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.json({ error: error.array() });
  } else {
    const { user, password, email } = req.body;
    try {
      const salt = await genSalt(10);
      const NEW_PASSWORD = await hash(password, salt);
      const model_user = new User({
        user,
        email,
        password: NEW_PASSWORD,
      });
      await model_user.save();
      return res.status(200).json({ data: model_user, message: "success" });
    } catch (error) {
      return res.json({ error });
    }
  }
}

export async function Signin(req: Request, res: Response) {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.json({ error: error.array() });
  } else {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.json({ error: ["Invalid password or Email"] });
      } else {
        const password_validate = await compare(password, user.password!);
        if (!password_validate) {
          return res.json({ error: ["Invalid password or Email"] });
        }
        if (process.env.secret_jwt) {
          const token = jwt.sign(
            { email: user.email, user: user.user },
            process.env.secret_jwt,
            {
              expiresIn: "10h",
            }
          );
          if (token) {
            delete user.password;
            return res.status(200).json({ message: "success", token, user });
          } else {
            return res.json({ error: "error in the server" });
          }
        } else {
          return res.json({ error: "error in the server" });
        }
      }
    } catch (error) {
      res.json({ error });
    }
  }
}
