import { Schema, model, Document } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

interface Iuser extends Document {
  user: string;
  email: string;
  password?: string;
}

const userSchema = new Schema({
  user: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profile: { type: String, required: false },
  followers: {
    id: { type: String },
    name: { type: String },
  },
  following: {
    id: { type: String },
    name: { type: String },
  },
});

userSchema.plugin(uniqueValidator);
export default model<Iuser>("User", userSchema);
