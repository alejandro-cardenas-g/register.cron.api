import { Injectable } from '@nestjs/common';
import { CronTasksRepository } from '../repositories';
import { CronTask } from '../entities';
import { ECronTaskStatus } from '../enums';
import { groupBy } from 'lodash';
import { isEnum, isMongoId } from 'class-validator';
import { Types } from 'mongoose';
import { CreateTaskDto } from '../dtos/create-task.dto';

@Injectable()
export class CronTasksService {
  private cacheTasks: CronTask[] = [];
  private invalidate: boolean = true;
  constructor(private readonly cronTasksRepository: CronTasksRepository) {}

  invalidateCache() {
    this.invalidate = true;
  }

  async getAllCrons() {
    if (this.invalidate) {
      this.invalidate = false;
      const tasks = await this.cronTasksRepository.getAllCrons();
      this.cacheTasks = tasks;
    }
    return this.cacheTasks;
  }

  async updateTasks(
    tasksToUpdate: Record<string, { id: string; status: ECronTaskStatus }>,
  ) {
    const dictionaryTasks = groupBy(Object.values(tasksToUpdate), 'status');
    const promises: Promise<any>[] = [];
    for (const status in dictionaryTasks) {
      if (!isEnum(status, ECronTaskStatus)) continue;
      const tasksToUpdate = dictionaryTasks[status].filter((task) =>
        isMongoId(task.id),
      );
      promises.push(
        this.cronTasksRepository.updateStatusByIds(
          tasksToUpdate.map((task) => task.id),
          <ECronTaskStatus>status,
        ),
      );
    }
    if (promises.length) {
      this.invalidate = true;
      await Promise.all(promises);
    }
  }

  async createCronTask(createTaskDto: CreateTaskDto) {
    const cronTask = await this.cronTasksRepository.create({
      config: createTaskDto.config,
      cron: createTaskDto.cron,
      name: createTaskDto.name,
      provider: createTaskDto.provider,
      status: createTaskDto.status,
    });
    this.invalidateCache();
    return { created: Boolean(cronTask._id) };
  }

  async updateStatusTasksById(id: Types.ObjectId, status: ECronTaskStatus) {
    const updated = await this.cronTasksRepository.updateStatusById(id, status);
    if (updated.acknowledged && updated.modifiedCount) {
      this.invalidateCache();
    }
    return {
      updated: updated.acknowledged,
    };
  }
}
