import { Controller, Get, Param, Post, Body, Req } from '@nestjs/common';
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

  @Post()
  async create(@Req() req, @Body() dto: CreateOfferDto) {
    return await this.offersService.create(req.user, dto);
  }
}
