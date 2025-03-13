import mongoose, { ConnectOptions, MongooseError } from "mongoose";
import { ApiError } from "../utility";
import { INTERNAL_SERVER_ERROR } from "../utility";

export const createDatabaseConnection = () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new ApiError(INTERNAL_SERVER_ERROR, 'MONGO_URI environment variable is not defined');
  }

  const options: ConnectOptions = {
    connectTimeoutMS: 10000,
    maxPoolSize: 10,
  };
  mongoose.connect(mongoUri, options).then((res) => {
    console.log(`Connected with ${res.connection.name}`);
  }).catch((error: MongooseError) => {
    throw new ApiError(INTERNAL_SERVER_ERROR, error.message);
  }
  );

};