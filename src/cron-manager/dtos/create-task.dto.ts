import { IsEnum, IsObject, IsString } from 'class-validator';
import { ECronTaskStatus } from '../enums';
import { IsValidCronValidator } from '../decorators';

export class CreateTaskDto {
  @IsValidCronValidator()
  @IsString()
  cron: string;

  @IsString()
  name: string;

  @IsString()
  provider: string;

  @IsEnum(ECronTaskStatus)
  status: ECronTaskStatus;

  @IsObject()
  config: Record<string, unknown> = {};
}
