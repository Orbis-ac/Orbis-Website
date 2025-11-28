import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsInt,
    IsArray,
    IsUrl,
    MinLength,
    MaxLength,
    Min,
    Max,
    Matches,
} from 'class-validator';

export class CreateServerDto {
    @ApiProperty({ example: 'Hypixel Hytale', description: 'Server name' })
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(50)
    name: string;

    @ApiProperty({
        example: 'The best Hytale server with incredible mini-games...',
        description: 'Full server description',
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(50)
    @MaxLength(5000)
    description: string;

    @ApiPropertyOptional({
        example: 'Join the best Hytale server!',
        description: 'Short description (max 200 chars)',
    })
    @IsString()
    @IsOptional()
    @MaxLength(200)
    shortDesc?: string;

    @ApiProperty({
        example: 'play.hypixel.net',
        description: 'Server IP address or domain',
    })
    @IsString()
    @IsNotEmpty()
    @Matches(
        /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$|^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/,
        { message: 'Invalid IP address or domain' },
    )
    serverIp: string;

    @ApiPropertyOptional({ example: 25565, description: 'Server port' })
    @IsInt()
    @IsOptional()
    @Min(1)
    @Max(65535)
    port?: number = 25565;

    @ApiProperty({ example: '1.0.0', description: 'Main game version' })
    @IsString()
    @IsNotEmpty()
    gameVersion: string;

    @ApiPropertyOptional({
        example: ['1.0.0', '1.0.1'],
        description: 'Supported game versions',
    })
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    supportedVersions?: string[];

    @ApiPropertyOptional({
        example: 'https://example.com',
        description: 'Server website URL',
    })
    @IsUrl()
    @IsOptional()
    websiteUrl?: string;

    @ApiPropertyOptional({
        example: 'https://discord.gg/example',
        description: 'Discord server URL',
    })
    @IsUrl()
    @IsOptional()
    discordUrl?: string;

    @ApiPropertyOptional({
        example: 'https://youtube.com/@example',
        description: 'YouTube channel URL',
    })
    @IsUrl()
    @IsOptional()
    youtubeUrl?: string;

    @ApiPropertyOptional({
        example: 'https://twitter.com/example',
        description: 'Twitter/X profile URL',
    })
    @IsUrl()
    @IsOptional()
    twitterUrl?: string;

    @ApiProperty({
        example: 'category-id-123',
        description: 'Primary category ID',
    })
    @IsString()
    @IsNotEmpty()
    primaryCategoryId: string;

    @ApiPropertyOptional({
        example: ['category-id-456', 'category-id-789'],
        description: 'Additional category IDs (max 3 total)',
    })
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    categoryIds?: string[];

    @ApiProperty({
        example: ['tag-id-123', 'tag-id-456'],
        description: 'Tag IDs (min 1, max 10)',
    })
    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty()
    tagIds: string[];

    @ApiPropertyOptional({
        example: 'team-id-123',
        description: 'Team ID (if server belongs to a team)',
    })
    @IsString()
    @IsOptional()
    teamId?: string;
}