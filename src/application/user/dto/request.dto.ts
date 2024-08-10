import { PartialType, PickType } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength } from 'class-validator';

export class SignUpDto {
    @IsString()
    @MinLength(3)
    @MaxLength(16)
    userId: string;

    @IsString()
    @MinLength(8)
    @MaxLength(30)
    password: string;

    @IsString()
    @MinLength(3)
    @MaxLength(20)
    userName: string;
}

export class SignInDto {
    @IsString()
    @MinLength(3)
    @MaxLength(30)
    userId: string;

    @IsString()
    @MinLength(8)
    @MaxLength(30)
    password: string;
}

export class UpdateProfileDto extends PartialType(
    PickType(SignUpDto, ['password', 'userName']),
) {}
