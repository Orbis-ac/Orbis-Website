import {BadRequestException, Injectable} from '@nestjs/common';
import {UpdateProfileDto} from "./dtos/update-profile.dto";
import {PrismaService} from "../../prisma/prisma.service";
import {StorageService} from "../storage/storage.service";

@Injectable()
export class UserService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly storage: StorageService,
    ) {
    }

    async findById(userId: string) {
        return this.prisma.user.findUnique({
            where: {id: userId},
            select: {
                id: true,
                username: true,
                email: true,
                emailVerified: true,
                image: true,
                createdAt: true,
                updatedAt: true,
                displayName: true,
                banner: true,
                bio: true,
                location: true,
                website: true,
                role: true,
                status: true,
                reputation: true,
                emailNotifications: true,
                marketingEmails: true,
                showEmail: true,
                showLocation: true,
                showOnlineStatus: true,
                theme: true,
                language: true,
                lastLoginAt: true,
                lastActiveAt: true,
                _count: {
                    select: {
                        followers: true,
                        following: true,
                    },
                },
            },
        });
    }

    async updateProfile(userId: string, updateDto: UpdateProfileDto) {
        return this.prisma.user.update({
            where: {id: userId},
            data: updateDto,
        });
    }

    async uploadProfileImage(userId: string, file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('No file provided');
        }

        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedMimeTypes.includes(file.mimetype)) {
            throw new BadRequestException('Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed');
        }

        // Max 5MB
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            throw new BadRequestException('File too large. Maximum size is 5MB');
        }

        const user = await this.prisma.user.findUnique({
            where: {id: userId},
            select: {image: true},
        });

        const imageUrl = await this.storage.uploadFile(
            file,
            `users/${userId}/profile`,
        );

        const updatedUser = await this.prisma.user.update({
            where: {id: userId},
            data: {image: imageUrl},
        });

        if (user?.image) {
            await this.storage.deleteFile(user.image).catch(() => {
            });
        }

        return updatedUser;
    }

    async deleteProfileImage(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: {id: userId},
            select: {image: true},
        });

        if (user?.image) {
            await this.storage.deleteFile(user.image);
        }

        return this.prisma.user.update({
            where: {id: userId},
            data: {image: null},
        });
    }
}