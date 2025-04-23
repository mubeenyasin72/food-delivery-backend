import { IsEmail, IsEmpty, Length } from "class-validator";

export class CreateUserInput{

    @IsEmail()
    email: string;

    @Length(11, 13)
    phone: string;

    @Length(8, 12)
    password: string;
}