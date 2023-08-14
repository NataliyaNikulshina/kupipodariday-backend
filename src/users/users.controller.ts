import { Controller, Req, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { FindUserDto } from './dto/find-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Wish } from '../wishes/entities/wishes.entity';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  create(@Body() user) {
    return this.usersService.create(user);
  }

  @Get('me')
  findOne(@Req() req): Promise<User> {
    return this.usersService.findUserById(req.user.id);
  }

  @Get('me/wishes')
  async getOwnWishes(@Req() req): Promise<Wish[]> {
    return await this.usersService.getWishes(req.user.id);
  }

  @Get(':username/wishes')
  async getWishesByUsername(@Param('username') username: string) {
    const user = await this.usersService.findByUsername(username);
    return this.usersService.getWishes(user.id);
  }

  @Patch('me')
  update(@Req() req, @Body() dto: UpdateUserDto) {
    return this.usersService.updateOne(req.user.id, dto);
  }

  @Post('find')
  findMany(@Body() dto: FindUserDto) {
    return this.usersService.findMany(dto);
  }
}
