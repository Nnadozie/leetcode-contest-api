import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  _called = 0;

  @Cron('* 30 4 * * sun')
  scrapeContestData(): void {
    this._called += 1;
  }
}
