import { PaginationDto } from '@core/base-request.dto';
import { Type } from 'class-transformer';
import { IsDate, IsOptional } from 'class-validator';

export class SearchAccessLogDto extends PaginationDto {
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    fromDate?: Date;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    toDate?: Date;
}
