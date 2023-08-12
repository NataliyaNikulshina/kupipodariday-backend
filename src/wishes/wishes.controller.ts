import {
  Controller,
  Body,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Delete,
  Post,
  Req,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';

@Controller('wishes')
export class WishesController {
  constructor(private wishesService: WishesService) {}

  @Get(':id')
  async getWishById(@Param('id') id: string) {
    return await this.wishesService.findOne(+id);
  }

  @Post()
  async create(@Req() req, @Body() dto: CreateWishDto) {
    return await this.wishesService.create(req.user, dto);
  }

  @Patch(':id')
  async updateOne(
    @Req() req,
    @Param('id') id: string,
    @Body() updatedWish: UpdateWishDto,
  ) {
    return await this.wishesService.updateOne(+id, updatedWish, req.user.id);
  }

  @Delete(':id')
  async removeOne(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.wishesService.removeOne(id, req.user.id);
  }
}
