import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './entities/offers.entity';
import { User } from 'src/users/entities/user.entity';
import { WishesService } from 'src/wishes/wishes.service';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offersRepository: Repository<Offer>,
    private wishesService: WishesService,
    private readonly dataSource: DataSource,
  ) {}

  async findOne(id: number) {
    const offer = await this.offersRepository.find({
      where: { id },
      relations: ['item', 'user'],
    });
    if (offer.length === 0) {
      throw new NotFoundException('Предложений не найдено');
    }
    return offer;
  }

  async findMany() {
    const offers = await this.offersRepository.find({
      relations: ['item', 'user'],
    });
    if (offers.length === 0) {
      throw new NotFoundException('Предложений не найдено');
    }
    return offers;
  }
}
