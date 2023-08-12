import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WishesService } from '../wishes/wishes.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlists.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistsRepository: Repository<Wishlist>,
    private readonly wishesService: WishesService,
  ) {}

  async create(owner: User, dto: CreateWishlistDto) {
    delete owner.password;
    delete owner.email;
    const wishes = await this.wishesService.findMany({});
    const items = dto.itemsId.map((item) => {
      return wishes.find((wish) => wish.id === item);
    });
    const wishList = this.wishlistsRepository.create({
      ...dto,
      owner: owner,
      items: items,
    });
    return this.wishlistsRepository.save(wishList);
  }

  async findById(id: number) {
    const wishlist = await this.wishlistsRepository.findOne({
      where: { id },
      relations: ['owner', 'items'],
    });
    delete wishlist.owner.password;
    delete wishlist.owner.email;
    return wishlist;
  }

  async updateOne(user: User, wishlistId: number, dto: UpdateWishlistDto) {
    const wishlist = await this.findById(wishlistId);
    if (!wishlist) {
      throw new NotFoundException('Коллекция не найдена');
    }
    if (user.id !== wishlist.owner.id) {
      throw new ForbiddenException('Это не ваша коллекция');
    }
    await this.wishlistsRepository.update(wishlistId, dto);
    const updatedWishList = await this.wishlistsRepository.findOne({
      where: { id: wishlistId },
      relations: {
        owner: true,
        items: true,
      },
    });
    delete updatedWishList.owner.password;
    delete updatedWishList.owner.email;
    return updatedWishList;
  }

  async removeOne(wishlistId: number, userId: number) {
    const wishlist = await this.wishlistsRepository.findOne({
      where: { id: wishlistId },
      relations: {
        owner: true,
        items: true,
      },
    });
    if (!wishlist) {
      throw new NotFoundException('Список не найден');
    }

    if (userId !== wishlist.owner.id) {
      throw new ForbiddenException('Это не ваш список');
    }
    await this.wishlistsRepository.delete(wishlistId);
    return wishlist;
  }

  async findMany() {
    const wishlists = await this.wishlistsRepository.find({
      relations: {
        owner: true,
        items: true,
      },
    });
    return wishlists.map((wishlist) => {
      delete wishlist.owner.password;
      delete wishlist.owner.email;
      return wishlist;
    });
  }
}
