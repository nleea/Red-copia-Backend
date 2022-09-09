import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { connectMongo } from "./db";
import { route } from "./routes/Auth_routes/index_auth";
import session from "express-session";
import passport from "passport";
import routes_post from "./routes/Post_routes/index_post";
import { router_user } from "./routes/User_routes/index_user";
import { jwtStrategy } from "./Auth/passport";
import { upload } from "./multer";
import cors from "cors";
import morgan from "morgan";

const app = express();
app.use(
  session({
    secret: "theSecretPassword",
    resave: true,
    saveUninitialized: true,
    cookie: {
      secure: true,
    },
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + "src/public"));
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());
app.use(route);
app.use(
  "/post",
  jwtStrategy.authenticate("jwt", {
    session: false,
    failureMessage: "Unauthorized",
  }),
  upload,
  routes_post
);
app.use(
  "/user",
  upload,
  jwtStrategy.authenticate("jwt", {
    session: false,
    failureMessage: "Unauthorized",
  }),
  router_user
);
app.use(morgan("dev"));
app.listen(3001, () => {
  console.log("this is running");
  connectMongo();
});
