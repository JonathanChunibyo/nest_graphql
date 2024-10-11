// Utilities
import { applyDecorators, UseGuards } from "@nestjs/common";

// Enum
import { ModuleEnum } from "../enums/modules.enums";

// Guard
import { JwtGuard } from "../guards/jwt.guard";

// Guard
import { PermissionGuard } from "../guards/permission.guard";

// Decorator
import { ModuleSetMetadata } from './modules.decorators';

export function Auth(module: ModuleEnum[]) {
  return applyDecorators(ModuleSetMetadata(module), UseGuards(JwtGuard, PermissionGuard));
}
