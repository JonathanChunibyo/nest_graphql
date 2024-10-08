// Libraries
import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { In } from 'typeorm';

// Constants
import * as message from '../errors/messageGlobal.errors.json';

@Injectable()
export class PermissionGuard implements CanActivate {

  private readonly logger = new Logger('PermissionGuard');

  constructor(
    private reflector: Reflector
  ) {
  }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    try {
      console.log("ingreso 2")
      const requiredPermission = this.reflector.get<Array<string>>('module', context.getHandler());
      if (!requiredPermission.length) return true;
      const request = context.switchToHttp().getRequest();
      const user = request.userToken;
      if (!user) throw message.userNotAuthorized;
      return true;
    } catch (error) {
      this.logger.error(error);
      throw new UnauthorizedException(error);
    }
  }
}
