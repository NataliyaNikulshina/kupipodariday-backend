import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wishes.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
    private usersService: UsersService,
  ) {}

  async create(id: number, createWishDto: CreateWishDto): Promise<Wish> {
    const { password, ...rest } = await this.usersService.findUserById(id);
    return await this.wishesRepository.save({ ...createWishDto, owner: rest });
  }

  async removeOne(wishId: number, userId: number) {
    const wish = await this.findById(wishId);
    if (!wish) {
      throw new NotFoundException('Подарок не найден');
    }
    if (userId !== wish.owner.id) {
      throw new ForbiddenException('Это не ваш подарок');
    }
    if (wish.raised !== 0 && wish.offers.length !== 0) {
      throw new ForbiddenException(
        'Подарок уже исполняется и его нельзя изменить',
      );
    }
    await this.wishesRepository.delete(wishId);
    return wish;
  }

  async updateOne(wishId: number, dto: UpdateWishDto, userId: number) {
    const wish = await this.findById(wishId);

    if (userId !== wish.owner.id) {
      throw new ForbiddenException('Это не ваш подарок');
    }
    if (wish.raised !== 0 && wish.offers.length !== 0) {
      throw new ForbiddenException(
        'Подарок уже исполняется и его нельзя изменить',
      );
    }
    if (!wish) {
      throw new NotFoundException('Подарок не найден');
    }
    return await this.wishesRepository.update(wishId, dto);
  }

  async updateRaised(wishId: number, raised: number) {
    return await this.wishesRepository.update(wishId, { raised: raised });
  }

  async findById(id: number) {
    const wish = await this.wishesRepository.findOne({
      where: { id },
      relations: ['owner'],
    });
    if (!wish) {
      throw new NotFoundException('Подарок не найден');
    }
    return wish;
  }

  async getWishListById(ids: number[]): Promise<Wish[]> {
    const wishes = await this.wishesRepository
      .createQueryBuilder('item')
      .where('item.id IN (:...ids)', { ids })
      .getMany();

    if (!wishes) {
      throw new NotFoundException('Подарки не найдены');
    }
    return wishes;
  }

  async findLast(): Promise<Wish[]> {
    const wishes = await this.wishesRepository.find({
      order: { createdAt: 'DESC' },
      take: 40,
    });

    if (!wishes) {
      throw new NotFoundException('Подарки не найдены');
    }

    return wishes;
  }

  async findTop(): Promise<Wish[]> {
    const wishes = await this.wishesRepository.find({
      order: { copied: 'DESC' },
      take: 10,
    });

    if (!wishes) {
      throw new NotFoundException('Подарки не найдены');
    }

    return wishes;
  }

  async findByIdWithOffer(userId: number, id: number) {
    const wish = await this.wishesRepository.findOne({
      where: { id },
      relations: ['owner', 'offers', 'offers.user'],
    });

    if (!wish) {
      throw new NotFoundException('Подарок не найден');
    }

    if (userId === wish.owner.id) {
      return wish;
    } else {
      const filteredOffers = wish.offers.filter((offer) => !offer.hidden);
      wish.offers = filteredOffers;
      return wish;
    }
  }

  findMany(query: FindManyOptions<Wish>) {
    return this.wishesRepository.find(query);
  }
}
