import { Injectable } from '@nestjs/common';

@Injectable()
export class DataService {
  mockDb = {
    keys: undefined,
  };
  leetcodeDb = {
    keys: undefined,
    lastBiWeeklyKey: undefined,
  };
}
