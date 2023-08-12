import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wish } from '../wishes/entities/wishes.entity';
import { HashModule } from '../hash/hash.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Wish]), HashModule],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
