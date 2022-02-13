import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  _called = 0;

  @Cron('* * * * * *')
  scrapeContestData(): void {
    this.logger.debug('Called every second');
    this._called += 1;
  }
}
