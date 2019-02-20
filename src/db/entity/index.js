import mongoose from "mongoose";

export function connectMongoDB({ mongoDB }) {
  console.log(`connect mongo using url: ${mongoDB}`);
  return mongoose.connect(mongoDB, {
    useNewUrlParser: true,
  });
}
