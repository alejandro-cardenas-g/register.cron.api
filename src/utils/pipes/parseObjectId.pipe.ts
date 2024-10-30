import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isMongoId } from 'class-validator';
import { Types } from 'mongoose';

@Injectable()
export class ParseObjectIdPipe implements PipeTransform<any> {
  async transform(value: any) {
    const isValidMongoId = isMongoId(value);
    if (!isValidMongoId || typeof value !== 'string')
      throw new BadRequestException('errors.matchFormatError');
    return new Types.ObjectId(value);
  }
}
