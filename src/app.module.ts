import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { WishesModule } from './wishes/wishes.module';
import { WishlistsModule } from './wishlists/wishlists.module';
import { OffersModule } from './offers/offers.module';
import { ConfigModule } from '@nestjs/config';
import { User } from './users/entities/user.entity';
import { Wish } from './wishes/entities/wishes.entity';
import { Wishlist } from './wishlists/entities/wishlists.entity';
import { Offer } from './offers/entities/offers.entity';
import configuration from './configuration';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [configuration] }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: configuration().host,
      port: Number(configuration().port),
      username: configuration().username,
      password: configuration().password,
      database: configuration().database,
      entities: [User, Wish, Offer, Wishlist],
      synchronize: configuration().synchronize,
    }),
    UsersModule,
    WishesModule,
    WishlistsModule,
    OffersModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
