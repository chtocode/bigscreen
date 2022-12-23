import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { DataSource } from 'typeorm';
import { IS_PUBLIC_KEY } from './allow-anon';
import { TokenBlacklistEntity } from './token-blacklist.entity';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector, private dataSource: DataSource) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    try {
      const req = context.switchToHttp().getRequest<Request>();
      const isInBlacklist = await this.dataSource
        .getRepository(TokenBlacklistEntity)
        .findOne({
          where: { token: req.headers.authorization.split('Bearer ')[1] },
        });

      if (isInBlacklist) {
        return false;
      }
    } catch (error) {
      return false;
    }

    return super.canActivate(context) as Promise<boolean>;
  }

  handleRequest(err, user) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
