import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { CronTasksService } from '../services';
import { ECronTaskStatus } from '../enums';
import { Types } from 'mongoose';
import { ParseObjectIdPipe } from 'src/utils/pipes';
import { CreateTaskDto } from '../dtos/create-task.dto';

@Controller('cron-tasks')
export class CronTaskController {
  constructor(private readonly cronTasksService: CronTasksService) {}

  @Post('')
  createTasks(@Body() createTaskDto: CreateTaskDto) {
    return this.cronTasksService.createCronTask(createTaskDto);
  }

  @Put('inactivate/:id')
  inactivateTask(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.cronTasksService.updateStatusTasksById(
      id,
      ECronTaskStatus.inactive,
    );
  }

  @Put('activate/:id')
  activateTask(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.cronTasksService.updateStatusTasksById(
      id,
      ECronTaskStatus.running,
    );
  }

  @Put('stop/:id')
  stopTask(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.cronTasksService.updateStatusTasksById(
      id,
      ECronTaskStatus.stopped,
    );
  }

  @Put('update/:id')
  updateTask(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.cronTasksService.updateStatusTasksById(
      id,
      ECronTaskStatus.updateNeeded,
    );
  }
}
