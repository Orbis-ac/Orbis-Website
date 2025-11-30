import {Injectable} from '@nestjs/common';
import {PrismaService} from "../../prisma/prisma.service";

@Injectable()
export class ServerCategoryService {
    constructor(private readonly prisma: PrismaService) {
    }

    async findAll() {
        return this.prisma.serverCategory.findMany({
            orderBy: {order: 'asc'},
            include: {
                _count: {
                    select: {
                        servers: true,
                    },
                },
            },
        });
    }

    async findBySlug(slug: string) {
        return this.prisma.serverCategory.findUnique({
            where: {slug},
            include: {
                _count: {
                    select: {
                        servers: true,
                    },
                },
            },
        });
    }
}