import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashingService {
  async encrypt(password: string) {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);
    return hash;
  }

  async compare(password: string, hash: string) {
    const isMatch = await bcrypt.compare(password, hash);
    return isMatch;
  }
}
