import { PartialType, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsDate,
    IsNumber,
    IsString,
    Length,
    MaxLength,
    MinLength,
} from 'class-validator';

export class CreateDepartmentDto {
    @IsString()
    @Length(4)
    departmentNo: string;

    @IsString()
    @MinLength(2)
    @MaxLength(50)
    departmentName: string;
}

export class UpdateDepartmentDto extends PickType(
    PartialType(CreateDepartmentDto),
    ['departmentName'],
) {}

export class ChangeManagerDto {
    @Type(() => Number)
    @IsNumber()
    employeeNo: number;
    @Type(() => Date)
    @IsDate()
    fromDate: Date;
}
