import {ApiProperty} from '@nestjs/swagger';
import {IsEnum, IsNotEmpty, IsOptional, IsString} from 'class-validator';

export enum ReportAction {
    DISMISS = 'DISMISS',
    RESOLVE = 'RESOLVE',
    UNDER_REVIEW = 'UNDER_REVIEW',
}

export class ModerateReportDto {
    @ApiProperty({
        enum: ReportAction,
        description: 'Action to take on the report',
        example: ReportAction.RESOLVE,
    })
    @IsEnum(ReportAction)
    @IsNotEmpty()
    action: ReportAction;

    @ApiProperty({
        description: 'Moderator response or notes about the action taken',
        example: 'User has been warned and content removed',
        required: false,
    })
    @IsString()
    @IsOptional()
    response?: string;
}