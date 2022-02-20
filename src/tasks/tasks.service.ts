import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  _called = 0;

  @Cron('* 30 4 * * sun')
  handleWeekly(): void {
    this.scrapeContestData();
  }

  @Cron('* 30 16 * * sat')
  handleBiWeekly(): void {
    this.scrapeContestData();
  }

  scrapeContestData(): void {
    this._called += 1;
  }
}
