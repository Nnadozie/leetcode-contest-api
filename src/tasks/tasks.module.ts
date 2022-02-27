import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { DataService } from './data.service';
import { TasksService } from './tasks.service';

@Module({
  imports: [HttpModule],
  providers: [TasksService, DataService],
})
export class TasksModule {}
