import bcrypt from "bcrypt";
import { VandorPayload } from "../dto";
import jwt from "jsonwebtoken";
import { ApiError } from "./ApiError";
import { NOT_FOUND } from "./StatusCode";
import { Request } from 'express';
import { AuthPayload } from "../dto";

export const GenerateSalt = async () => {
  return await bcrypt.genSalt(10);
};
export const EncryptPassword = async (password: string, salt: string) => {
  return await bcrypt.hash(password, salt);
};

export const ComparePassword = async (
  enteredPassword: string,
  savedPassword: string,
  salt: string
) => {
  return (await EncryptPassword(enteredPassword, salt)) === savedPassword;
};

export const GenerateSignature = (payload: VandorPayload) => {
  if (!process.env.JWT_SECRET) {
    throw new ApiError(NOT_FOUND, "JWT_SECRET is not defined in environment variables");
  }
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
};

//JWT Token Validation Function
export const ValidateSignature = async (req: Request) => {

  const signature = req.get('Authorization');

  if (signature) {
    try {
      if (!process.env.JWT_SECRET) {
        throw new ApiError(NOT_FOUND, "JWT_SECRET is not defined in environment variables");
      }
      const payload = await jwt.verify(signature.split(' ')[1], process.env.JWT_SECRET) as AuthPayload;
//Property 'user' does not exist on type 'Request<ParamsDictionary,
      req.user = payload;
      return true;
    } catch (error) {
      return false
    }
  }
  return false;
}