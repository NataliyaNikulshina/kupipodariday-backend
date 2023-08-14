import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HashService } from '../hash/hash.service';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { SigninUserDto } from './dto/signin-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private hashService: HashService,
  ) {}

  async auth(user: User): Promise<SigninUserDto> {
    const payload = { sub: user.id };
    return { access_token: this.jwtService.sign(payload) };
  }

  async validatePassword(username: string, password: string) {
    const user = await this.usersService.findByUsername(username);
    if (user) {
      if (await this.hashService.isPasswordValid(password, user.password)) {
        const { password, ...result } = user;
        return result;
      } else {
        throw new UnauthorizedException('Неверное имя пользователя или пароль');
      }
    }
    return null;
  }
}
