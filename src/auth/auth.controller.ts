import { Controller, Post, Req, Body } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';

interface RequestUser extends Request {
  user: User;
}

@Controller('')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('signin')
  async signin(@Req() req: RequestUser) {
    return this.authService.auth(req.user);
  }

  @Post('signup')
  async signup(@Body() dto: CreateUserDto) {
    const user = await this.usersService.create(dto);
    return this.authService.auth(user);
    // delete user.password;
  }
}
