import { PaginationDto } from '@core/base-request.dto';
import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional } from 'class-validator';

export class SearchEmployeeSalaryDto extends PaginationDto {
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    employeeNo?: number;
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    fromDate?: Date;
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    toDate?: Date;
}
