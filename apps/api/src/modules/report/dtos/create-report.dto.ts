import {ApiProperty} from '@nestjs/swagger';
import {IsEnum, IsNotEmpty, IsOptional, IsString} from 'class-validator';

export enum ReportReason {
    SPAM = 'SPAM',
    REUPLOADED_WORK = 'REUPLOADED_WORK',
    INAPPROPRIATE = 'INAPPROPRIATE',
    MALICIOUS = 'MALICIOUS',
    NAME_SQUATTING = 'NAME_SQUATTING',
    POOR_DESCRIPTION = 'POOR_DESCRIPTION',
    INVALID_METADATA = 'INVALID_METADATA',
    OTHER = 'OTHER',
}

export class CreateReportDto {
    @ApiProperty({
        enum: ReportReason,
        description: 'Reason for the report',
        example: ReportReason.SPAM,
    })
    @IsEnum(ReportReason)
    @IsNotEmpty()
    reason: ReportReason;

    @ApiProperty({
        description: 'Additional context about your report (required if reason is OTHER)',
        example: 'This user is impersonating a known creator',
        required: false,
    })
    @IsString()
    @IsOptional()
    description?: string;
}