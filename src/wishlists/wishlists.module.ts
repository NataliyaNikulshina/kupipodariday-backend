import { Module } from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlists.entity';
import { WishesModule } from 'src/wishes/wishes.module';
import { WishlistsController } from './wishlists.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Wishlist]), WishesModule],
  providers: [WishlistsService],
  controllers: [WishlistsController],
  exports: [WishlistsService],
})
export class WishlistsModule {}
