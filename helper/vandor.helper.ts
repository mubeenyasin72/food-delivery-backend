import { isValidObjectId } from "mongoose";
import { Vandor } from "../models";

// Find Vandor By Email or By Id Helper Function.
export const FindVandor = async (id?: string, email?: string) => {
  if (email) {
    return await Vandor.findOne({ email });
  }
  if (id && isValidObjectId(id)) {
    return await Vandor.findById(id);
  }
  return null;
};
