import { Injectable } from '@nestjs/common';

@Injectable()
export class DataService {
  mockDb = {
    keys: [],
  };
  leetcodeDb = {
    keys: [],
    lastBiWeeklyKey: new Date(),
  };
}
