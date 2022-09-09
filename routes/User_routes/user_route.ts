import { Request, Response } from "express";
import postModel from "../../models/post.model";
import userModels from "../../models/user.models";
import { v2 as cloudinary } from "cloudinary";
import { cloudinary_config } from "../../config";
import fs from "fs";

export const userById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await userModels.findOne({ _id: id }).select("-password");
    if (!user) return res.status(404).json({ message: "User Not Found" });

    const post = await postModel
      .find({ "postedBy.id": id })
      .select(" _id title url");
    if (!post) return res.status(404).json({ error: "error" });
    return res.status(200).json({ user, post });
  } catch (error) {
    return res.status(404).json({ message: "User Not Found" });
  }
};

export const follow = async (req: Request, res: Response) => {
  const { folloId } = req.body;
  try {
    const follow = await userModels.findByIdAndUpdate(
      { _id: folloId },
      {
        $push: {
          followers: {
            id: (req.user as any)._id,
            name: (req.user as any).user,
          },
        },
      },
      { new: true }
    );
    if (!follow) return res.status(422).json({ message: "error" });
    const resp = await userModels.findByIdAndUpdate(
      { _id: (req.user as any)._id },
      {
        $push: {
          following: {
            id: folloId,
            name: follow.user,
          },
        },
      },
      { new: true }
    );
    return res.status(200).json({ resp, follow });
  } catch (error) {
    return res.status(422).json({ message: "error" });
  }
};

export const unfollow = async (req: Request, res: Response) => {
  const { folloId } = req.body;
  try {
    const follow = await userModels.findByIdAndUpdate(
      { _id: folloId },
      {
        $pull: {
          followers: {
            id: (req.user as any)._id,
            name: (req.user as any).user,
          },
        },
      },
      { new: true }
    );
    if (!follow) return res.status(422).json({ message: "error" });
    const resp = await userModels.findByIdAndUpdate(
      { _id: (req.user as any)._id },
      {
        $pull: {
          following: {
            id: folloId,
            name: follow.user,
          },
        },
      },
      { new: true }
    );
    return res.status(200).json({ resp, follow });
  } catch (error) {
    return res.status(422).json({ message: "error" });
  }
};

export const ProfileImage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const path_image = await cloudinary.uploader.upload(
      req.file.path,
      cloudinary_config
    );
    if (path_image) fs.unlinkSync(req.file.path);
    const resp = await userModels.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          profile: path_image.secure_url,
        },
      }
    );
    return res.status(200).json({ message: "Success", resp });
  } catch (error) {
    return res.status(422).json({ message: "error" });
  }
};
