import { Controller, Get, Logger, Param, ValidationPipe } from '@nestjs/common';
import { Contestant, TasksService } from './tasks.service';
import { IsEnum, IsNumberString } from 'class-validator';

enum ContestType {
  weekly = 'weekly',
  biweekly = 'biweekly',
}

export class ContestParamDto {
  @IsEnum(ContestType)
  contest_type: ContestType;

  @IsNumberString()
  contest_number: number;

  @IsNumberString()
  last_page: number;
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
}
