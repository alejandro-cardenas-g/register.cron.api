import { Injectable } from '@nestjs/common';
import { Interval, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { CronTask } from '../entities';
import { CronTasksService } from './cron-tasks.service';
import { ECronTaskStatus } from '../enums';
import { ModuleRef } from '@nestjs/core';
import { IProvider } from '../../providers/interfaces';

@Injectable()
export class CronSchedulesService {
  constructor(
    private readonly cronTasksService: CronTasksService,
    private schedulerRegistry: SchedulerRegistry,
    private moduleRef: ModuleRef,
  ) {}

  async createCronJob(
    job: CronTask,
  ): Promise<{ cronJob: CronJob; success: true } | { success: false }> {
    try {
      const provider = this.moduleRef.get<IProvider<any>>(job.provider, {
        strict: false,
      });
      const isValid = await provider.validateConfig(job.config);
      if (!isValid) return { success: false };
      const cronJob = new CronJob(job.cron, () => {
        provider.execute(job.config);
      });
      return { success: true, cronJob };
    } catch (e) {
      return { success: false };
    }
  }

  @Interval(10000)
  async pollNewJobs() {
    const jobs = await this.cronTasksService.getAllCrons();
    for (const job of jobs) {
      switch (job.status) {
        case ECronTaskStatus.inactive:
          this.inactivate(job);
          break;
        case ECronTaskStatus.running:
          this.activate(job);
          break;
        case ECronTaskStatus.stopped:
          this.stop(job);
          break;
        case ECronTaskStatus.updateNeeded:
          this.neededUpdate(job);
          break;
      }
    }
  }

  async inactivate(job: CronTask) {
    const existsJob = this.schedulerRegistry.doesExist(
      'cron',
      job._id.toString(),
    );
    if (existsJob) {
      this.schedulerRegistry.deleteCronJob(job._id.toString());
    }
  }

  async activate(job: CronTask) {
    const existsJob = this.schedulerRegistry.doesExist(
      'cron',
      job._id.toString(),
    );
    if (!existsJob) {
      const result = await this.createCronJob(job);
      if (!result.success) return;
      this.schedulerRegistry.addCronJob(job._id.toString(), result.cronJob);
      result.cronJob.start();
    }
  }

  async neededUpdate(job: CronTask) {
    const existsJob = this.schedulerRegistry.doesExist(
      'cron',
      job._id.toString(),
    );
    if (existsJob) {
      this.schedulerRegistry.deleteCronJob(job._id.toString());
    }
    this.activate(job);
  }

  async stop(job: CronTask) {
    const existsJob = this.schedulerRegistry.doesExist(
      'cron',
      job._id.toString(),
    );
    if (existsJob) {
      this.schedulerRegistry.deleteCronJob(job._id.toString());
    }
  }
}
