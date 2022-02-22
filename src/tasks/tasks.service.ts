import { Injectable, Logger } from '@nestjs/common';
import { DataService } from './data.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  _called = 0;

  constructor(private dataService: DataService) {
    this.onStartUp(
      this.dataService.leetcodeDb.keys,
      this.dataService.mockDb.keys,
    );
  }

  @Cron('* 30 4 * * sun')
  handleWeekly(): void {
    this.scrapeContestData();
  }

  @Cron('* 30 16 * * sat')
  handleBiWeekly(): void {
    if (
      this.dataService.leetcodeDb.lastBiWeeklyKey === undefined ||
      !this.dataExistsInDb(
        this.dataService.leetcodeDb.lastBiWeeklyKey,
        this.dataService.mockDb.keys,
      )
    )
      this.scrapeContestData();
  }

  scrapeContestData(): void {
    this._called += 1;
  }

  dataExistsInDb(key: Date, mockDb: string[]): boolean {
    const ISOFomat = key.toISOString();
    const mockDbKeySet = new Set();

    mockDb.forEach((key) => mockDbKeySet.add(key));

    return mockDbKeySet.has(ISOFomat.substring(0, ISOFomat.indexOf('T')));
  }

  onStartUp(leetcodeDb: string[], mockDb: string[]) {
    const mockDbKeySet = new Set();

    mockDb.forEach((key) => mockDbKeySet.add(key));

    leetcodeDb.forEach((key) => {
      if (!mockDbKeySet.has(key)) {
        this.scrapeContestData();
        console.log(key);
      }
    });
  }
}
