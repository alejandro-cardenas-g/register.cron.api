import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CronTaskDefinition } from './entities';
import { CronTasksRepository } from './repositories/cron-tasks.repository';
import { CronTasksService, CronSchedulesService } from './services';
import { CronTaskController } from './controllers';
import { ProvidersModule } from 'src/providers/providers.module';

@Module({
  imports: [MongooseModule.forFeature([CronTaskDefinition]), ProvidersModule],
  providers: [CronTasksRepository, CronTasksService, CronSchedulesService],
  controllers: [CronTaskController],
})
export class CronManagerModule {}
