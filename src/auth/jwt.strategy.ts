import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

// User
import { UserStorage } from '@app/user/user.storage';

// User
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: { user_id: string }) {
    const user = await this.userService.findOne(payload.user_id);
    if (!user) {
      throw new UnauthorizedException();
    }
    UserStorage.set(user);
    return user;
  }
}
