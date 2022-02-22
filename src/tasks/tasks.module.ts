import { Module } from '@nestjs/common';
import { DataService } from './data.service';
import { TasksService } from './tasks.service';

@Module({
  providers: [TasksService, DataService],
})
export class TasksModule {}
