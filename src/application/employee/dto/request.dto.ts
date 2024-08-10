import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsDate,
    IsIn,
    IsString,
    Length,
    MaxLength,
    MinLength,
} from 'class-validator';

export class CreateEmployeeDto {
    @IsString()
    @MinLength(2)
    @MaxLength(16)
    firstName: string;

    @IsString()
    @MinLength(2)
    @MaxLength(16)
    lastName: string;

    @IsIn(['M', 'F'])
    gender: 'M' | 'F';

    @Type(() => Date)
    @IsDate()
    birthDate: Date;

    @Type(() => Date)
    @IsDate()
    hireDate: Date;
}

export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) {}

export class ChangeDepartmentDto {
    @IsString()
    @Length(4)
    departmentNo: string;
    @Type(() => Date)
    @IsDate()
    fromDate: Date;
}

export class ChangeTitleDto {
    @IsString()
    @MaxLength(50)
    title: string;
    @Type(() => Date)
    @IsDate()
    fromDate: Date;
}
