import {Injectable, Logger, OnModuleDestroy, OnModuleInit,} from '@nestjs/common';
import {PrismaClient} from '@repo/db';

@Injectable()
export class PrismaService
    extends PrismaClient
    implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(PrismaService.name);

    onModuleInit() {
        this.logger.log('Connecting to database...');
        // The Prisma Client singleton from @repo/database should already be connected,
        // but we'll add logging here
    }

    onModuleDestroy() {
        this.logger.log('Disconnecting from database...');
        // We don't actually want to disconnect the shared singleton
        // as it might be used by other parts of the application
    }
}