import { applyDecorators, UseGuards } from "@nestjs/common";
import { ModuleEnum } from "../enums/modules.enums";
import { JwtGuard } from "../guards/jwt.guard";
import { PermissionGuard } from "../guards/permission.guard";
import { ModuleSetMetadata } from './modules.decorators';

export function Auth(module: ModuleEnum[]) {
  return applyDecorators(ModuleSetMetadata(module), UseGuards(JwtGuard, PermissionGuard));
}
