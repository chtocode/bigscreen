import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'name', passReqToCallback: true });
  }

  async validate(req: Request, name: string): Promise<any> {
    const user = await this.authService.validateUser(name);

    if (!user) {
      throw new UnauthorizedException('Please check your password or username');
    }

    return user;
  }
}
