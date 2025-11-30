// users.controller.ts
import {Body, Controller, Delete, Get, Param, Patch, Post, UploadedFile, UseInterceptors} from '@nestjs/common';
import {ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags} from '@nestjs/swagger';
import {UpdateProfileDto} from "./dtos/update-profile.dto";
import {UserService} from "./user.service";
import {Session, UserSession} from "@thallesp/nestjs-better-auth";
import {FileInterceptor} from '@nestjs/platform-express';
import {ServerService} from "../server/server.service";

@ApiTags('users')
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService,
                private readonly serverService: ServerService
    ) {
    }

    @Get('me')
    @ApiBearerAuth()
    @ApiOperation({summary: 'Get current user profile'})
    async getMe(@Session() session: UserSession) {
        return this.userService.findById(session.user.id);
    }

    @Patch('me')
    @ApiBearerAuth()
    @ApiOperation({summary: 'Update current user profile'})
    async updateMe(
        @Session() session: UserSession,
        @Body() updateDto: UpdateProfileDto,
    ) {
        return this.userService.updateProfile(session.user.id, updateDto);
    }

    @Post('me/image')
    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @ApiOperation({summary: 'Upload profile image'})
    @UseInterceptors(FileInterceptor('image'))
    async uploadImage(
        @Session() session: UserSession,
        @UploadedFile() file: Express.Multer.File,
    ) {
        return this.userService.uploadProfileImage(session.user.id, file);
    }

    @Delete('me/image')
    @ApiBearerAuth()
    @ApiOperation({summary: 'Delete profile image'})
    async deleteImage(@Session() session: UserSession) {
        return this.userService.deleteProfileImage(session.user.id);
    }

    @Get('me/servers')
    @ApiBearerAuth()
    @ApiOperation({summary: 'Get current user servers'})
    async getUserServers(@Session() session: UserSession) {
        return this.serverService.getUserServers(session.user.id);
    }

    @Post(':userId/follow')
    @ApiBearerAuth()
    @ApiOperation({summary: 'Follow a user'})
    async followUser(
        @Session() session: UserSession,
        @Param('userId') userId: string,
    ) {
        return this.userService.followUser(session.user.id, userId);
    }

    @Delete(':userId/follow')
    @ApiBearerAuth()
    @ApiOperation({summary: 'Unfollow a user'})
    async unfollowUser(
        @Session() session: UserSession,
        @Param('userId') userId: string,
    ) {
        return this.userService.unfollowUser(session.user.id, userId);
    }

    @Get(':userId/followers')
    @ApiOperation({summary: 'Get user followers'})
    async getFollowers(@Param('userId') userId: string) {
        return this.userService.getFollowers(userId);
    }

    @Get(':userId/following')
    @ApiOperation({summary: 'Get users that this user is following'})
    async getFollowing(@Param('userId') userId: string) {
        return this.userService.getFollowing(userId);
    }

    @Get(':userId')
    @ApiOperation({summary: 'Get user profile by ID'})
    async getUserProfile(@Param('userId') userId: string) {
        return this.userService.getUserProfile(userId);
    }
}