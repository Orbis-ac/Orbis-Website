import {Module} from "@nestjs/common";
import {UserController} from "./users.controller";

@Module({
    controllers: [UserController],
})
export class UsersModule {}