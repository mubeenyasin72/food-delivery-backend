import { IsEmail, IsEmpty, Length } from "class-validator";

export class CreateUserInput {

    @IsEmail()
    email: string;

    @Length(11, 13)
    phone: string;

    @Length(8, 12)
    password: string;
}
export class UserLoginInput {
    @IsEmail()
    email: string;
    @Length(8, 12)
    password: string;
}
export class EditUserProfileInputs {
    @Length(3, 16)
    firstName: string;
    @Length(3, 16)
    lastName: string;
    @Length(6, 16)
    address: string;

}
export interface UserPayload {
    _id: string;
    email: string;
    verified: boolean;
    // firstName: string;
    // lastName: string;
}

