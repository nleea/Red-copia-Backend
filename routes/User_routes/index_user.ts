import { Router } from "express";
import { userById, follow, unfollow, ProfileImage } from "./user_route";
const router_user = Router({ strict: true });

router_user
  .get("/:id", userById)
  .put("/follow", follow)
  .put("/unfollow", unfollow)
  .patch("/profile/image/:id", ProfileImage);
export { router_user };
