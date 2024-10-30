import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { AbstractDocument } from 'src/utils/abstract.entity';
import { ECronTaskStatus } from '../enums';

export type CronTaskDocument = HydratedDocument<CronTask>;

export class ConfigRaw {
  @Prop({ type: String, required: true })
  name: string;

  static PropsDefinition = {
    name: { type: String },
  };
}

@Schema({
  collection: 'cronTasks',
})
export class CronTask extends AbstractDocument {
  @Prop()
  name: string;

  @Prop()
  cron: string;

  @Prop()
  provider: string;

  @Prop({ type: Map, of: Object })
  config: Record<string, unknown>;

  @Prop()
  status: ECronTaskStatus;
}

export const CronTaskSchema = SchemaFactory.createForClass(CronTask);

export const CronTaskDefinition = {
  name: CronTask.name,
  schema: CronTaskSchema,
} as ModelDefinition;
