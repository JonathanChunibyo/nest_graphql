// Libraries
import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';

// Services
import { JwtStrategy } from '../strategies/jwt.strategy';
import { AuthenticationService } from '../services/authentication.service';

// Constants
import * as message from '../errors/messageGlobal.errors.json';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class JwtGuard implements CanActivate {

  private readonly logger = new Logger('JwtGuard');

  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly jwtStrategy: JwtStrategy,
  ) { }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    try {
      const ctx = GqlExecutionContext.create(context);
      const request = ctx.getContext().req;
      const authHeader = request.headers['authorization']
      const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
      if (!token) throw new UnauthorizedException(message.noSessionToken);
      const payload = this.authenticationService.verifyToken(token);
      const user = await this.jwtStrategy.validate(payload);
      request.userToken = user;
      return !!user;
    } catch (error) {
      this.logger.error(error);
      throw new UnauthorizedException(error);
    }
  }
}
