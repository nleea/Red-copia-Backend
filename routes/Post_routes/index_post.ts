import { Router } from "express";
import {
  createPost,
  AllPost,
  MyPost,
  Like,
  unLike,
  comment,
  deletePost,
  SubAllPost,
  viewPost,
} from "./post_route";
import { check } from "express-validator";
const router_post = Router({ strict: true });

router_post
  .get("/view_post", AllPost)
  .get("/sub/all/post", SubAllPost)
  .post(
    "/create",
    [check("title").not().isEmpty(), check("body").not().isEmpty()],
    createPost
  )
  .get("/myPosts", MyPost)
  .put("/like/:id", Like)
  .put("/unlike/:id", unLike)
  .put("/comment/:id", comment)
  .delete("/delete/:id", deletePost)
  .get("/view/post/:id", viewPost);
export default router_post;
