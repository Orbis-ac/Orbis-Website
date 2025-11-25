import {Module} from '@nestjs/common';

import {AppService} from './app.service';
import {AppController} from './app.controller';
import {PrismaModule} from "./prisma/prisma.module";

import {AuthModule} from '@thallesp/nestjs-better-auth';
import {auth} from "@repo/auth/auth";
import {UsersModule} from "./modules/users/users.module";

@Module({
    imports: [PrismaModule, AuthModule.forRoot({auth}), UsersModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
