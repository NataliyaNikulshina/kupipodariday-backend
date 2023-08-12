import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { WishlistsService } from './wishlists.service';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@Controller('wishlists')
export class WishlistsController {
  constructor(private wishlistsService: WishlistsService) {}

  @Get()
  async getAllWishlists() {
    return await this.wishlistsService.findMany();
  }

  @Get(':id')
  async getWishlistById(@Param('id') id: string) {
    return await this.wishlistsService.findById(+id);
  }

  @Post()
  async create(@Body() dto: CreateWishlistDto, @Req() req) {
    return this.wishlistsService.create(req.user, dto);
  }

  @Patch(':id')
  async updateOne(
    @Body() dto: UpdateWishlistDto,
    @Param('id') id: string,
    @Req() req,
  ) {
    return this.wishlistsService.updateOne(req.user, +id, dto);
  }

  @Delete(':id')
  async remove(@Req() req, @Param('id') id: string) {
    return this.wishlistsService.removeOne(+id, req.user.id);
  }
}
