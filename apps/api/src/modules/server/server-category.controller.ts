import {Controller, Get, Param} from '@nestjs/common';
import {ApiOperation, ApiParam, ApiTags} from '@nestjs/swagger';
import {ServerCategoryService} from './server-category.service';
import {AllowAnonymous} from "@thallesp/nestjs-better-auth";

@ApiTags('server-categories')
@Controller('server-categories')
@AllowAnonymous()
export class ServerCategoryController {
    constructor(private readonly categoryService: ServerCategoryService) {
    }

    @Get()
    @ApiOperation({summary: 'Get all server categories'})
    async findAll() {
        return this.categoryService.findAll();
    }

    @Get(':slug')
    @ApiOperation({summary: 'Get category by slug'})
    @ApiParam({name: 'slug', description: 'Category slug'})
    async findBySlug(@Param('slug') slug: string) {
        return this.categoryService.findBySlug(slug);
    }
}