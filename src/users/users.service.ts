import { Injectable, ForbiddenException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// import { WishesService } from '../wishes/wishes.service';
import { CreateUserDto } from './dto/create-user.dto';
import { HashService } from '../hash/hash.service';
import { FindUserDto } from './dto/find-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Wish } from '../wishes/entities/wishes.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    // private wishesService: WishesService,
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
    private hashService: HashService,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const { username, email, password } = dto;
    if ((await this.findByUsername(username)) !== null) {
      throw new ForbiddenException(
        'Пользователь с таким именем уже зарегистрирован',
      );
    }
    if ((await this.findByEmail(email)) !== null) {
      throw new ForbiddenException(
        'Пользователь с такой почтой уже зарегистрирован',
      );
    }
    const user = this.userRepository.create(dto);
    user.password = await this.hashService.generateHash(password);
    return await this.userRepository.save(user);
  }

  async findUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new ForbiddenException('Пользователь не найден');
    }
    return user;
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ username });
    if (!user) {
      throw new ForbiddenException('Пользователь не найден');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new ForbiddenException('Пользователь не найден');
    }
    return user;
  }

  async findMany({ query }: FindUserDto): Promise<User[]> {
    return this.userRepository.find({
      where: [{ email: query }, { username: query }],
    });
  }

  async updateOne(id: number, dto: UpdateUserDto) {
    const { username, email, password } = dto;
    if (username) {
      const checkUserByName = await this.findByUsername(username);
      if (checkUserByName !== null && checkUserByName.id !== id) {
        throw new ForbiddenException(
          'Пользователь с таким именем уже зарегистрирован',
        );
      }
    }
    if (email) {
      const checkUserByEmail = await this.findByEmail(email);
      if (checkUserByEmail !== null && checkUserByEmail.id !== id) {
        throw new ForbiddenException(
          'Пользователь с такой почтой уже зарегистрирован',
        );
      }
    }
    if (password) {
      dto.password = await this.hashService.generateHash(password);
    }
    await this.userRepository.update({ id }, dto);
    const updatedOne = await this.findUserById(id);
    delete updatedOne.password;
    return updatedOne;
  }

  async removeOne(id: number) {
    return await this.userRepository.delete({ id });
  }

  async getWishes(id: number) {
    return await this.wishRepository.find({
      where: { owner: { id } },
      relations: ['owner'],
    });
  }
}
