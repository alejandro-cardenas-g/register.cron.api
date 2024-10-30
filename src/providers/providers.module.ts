import { Module } from '@nestjs/common';
import { SEND_REQUEST_TO_PROVIDER } from './constants';
import { SendRequestToProviderService } from './services';

@Module({
  providers: [
    {
      provide: SEND_REQUEST_TO_PROVIDER,
      useExisting: SendRequestToProviderService,
    },
    SendRequestToProviderService,
  ],
  exports: [
    {
      provide: SEND_REQUEST_TO_PROVIDER,
      useExisting: SendRequestToProviderService,
    },
  ],
})
export class ProvidersModule {}
