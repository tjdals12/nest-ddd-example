import { Type } from 'class-transformer';
import { IsNumber, Max, Min } from 'class-validator';

export class PaginationDto {
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    page: number;

    @Type(() => Number)
    @IsNumber()
    @Min(1)
    @Max(50)
    limit: number;
}
