import { VandorPayload } from "./Vandor.dto"
import { UserPayload } from "./User.dto"

export type AuthPayload = VandorPayload | UserPayload; 