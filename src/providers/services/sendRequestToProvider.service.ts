import { Injectable } from '@nestjs/common';
import { IProvider } from '../interfaces';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { SendRequestToProviderDto } from '../dto/sendRequestToProvider';

@Injectable()
export class SendRequestToProviderService
  implements IProvider<SendRequestToProviderDto>
{
  constructor() {}

  async execute(payload: SendRequestToProviderDto): Promise<void> {
    const isValid = await this.validateConfig(payload);
    if (!isValid) return;
    const result = await fetch(payload.url);
    console.log(result);
  }

  async validateConfig(payload: SendRequestToProviderDto) {
    const errors = await validate(
      plainToInstance(SendRequestToProviderDto, payload),
      {},
    );
    return !errors.length;
  }
}
