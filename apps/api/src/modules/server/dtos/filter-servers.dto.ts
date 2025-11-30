import {ApiPropertyOptional} from '@nestjs/swagger';
import {IsArray, IsBoolean, IsEnum, IsInt, IsOptional, IsString, Max, Min} from 'class-validator';
import {Transform, Type} from 'class-transformer';

export enum ServerSortOption {
    VOTES = 'votes',
    PLAYERS = 'players',
    NEWEST = 'newest',
    OLDEST = 'oldest',
    NAME_ASC = 'name-asc',
    NAME_DESC = 'name-desc',
}

export class FilterServersDto {
    @ApiPropertyOptional({example: 'hypixel', description: 'Search query'})
    @IsString()
    @IsOptional()
    search?: string;

    @ApiPropertyOptional({example: 'survival', description: 'Category slug'})
    @IsString()
    @IsOptional()
    category?: string;

    @ApiPropertyOptional({
        example: ['family-friendly', 'custom-plugins'],
        description: 'Tag slugs',
        type: [String],
    })
    @IsArray()
    @IsString({each: true})
    @IsOptional()
    @Transform(({value}) => (typeof value === 'string' ? [value] : value))
    tags?: string[];

    @ApiPropertyOptional({example: '1.0.0', description: 'Game version'})
    @IsString()
    @IsOptional()
    gameVersion?: string;

    @ApiPropertyOptional({example: true, description: 'Only online servers'})
    @IsBoolean()
    @IsOptional()
    @Transform(({value}) => value === 'true' || value === true)
    online?: boolean;

    @ApiPropertyOptional({example: true, description: 'Only featured servers'})
    @IsBoolean()
    @IsOptional()
    @Transform(({value}) => value === 'true' || value === true)
    featured?: boolean;

    @ApiPropertyOptional({example: true, description: 'Only verified servers'})
    @IsBoolean()
    @IsOptional()
    @Transform(({value}) => value === 'true' || value === true)
    verified?: boolean;

    @ApiPropertyOptional({example: 10, description: 'Minimum players'})
    @IsInt()
    @IsOptional()
    @Min(0)
    @Type(() => Number)
    minPlayers?: number;

    @ApiPropertyOptional({example: 100, description: 'Maximum players'})
    @IsInt()
    @IsOptional()
    @Min(0)
    @Type(() => Number)
    maxPlayers?: number;

    @ApiPropertyOptional({
        enum: ServerSortOption,
        example: ServerSortOption.VOTES,
        description: 'Sort option',
    })
    @IsEnum(ServerSortOption)
    @IsOptional()
    sortBy?: ServerSortOption = ServerSortOption.VOTES;

    @ApiPropertyOptional({example: 1, description: 'Page number'})
    @IsInt()
    @IsOptional()
    @Min(1)
    @Type(() => Number)
    page?: number = 1;

    @ApiPropertyOptional({
        example: 20,
        description: 'Items per page',
        minimum: 1,
        maximum: 100,
    })
    @IsInt()
    @IsOptional()
    @Min(1)
    @Max(100)
    @Type(() => Number)
    limit?: number = 20;
}

