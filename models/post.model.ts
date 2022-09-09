import { model, Schema, Document } from "mongoose";
import moment from "moment";

interface Ipost extends Document {
  title: string;
  body: string;
  url: string;
  postedBy: any;
  likes: any;
  postedAt: any;
}

const post_schema = new Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  likes: {
    id: { type: String },
    name: { type: String },
    like: { type: Boolean },
  },
  postedAt: {
    type: String,
    default: moment.utc().format("DD MM YYYY"),
  },
  postedBy: {
    id: { type: String },
    name: { type: String },
  },
  comments: {
    text: { type: String },
    postedBy: {
      id: { type: String },
      name: { type: String },
    },
  },
});

export default model<Ipost>("Post", post_schema);
