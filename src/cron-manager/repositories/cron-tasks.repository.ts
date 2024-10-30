import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CronTask } from '../entities';
import { AbstractRepository } from 'src/utils/abstract.repository';
import { ECronTaskStatus } from '../enums';

@Injectable()
export class CronTasksRepository extends AbstractRepository<CronTask> {
  constructor(
    @InjectModel(CronTask.name)
    model: Model<CronTask>,
  ) {
    super(model);
  }

  getAllCrons() {
    return this.find({});
  }

  updateStatusByIds(ids: string[], status: ECronTaskStatus) {
    return this.updateMany({ _id: { $in: ids } }, { $set: { status } });
  }

  updateStatusById(id: Types.ObjectId, status: ECronTaskStatus) {
    return this.updateOne({ _id: id }, { $set: { status } });
  }
}
