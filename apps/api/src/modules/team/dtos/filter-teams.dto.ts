import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class FilterTeamsDto {
    @ApiPropertyOptional({
        example: 'Hypixel',
        description: 'Search teams by name or description',
    })
    @IsString()
    @IsOptional()
    search?: string;

    @ApiPropertyOptional({
        example: 1,
        description: 'Page number',
        default: 1,
    })
    @Type(() => Number)
    @IsInt()
    @IsOptional()
    @Min(1)
    page?: number = 1;

    @ApiPropertyOptional({
        example: 20,
        description: 'Items per page',
        default: 20,
    })
    @Type(() => Number)
    @IsInt()
    @IsOptional()
    @Min(1)
    @Max(100)
    limit?: number = 20;
}