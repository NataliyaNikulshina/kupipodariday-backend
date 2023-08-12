import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashService {
  async generateHash(password: string): Promise<string> {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(password, salt);
  }

  async isPasswordValid(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
