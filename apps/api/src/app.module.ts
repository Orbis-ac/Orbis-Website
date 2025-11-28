import {Module} from '@nestjs/common';

import {AppService} from './app.service';
import {AppController} from './app.controller';
import {PrismaModule} from "./prisma/prisma.module";

import {AuthModule} from '@thallesp/nestjs-better-auth';
import {UserModule} from "./modules/user/user.module";
import {AuthModule as OrbisAuthModule} from "./modules/auth/auth.module";
import {ConfigModule} from '@nestjs/config';
import {auth} from '@repo/auth';
import {ServerModule} from "./modules/server/server.module";
import {TeamModule} from "./modules/team/team.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        PrismaModule, AuthModule.forRoot({auth}), UserModule, OrbisAuthModule, ServerModule, TeamModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
