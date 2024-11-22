import { IsNotEmpty, IsString, IsEmail, Length } from "class-validator";

export class AuthDTO {
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    public email: string;

    @IsNotEmpty()
    @IsString()
    @Length(3, 20, { message: 'Password needs to have between 3 to 20 characters.' })
    public password: string;
}