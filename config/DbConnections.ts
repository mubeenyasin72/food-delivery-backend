import mongoose, { ConnectOptions, MongooseError } from "mongoose";
import { ApiError } from "../utility";
import { INTERNAL_SERVER_ERROR } from "../utility";

const createConnection = async (): Promise<void> => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new ApiError(INTERNAL_SERVER_ERROR, 'MONGO_URI environment variable is not defined');
  }

  const options: ConnectOptions = {
    connectTimeoutMS: 10000,
    maxPoolSize: 10,
  };
      await mongoose.connect(mongoUri, options);
      console.log('MongoDB connected successfully ');
      return; // Success, exit function
};

export default createConnection;



// Connection Code Sample
// const createConnection = async (): Promise<void> => {
//   const mongoUri = process.env.MONGO_URI;
//   if (!mongoUri) {
//     throw new ApiError(INTERNAL_SERVER_ERROR, 'MONGO_URI environment variable is not defined');
//   }

//   const options: ConnectOptions = {
//     connectTimeoutMS: 10000,
//     maxPoolSize: 10,
//   };

//   let attempt = 0;
//   const maxAttempts = 3;
//   const delayMs = 2000;

//   while (attempt < maxAttempts) {
//     try {
//       await mongoose.connect(mongoUri, options);
//       console.log('MongoDB connected successfully ');
//       return; // Success, exit function
//     } catch (error) {
//       attempt++;
//       const typedError = error instanceof Error ? error : new Error(String(error));
//       console.error(`Attempt ${attempt} failed: ${typedError.message}`);

//       if (attempt === maxAttempts) {
//         throw new ApiError(
//           503,
//           `Failed to connect to MongoDB after ${maxAttempts} attempts`,
//           [typedError.message]
//         );
//       }

//       await new Promise(resolve => setTimeout(resolve, delayMs));
//     }
//   }
// };

// export default createConnection;