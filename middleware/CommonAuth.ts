import { Request, Response, NextFunction } from 'express';
import { AuthPayload } from "../dto";
import { ApiError } from '../utility/ApiError';
import { UNAUTHORIZED, ValidateSignature } from '../utility';

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export const Authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const validate = await ValidateSignature(req);
  console.log(validate)
    if (validate) {
        next();
    } else { 
        console.log("else part is running")
        res.status(UNAUTHORIZED).json(new ApiError(UNAUTHORIZED, "Unauthorized"));
    }
}