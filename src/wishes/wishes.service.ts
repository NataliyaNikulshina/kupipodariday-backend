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
import { User } from '../users/entities/user.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
  ) {}

  async create(owner: User, createWishDto: CreateWishDto): Promise<Wish> {
    delete owner.password;
    delete owner.email;
    const wish = this.wishesRepository.create({
      ...createWishDto,
      owner: owner,
    });
    return this.wishesRepository.save(wish);
  }

  async findOne(id: number) {
    const wish = await this.wishesRepository.findOne({
      where: { id },
      relations: [
        'owner',
        'offers',
        'offers.user',
        'offers.user.wishes',
        'offers.user.offers',
        'offers.user.wishlists',
      ],
    });
    if (!wish) {
      throw new NotFoundException('Подарок не найден');
    }
    return wish;
  }

  async removeOne(wishId: number, userId: number) {
    const wish = await this.findOne(wishId);
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
    const wish = await this.findOne(wishId);

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

  findMany(query: FindManyOptions<Wish>) {
    return this.wishesRepository.find(query);
  }

  async findById(id: number) {
    const wish = await this.wishesRepository.findOne({
      where: { id },
      relations: ['owner'],
    });
    if (!wish) {
      throw new NotFoundException('Подарок не найдено');
    }
    return wish;
  }
}
