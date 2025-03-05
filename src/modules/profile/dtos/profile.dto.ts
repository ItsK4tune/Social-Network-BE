import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class EditProfileDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @MinLength(6)
  password?: string;
}