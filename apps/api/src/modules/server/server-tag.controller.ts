import {Controller, Get, Param, Query} from '@nestjs/common';
import {ApiOperation, ApiParam, ApiQuery, ApiTags} from '@nestjs/swagger';
import {ServerTagService} from './server-tag.service';
import {AllowAnonymous} from "@thallesp/nestjs-better-auth";

@ApiTags('server-tags')
@Controller('server-tags')
@AllowAnonymous()
export class ServerTagController {
    constructor(private readonly tagService: ServerTagService) {
    }

    @Get()
    @ApiOperation({summary: 'Get all server tags'})
    async findAll() {
        return this.tagService.findAll();
    }

    @Get('popular')
    @ApiOperation({summary: 'Get popular tags'})
    @ApiQuery({name: 'limit', required: false, type: Number})
    async findPopular(@Query('limit') limit?: string) {
        const parsedLimit = limit ? parseInt(limit, 10) : 20;
        return this.tagService.findPopular(parsedLimit);
    }

    @Get(':slug')
    @ApiOperation({summary: 'Get tag by slug'})
    @ApiParam({name: 'slug', description: 'Tag slug'})
    async findBySlug(@Param('slug') slug: string) {
        return this.tagService.findBySlug(slug);
    }
}
