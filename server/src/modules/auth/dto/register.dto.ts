import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator"

export class RegisterDto {
    
    @IsString()
    @IsNotEmpty()
    fname: string

    @IsString()
    @IsNotEmpty()
    lname: string

    @IsEmail()
    @IsNotEmpty()
    email: string
    
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string

}