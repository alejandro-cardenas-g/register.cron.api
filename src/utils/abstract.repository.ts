import { NotFoundException } from '@nestjs/common';
import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
import { AbstractDocument } from './abstract.entity';

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
  constructor(public readonly model: Model<TDocument>) {}

  async create(document: Partial<TDocument>): Promise<TDocument> {
    const createdDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });
    return (await createdDocument.save()).toJSON() as unknown as TDocument;
  }

  async findOne(
    ...args: Parameters<typeof this.model.findOne>
  ): Promise<TDocument | null> {
    const document = await this.model
      .findOne(...args)
      .lean<TDocument | null>(true);
    return document;
  }

  async findOneAndUpdate(
    filterQuery: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
  ): Promise<TDocument> {
    const document = await this.model
      .findOneAndUpdate(filterQuery, update, {
        new: true,
      })
      .lean<TDocument>(true);

    if (!document) {
      throw new NotFoundException('Document was not found');
    }

    return document;
  }

  async find(filterQuery: FilterQuery<TDocument>): Promise<TDocument[]> {
    return this.model.find(filterQuery).lean<TDocument[]>(true);
  }

  async findOneAndDelete(
    filterQuery: FilterQuery<TDocument>,
  ): Promise<TDocument> {
    return this.model.findOneAndDelete(filterQuery).lean<TDocument>(true);
  }

  findOneById(id: Types.ObjectId) {
    return this.model.findById(id).lean<TDocument>(true);
  }

  findByIds(ids: TDocument[] | Types.ObjectId[]) {
    return this.model.find({ _id: { $in: ids } }).lean<TDocument[]>(true);
  }

  updateOne(...args: Parameters<typeof this.model.updateOne>) {
    return this.model.updateOne(...args);
  }

  updateMany(...args: Parameters<typeof this.model.updateMany>) {
    return this.model.updateMany(...args);
  }

  deleteOne(...args: Parameters<typeof this.model.deleteOne>) {
    return this.model.deleteOne(...args);
  }

  deleteMany(...args: Parameters<typeof this.model.deleteMany>) {
    return this.model.deleteMany(...args);
  }

  insertMany(...args: Parameters<typeof this.model.deleteMany>) {
    return this.model.insertMany(...args);
  }

  aggregate<T = TDocument>(...args: Parameters<typeof this.model.aggregate>) {
    return this.model.aggregate<T>(...args);
  }
}
