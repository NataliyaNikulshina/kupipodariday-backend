import { Controller, Get, Param } from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';

@Controller('offers')
export class OffersController {
  constructor(private offersService: OffersService) {}

  @Get()
  async findAll() {
    return await this.offersService.findMany();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.offersService.findOne(+id);
  }
}
