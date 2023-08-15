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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wishes.entity';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { PasswordWishInterceptor } from 'src/interceptors/password-wish.interceptor';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Get('last')
  async getLastWish(): Promise<Wish[]> {
    return await this.wishesService.findLast();
  }

  @Get('top')
  async getTopWish(): Promise<Wish[]> {
    return await this.wishesService.findTop();
  }

  @UseGuards(JwtGuard)
  @UseInterceptors(PasswordWishInterceptor)
  @Get(':id')
  async getWishById(
    @Req() { user: { id } },
    @Param('id') wishId: number,
  ): Promise<Wish> {
    return await this.wishesService.findByIdWithOffer(id, wishId);
  }

  @UseGuards(JwtGuard)
  @Post()
  async create(
    @Req() { user: { id } },
    @Body() dto: CreateWishDto,
  ): Promise<Wish> {
    return await this.wishesService.create(id, dto);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async updateOne(
    @Req() req,
    @Param('id') id: string,
    @Body() updatedWish: UpdateWishDto,
  ) {
    return await this.wishesService.updateOne(+id, updatedWish, req.user.id);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async removeOne(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.wishesService.removeOne(id, req.user.id);
  }
}
