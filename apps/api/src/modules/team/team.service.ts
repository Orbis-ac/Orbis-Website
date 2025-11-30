import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import {PrismaService} from '../../prisma/prisma.service';
import {StorageService} from '../storage/storage.service';
import {CreateTeamDto} from './dtos/create-team.dto';
import {UpdateTeamDto} from './dtos/update-team.dto';
import {FilterTeamsDto} from './dtos/filter-teams.dto';
import {AddTeamMemberDto, UpdateTeamMemberDto} from './dtos/manage-member.dto';
import {TeamMemberRole} from '@repo/db';

@Injectable()
export class TeamService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly storage: StorageService,
    ) {
    }

    /**
     * Create a new team
     */
    async create(userId: string, createDto: CreateTeamDto) {
        // Check if team name is already taken
        const existing = await this.prisma.team.findUnique({
            where: {name: createDto.name.toLowerCase()},
        });

        if (existing) {
            throw new ConflictException('Team name is already taken');
        }

        // Create team with owner as first member
        const team = await this.prisma.team.create({
            data: {
                name: createDto.name.toLowerCase(),
                displayName: createDto.displayName,
                description: createDto.description,
                website: createDto.websiteUrl,
                discordUrl: createDto.discordUrl,
                ownerId: userId,
                members: {
                    create: {
                        userId,
                        role: TeamMemberRole.OWNER,
                    },
                },
            },
            include: {
                owner: {
                    select: {
                        id: true,
                        username: true,
                        displayName: true,
                        image: true,
                    },
                },
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                                displayName: true,
                                image: true,
                            },
                        },
                    },
                },
            },
        });

        return team;
    }

    /**
     * Find all teams with filters and pagination
     */
    async findAll(filterDto: FilterTeamsDto) {
        const {search, page = 1, limit = 20} = filterDto;

        const where: any = {};

        if (search) {
            where.OR = [
                {name: {contains: search, mode: 'insensitive'}},
                {displayName: {contains: search, mode: 'insensitive'}},
                {description: {contains: search, mode: 'insensitive'}},
            ];
        }

        const skip = (page - 1) * limit;

        const [teams, total] = await Promise.all([
            this.prisma.team.findMany({
                where,
                skip,
                take: limit,
                orderBy: {createdAt: 'desc'},
                include: {
                    owner: {
                        select: {
                            username: true,
                            displayName: true,
                            image: true,
                        },
                    },
                    _count: {
                        select: {
                            members: true,
                            servers: true,
                        },
                    },
                },
            }),
            this.prisma.team.count({where}),
        ]);

        return {
            data: teams,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                hasNext: page * limit < total,
                hasPrevious: page > 1,
            },
        };
    }

    /**
     * Find team by name
     */
    async findByName(name: string) {
        const team = await this.prisma.team.findUnique({
            where: {name: name.toLowerCase()},
            include: {
                owner: {
                    select: {
                        id: true,
                        username: true,
                        displayName: true,
                        image: true,
                    },
                },
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                                displayName: true,
                                image: true,
                            },
                        },
                    },
                    orderBy: [
                        {role: 'asc'},
                        {joinedAt: 'asc'},
                    ],
                },
                servers: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        logo: true,
                        currentPlayers: true,
                        maxPlayers: true,
                        isOnline: true,
                    },
                    take: 10,
                    orderBy: {createdAt: 'desc'},
                },
                _count: {
                    select: {
                        members: true,
                        servers: true,
                    },
                },
            },
        });

        if (!team) {
            throw new NotFoundException(`Team ${name} not found`);
        }

        return team;
    }

    /**
     * Find team by ID (internal use)
     */
    async findById(teamId: string) {
        const team = await this.prisma.team.findUnique({
            where: {id: teamId},
            include: {
                owner: true,
                members: {
                    include: {
                        user: true,
                    },
                },
            },
        });

        if (!team) {
            throw new NotFoundException('Team not found');
        }

        return team;
    }

    /**
     * Update team
     */
    async update(userId: string, teamId: string, updateDto: UpdateTeamDto) {
        const team = await this.prisma.team.findUnique({
            where: {id: teamId},
            select: {ownerId: true},
        });

        if (!team) {
            throw new NotFoundException('Team not found');
        }

        // Check if user has permission to edit
        const canEdit = await this.checkEditPermission(userId, teamId);
        if (!canEdit) {
            throw new ForbiddenException('You do not have permission to edit this team');
        }

        const updateData: any = {};

        if (updateDto.displayName !== undefined) updateData.displayName = updateDto.displayName;
        if (updateDto.description !== undefined) updateData.description = updateDto.description;
        if (updateDto.websiteUrl !== undefined) updateData.website = updateDto.websiteUrl;
        if (updateDto.discordUrl !== undefined) updateData.discordUrl = updateDto.discordUrl;

        const updated = await this.prisma.team.update({
            where: {id: teamId},
            data: updateData,
            include: {
                owner: {
                    select: {
                        id: true,
                        username: true,
                        displayName: true,
                        image: true,
                    },
                },
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                                displayName: true,
                                image: true,
                            },
                        },
                    },
                },
            },
        });

        return updated;
    }

    /**
     * Delete team
     */
    async delete(userId: string, teamId: string) {
        const team = await this.prisma.team.findUnique({
            where: {id: teamId},
            select: {ownerId: true, logo: true, banner: true},
        });

        if (!team) {
            throw new NotFoundException('Team not found');
        }

        if (team.ownerId !== userId) {
            throw new ForbiddenException('Only the team owner can delete the team');
        }

        // Delete files
        if (team.logo) {
            await this.storage.deleteFile(team.logo).catch(() => {
            });
        }
        if (team.banner) {
            await this.storage.deleteFile(team.banner).catch(() => {
            });
        }

        await this.prisma.team.delete({
            where: {id: teamId},
        });

        return {message: 'Team deleted successfully'};
    }

    /**
     * Upload team logo
     */
    async uploadLogo(userId: string, teamId: string, file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('No file provided');
        }

        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowedMimeTypes.includes(file.mimetype)) {
            throw new BadRequestException(
                'Invalid file type. Only JPEG, PNG, and WebP are allowed',
            );
        }

        const maxSize = 2 * 1024 * 1024;
        if (file.size > maxSize) {
            throw new BadRequestException('File too large. Maximum size is 2MB');
        }

        const team = await this.prisma.team.findUnique({
            where: {id: teamId},
            select: {logo: true},
        });

        if (!team) {
            throw new NotFoundException('Team not found');
        }

        const canEdit = await this.checkEditPermission(userId, teamId);
        if (!canEdit) {
            throw new ForbiddenException('You do not have permission to edit this team');
        }

        const logoUrl = await this.storage.uploadFile(
            file,
            `teams/${teamId}/logo`,
        );

        const updated = await this.prisma.team.update({
            where: {id: teamId},
            data: {logo: logoUrl},
        });

        if (team.logo) {
            await this.storage.deleteFile(team.logo).catch(() => {
            });
        }

        return updated;
    }

    /**
     * Upload team banner
     */
    async uploadBanner(userId: string, teamId: string, file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('No file provided');
        }

        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowedMimeTypes.includes(file.mimetype)) {
            throw new BadRequestException(
                'Invalid file type. Only JPEG, PNG, and WebP are allowed',
            );
        }

        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            throw new BadRequestException('File too large. Maximum size is 5MB');
        }

        const team = await this.prisma.team.findUnique({
            where: {id: teamId},
            select: {banner: true},
        });

        if (!team) {
            throw new NotFoundException('Team not found');
        }

        const canEdit = await this.checkEditPermission(userId, teamId);
        if (!canEdit) {
            throw new ForbiddenException('You do not have permission to edit this team');
        }

        const bannerUrl = await this.storage.uploadFile(
            file,
            `teams/${teamId}/banner`,
        );

        const updated = await this.prisma.team.update({
            where: {id: teamId},
            data: {banner: bannerUrl},
        });

        if (team.banner) {
            await this.storage.deleteFile(team.banner).catch(() => {
            });
        }

        return updated;
    }

    /**
     * Delete team logo
     */
    async deleteLogo(userId: string, teamId: string) {
        const team = await this.prisma.team.findUnique({
            where: {id: teamId},
            select: {logo: true},
        });

        if (!team) {
            throw new NotFoundException('Team not found');
        }

        const canEdit = await this.checkEditPermission(userId, teamId);
        if (!canEdit) {
            throw new ForbiddenException('You do not have permission to edit this team');
        }

        if (team.logo) {
            await this.storage.deleteFile(team.logo);
        }

        return this.prisma.team.update({
            where: {id: teamId},
            data: {logo: null},
        });
    }

    /**
     * Delete team banner
     */
    async deleteBanner(userId: string, teamId: string) {
        const team = await this.prisma.team.findUnique({
            where: {id: teamId},
            select: {banner: true},
        });

        if (!team) {
            throw new NotFoundException('Team not found');
        }

        const canEdit = await this.checkEditPermission(userId, teamId);
        if (!canEdit) {
            throw new ForbiddenException('You do not have permission to edit this team');
        }

        if (team.banner) {
            await this.storage.deleteFile(team.banner);
        }

        return this.prisma.team.update({
            where: {id: teamId},
            data: {banner: null},
        });
    }

    /**
     * Add team member
     */
    async addMember(userId: string, teamId: string, addDto: AddTeamMemberDto) {
        // Check if user has permission (owner or admin)
        const canManageMembers = await this.checkManageMembersPermission(userId, teamId);
        if (!canManageMembers) {
            throw new ForbiddenException('You do not have permission to add members');
        }

        // Check if user to add exists
        const userToAdd = await this.prisma.user.findUnique({
            where: {id: addDto.userId},
        });

        if (!userToAdd) {
            throw new NotFoundException('User not found');
        }

        // Check if user is already a member
        const existingMember = await this.prisma.teamMember.findUnique({
            where: {
                teamId_userId: {
                    teamId,
                    userId: addDto.userId,
                },
            },
        });

        if (existingMember) {
            throw new ConflictException('User is already a member of this team');
        }

        // Only owner can add other owners
        if (addDto.role === TeamMemberRole.OWNER) {
            const team = await this.prisma.team.findUnique({
                where: {id: teamId},
                select: {ownerId: true},
            });

            if (team?.ownerId !== userId) {
                throw new ForbiddenException('Only the team owner can add other owners');
            }
        }

        const member = await this.prisma.teamMember.create({
            data: {
                teamId,
                userId: addDto.userId,
                role: addDto.role,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        displayName: true,
                        image: true,
                    },
                },
            },
        });

        return member;
    }

    /**
     * Update team member role
     */
    async updateMember(
        userId: string,
        teamId: string,
        memberId: string,
        updateDto: UpdateTeamMemberDto,
    ) {
        const canManageMembers = await this.checkManageMembersPermission(userId, teamId);
        if (!canManageMembers) {
            throw new ForbiddenException('You do not have permission to update members');
        }

        const member = await this.prisma.teamMember.findUnique({
            where: {id: memberId},
            include: {team: true},
        });

        if (!member || member.teamId !== teamId) {
            throw new NotFoundException('Team member not found');
        }

        // Only owner can change owner role
        if (updateDto.role === TeamMemberRole.OWNER || member.role === TeamMemberRole.OWNER) {
            const team = await this.prisma.team.findUnique({
                where: {id: teamId},
                select: {ownerId: true},
            });

            if (team?.ownerId !== userId) {
                throw new ForbiddenException('Only the team owner can modify owner roles');
            }
        }

        const updated = await this.prisma.teamMember.update({
            where: {id: memberId},
            data: {role: updateDto.role},
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        displayName: true,
                        image: true,
                    },
                },
            },
        });

        return updated;
    }

    /**
     * Remove team member
     */
    async removeMember(userId: string, teamId: string, memberId: string) {
        const canManageMembers = await this.checkManageMembersPermission(userId, teamId);
        if (!canManageMembers) {
            throw new ForbiddenException('You do not have permission to remove members');
        }

        const member = await this.prisma.teamMember.findUnique({
            where: {id: memberId},
        });

        if (!member || member.teamId !== teamId) {
            throw new NotFoundException('Team member not found');
        }

        // Cannot remove the owner
        if (member.role === TeamMemberRole.OWNER) {
            throw new ForbiddenException('Cannot remove the team owner');
        }

        await this.prisma.teamMember.delete({
            where: {id: memberId},
        });

        return {message: 'Member removed successfully'};
    }

    /**
     * Leave team
     */
    async leaveTeam(userId: string, teamId: string) {
        const member = await this.prisma.teamMember.findUnique({
            where: {
                teamId_userId: {
                    teamId,
                    userId,
                },
            },
        });

        if (!member) {
            throw new NotFoundException('You are not a member of this team');
        }

        if (member.role === TeamMemberRole.OWNER) {
            throw new ForbiddenException(
                'Team owner cannot leave. Transfer ownership or delete the team instead.',
            );
        }

        await this.prisma.teamMember.delete({
            where: {id: member.id},
        });

        return {message: 'Left team successfully'};
    }

    /**
     * Get user's teams
     */
    async getUserTeams(userId: string) {
        const memberships = await this.prisma.teamMember.findMany({
            where: {userId},
            include: {
                team: {
                    include: {
                        owner: {
                            select: {
                                username: true,
                                displayName: true,
                                image: true,
                            },
                        },
                        _count: {
                            select: {
                                members: true,
                                servers: true,
                            },
                        },
                    },
                },
            },
            orderBy: {joinedAt: 'desc'},
        });

        return memberships.map((m) => ({
            ...m.team,
            memberRole: m.role,
            joinedAt: m.joinedAt,
        }));
    }

    /**
     * Check if user has edit permission
     */
    private async checkEditPermission(userId: string, teamId: string): Promise<boolean> {
        const member = await this.prisma.teamMember.findUnique({
            where: {
                teamId_userId: {
                    teamId,
                    userId,
                },
            },
        });

        if (!member) {
            return false;
        }

        return (member.role === TeamMemberRole.OWNER || member.role === TeamMemberRole.ADMIN);
    }

    /**
     * Check if user can manage members
     */
    private async checkManageMembersPermission(userId: string, teamId: string): Promise<boolean> {
        const member = await this.prisma.teamMember.findUnique({
            where: {
                teamId_userId: {
                    teamId,
                    userId,
                },
            },
        });

        if (!member) {
            return false;
        }

        return (member.role === TeamMemberRole.OWNER || member.role === TeamMemberRole.ADMIN);
    }
}