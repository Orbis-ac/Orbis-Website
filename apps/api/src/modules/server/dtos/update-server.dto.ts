import {PartialType} from '@nestjs/swagger';
import {CreateServerDto} from "./create-server.dto";

export class UpdateServerDto extends PartialType(CreateServerDto) {
}