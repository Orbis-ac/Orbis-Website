import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';
import {IsNotEmpty, IsOptional, IsString} from 'class-validator';

export class ModerateServerDto {
    @ApiPropertyOptional({
        example: 'Server complies with community rules',
        description: 'Reason for the moderation action',
    })
    @IsString()
    @IsOptional()
    reason?: string;
}

export class RejectServerDto {
    @ApiProperty({
        example: 'The server does not comply with content rules',
        description: 'Reason for rejection',
    })
    @IsString()
    @IsNotEmpty()
    reason: string;
}
