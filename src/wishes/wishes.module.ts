import { Module } from '@nestjs/common';
import { WishesService } from './wishes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wish } from './entities/wishes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Wish])],
  providers: [WishesService],
})
export class WishesModule {}
