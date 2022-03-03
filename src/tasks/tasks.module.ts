import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { DataService } from './data.service';
import { TasksService } from './tasks.service';

@Module({
  controllers: [TasksController],
  imports: [HttpModule],
  providers: [TasksService, DataService],
})
export class TasksModule {}
