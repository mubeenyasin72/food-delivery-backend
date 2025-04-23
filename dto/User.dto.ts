import { IsEmail, IsEmpty, Length } from "class-validator";

export class CreateUserInput{

    @IsEmail()
    email: string;

    @Length(6, 20)
    phone: string;

    @Length(6, 12)
    password: string;
}