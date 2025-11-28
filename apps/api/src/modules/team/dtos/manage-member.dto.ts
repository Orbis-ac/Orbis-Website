import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { TeamMemberRole } from '@repo/db';

export class AddTeamMemberDto {
    @ApiProperty({ example: 'user-id-123', description: 'User ID to add to the team' })
    @IsString()
    @IsNotEmpty()
    userId: string;

    @ApiProperty({
        example: TeamMemberRole.MEMBER,
        description: 'Role to assign to the team member',
        enum: TeamMemberRole,
    })
    @IsEnum(TeamMemberRole)
    @IsNotEmpty()
    role: TeamMemberRole;
}

export class UpdateTeamMemberDto {
    @ApiProperty({
        example: TeamMemberRole.ADMIN,
        description: 'New role for the team member',
        enum: TeamMemberRole,
    })
    @IsEnum(TeamMemberRole)
    @IsNotEmpty()
    role: TeamMemberRole;
}