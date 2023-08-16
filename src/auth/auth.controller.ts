import { Controller, Post, Req, Body, UseGuards } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { LocalGuard } from './guards/local.guard';

interface RequestUser extends Request {
  user: User;
}

@Controller()
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @UseGuards(LocalGuard)
  @Post('signin')
  async signin(@Req() req: RequestUser) {
    return this.authService.auth(req.user);
  }

  @Post('signup')
  async signup(@Body() dto: CreateUserDto) {
    return await this.usersService.create(dto);
    // delete user.password;
  }
}
