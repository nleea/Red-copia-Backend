import { connect } from "mongoose";

export async function connectMongo() {
  try {
    if (process.env.MONGO_URI) {
      const mongo = await connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
      });
      console.log("connecte to mongodb");
      return mongo;
    } else {
      throw new Error("Uri no found");
    }
  } catch (error) {
    throw new Error(error);
  }
}
