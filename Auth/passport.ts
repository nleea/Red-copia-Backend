import User from "../models/user.models";
import { ExtractJwt, Strategy, StrategyOptions } from "passport-jwt";
import passport from "passport";

const options: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.secret_jwt,
};

export const jwtStrategy = passport.use(
  new Strategy(options, async (payload, done) => {
    try {
      const user = await User.findOne({ email: payload.email });
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (error) {
      console.log(error);
    }
  })
);
