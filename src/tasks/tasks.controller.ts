import { Controller, Get, Logger, Param, ValidationPipe } from '@nestjs/common';
import { Contestant, TasksService } from './tasks.service';
import { IsEnum, IsNumberString } from 'class-validator';

enum ContestType {
  weekly = 'weekly',
  biweekly = 'biweekly',
}

class Contest {
  @IsEnum(ContestType)
  contest_type: ContestType;

  @IsNumberString()
  contest_number: number;
}
export class ContestParamDto extends Contest {
  @IsNumberString()
  last_page: number;
}

export interface FinishTime {
  hours: 0 | 1;
  minutes: number;
  seconds: number;
}

export class PercentileParamDto extends Contest {
  @IsNumberString()
  desired_percentile: number;
}

@Controller('contest')
export class TasksController {
  private readonly logger = new Logger(TasksController.name);

  constructor(private readonly TasksService: TasksService) {}

  @Get('/:contest_type/:contest_number/:last_page') //How to let typescript know this path?
  async scrapeContest(
    @Param(new ValidationPipe()) params: ContestParamDto,
  ): Promise<Contestant[]> {
    this.logger.log('processing request', JSON.stringify(params));
    return this.TasksService.scrapeContestData({
      url: new URL(
        `https://leetcode.com/contest/api/ranking/${params.contest_type}-contest-${params.contest_number}/`,
      ),
      lastPage: params.last_page,
    });
  }

  @Get('/:contest_type/:contest_number/:desired_percentile/finish-time') //How to let typescript know this path?
  async finishTimeFromPercentile(
    @Param(new ValidationPipe()) params: PercentileParamDto,
  ): Promise<FinishTime> {
    this.logger.log('processing request', JSON.stringify(params));
    return;
  }
}
