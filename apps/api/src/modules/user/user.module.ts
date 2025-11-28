import {Module} from "@nestjs/common";
import {UserController} from "./user.controller";
import {UserService} from "./user.service";
import {StorageModule} from "../storage/storage.module";
import {ServerModule} from "../server/server.module";

@Module({
    imports: [StorageModule, ServerModule],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule {
}