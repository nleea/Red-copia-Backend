import { Request, Response } from "express";
import { validationResult } from "express-validator";
import Post from "../../models/post.model";
import { v2 as cloudinary } from "cloudinary";
import { cloudinary_config } from "../../config";
import fs from "fs";
import postModel from "../../models/post.model";

export async function createPost(req: Request, res: Response) {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.json({ error: { ...error.array() } });
  }

  const { title, body } = req.body;
  try {
    if (req.user) {
      const { _id, user } = req.user as any;
      const path_image = await cloudinary.uploader.upload(
        req.file.path,
        cloudinary_config
      );
      if (path_image) {
        fs.unlinkSync(req.file.path);
      }
      const new_post = new Post({
        title,
        body,
        url: path_image.secure_url,
        postedBy: { id: _id, name: user },
      });
      await new_post.save();
      return res.status(200).json({ message: "the post is saved success" });
    } else {
      return res.json({ error: "The user not found" });
    }
  } catch (error) {
    return res.json({ error });
  }
}

export async function AllPost(req: Request, res: Response) {
  try {
    const posts = await (await Post.find().limit(100)).reverse();
    res.status(200).json({ message: "success", data: { ...posts } });
  } catch (error) {
    res.json({ error });
  }
}

export async function SubAllPost(req: Request, res: Response) {
  try {
    const posts = (
      await Post.find({
        $or: [
          {
            postedBy: { $in: (req.user! as any).following },
          },
          {
            "postedBy.id": (req.user as any)._id,
          },
        ],
      })
    ).reverse();
    res.status(200).json({ message: "success", data: { ...posts } });
  } catch (error) {
    res.json({ error });
  }
}

export async function MyPost(req: Request, res: Response) {
  try {
    if (!req.user) {
      return;
    }
    const { _id } = req.user as any;
    const post = await Post.find({
      "postedBy.id": _id,
    });
    post.forEach((post) => {
      post.populate("Post Populated");
    });
    res.status(200).json({ message: "success", data: post });
  } catch (error) {
    res.json({ error });
  }
}

export async function Like(req: Request, res: Response) {
  try {
    const newPost = await postModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        $push: {
          likes: {
            id: (req.user as any)._id,
            name: (req.user as any).user,
            like: true,
          },
        } as any,
      },
      { new: true }
    );
    res.status(200).json({ message: "success", newPost });
  } catch (error) {
    res.json({ error });
  }
}

export async function unLike(req: Request, res: Response) {
  try {
    const newPost = await postModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        $pull: {
          likes: {
            id: (req.user as any)._id,
            name: (req.user as any).user,
            like: true,
          },
        } as any,
      },
      { new: true }
    );
    res.status(200).json({ message: "success", newPost });
  } catch (error) {
    res.json({ error });
  }
}

export async function comment(req: Request, res: Response) {
  const { text } = req.body;
  try {
    const newPost = await postModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        $push: {
          comments: {
            postedBy: {
              id: (req.user as any)._id,
              name: (req.user as any).user,
            },
            text: text.text,
          },
        } as any,
      },
      { new: true }
    );
    res.status(200).json({ message: "success", newPost });
  } catch (error) {
    res.json({ error });
  }
}

export const deletePost = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletePost = await postModel.findOne({
      $and: [{ _id: id }, { "postedBy.id": (req.user! as any)._id }],
    });
    if (deletePost === null)
      return res.status(422).json({ message: "Post not found" });
    await deletePost.remove();
    return res.status(200).json({ message: "Success", post: deletePost._id });
  } catch (error) {
    return res.status(404).json({ message: "Failed" });
  }
};

export const viewPost = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const post = await postModel.findById({ id: id });
    return res.status(200).json({ message: "Success", post });
  } catch (error) {
    return res.status(404).json({ message: "Failed" });
  }
};
