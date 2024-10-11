// Libraries
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

// Interfaces
import { JwtPayload } from "../interfaces/jwt-payload.interfaces";

// Constants - Messages
import messageGlobal from "../errors/messageGlobal.errors.json";

// Services
import { EntityService } from "../../models/service/entity/entity.service";
import { EnvironmentService } from '../services/environment.service';

// Entities
import {User} from '../../models/user/entities/user.entity'

// DTO
import {CreateUserInput} from '../../models/user/dto/create-user.input';
import {UpdateUserInput} from '../../models/user/dto/update-user.input';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    private readonly userService: EntityService<User, CreateUserInput, UpdateUserInput>;
    private readonly logger = new Logger('JwtStrategy');

    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>
    ) {
        const configService = new EnvironmentService()
        super({
            secretOrKey: configService.get('SECRET_KEY'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        });
        this.userService = new EntityService<User, CreateUserInput, UpdateUserInput>(this.userRepository, 'User');
    }

    async validate(payload: JwtPayload) {
        const { id = '' } = payload;
        const queryUser = this.userService.find();
        const user = await queryUser.select(['User.id', 'User.isState'])
            .where('User.id = :id', { id })
            .getOne();
        if (!user) return new BadRequestException(messageGlobal.userDoesNotExist);
        if (!user?.isState) return new BadRequestException(messageGlobal.userNotAuthorized);
        return user;
    }

}