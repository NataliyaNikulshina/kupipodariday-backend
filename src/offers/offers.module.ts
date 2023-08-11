import { Module } from '@nestjs/common';
import { OffersService } from './offers.service';
import { Offer } from './entities/offers.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [TypeOrmModule.forFeature([Offer])],
  providers: [OffersService],
})
export class OffersModule {}
