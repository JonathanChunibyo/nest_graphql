// Libraries
import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
// TODO: The use of the 'bcrypt' library is de-linked due to the error in the current or implemented process for the 'DockerFile'. The implementation ('bcrypt') is commented and provisionally the 'argon2' library is used.
// import * as bcrypt from 'bcrypt';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';

// Interfaces
import { JwtPayload } from '../interfaces/jwt-payload.interfaces';

// Constants - Messages
import * as messageError from '../errors/messageError.authentication.json';

@Injectable()
export class AuthenticationService {
  private readonly logger = new Logger('AuthenticationService')

  constructor(
    private readonly jwtService: JwtService
  ) {
  }

  async comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
    try {
      return await argon2.verify(hashedPassword, password);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(messageError.comparePasswords);
    }
  }

  async hashPassword(password: string): Promise<string> {
    try {
      return await argon2.hash(password);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(messageError.hashPassword);
    }
  }

  getJwtToken(payload: JwtPayload) {
    try {
      const token = this.jwtService.sign(payload);
      return token;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(messageError.getJwtToken);
    }
  }

  verifyToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      return payload;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(messageError.verifyToken);
    }
  }

  mapSubmodulesWithPermissions(submodules: Array<any>) {
    try {
      return submodules.map(subModule => {
        return subModule.permission.length > 0 ? { ...subModule, permission: subModule.permission[0] } : null;
      }).filter(Boolean);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(messageError.mapSubmodulesWithPermissions);
    }
  };

  filteredPermissions(modules: Array<any>) {
    try {
      const permissions = modules.map(value => {
        if (value.permission.length > 0) return { ...value, permission: value.permission[0] };
        const moduleWithPermissions = this.mapSubmodulesWithPermissions(value.module);
        if (moduleWithPermissions.length > 0) return { ...value, module: moduleWithPermissions, permission: null };
        return null;
      }).filter(Boolean);
      return permissions;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(messageError.filteredPermissions);
    }
  }
}
