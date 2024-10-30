import { Type } from 'class-transformer';
import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { HeaderRequestDto } from './headerRequest.dto';

export class SendRequestToProviderDto {
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => HeaderRequestDto)
  headers: HeaderRequestDto[] = [];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => HeaderRequestDto)
  queryParams: HeaderRequestDto[] = [];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => HeaderRequestDto)
  body: HeaderRequestDto[] = [];

  @IsString()
  @IsNotEmpty()
  url: string;

  @IsIn(['POST', 'GET', 'PUT', 'DELETE', 'PATCH'])
  method: string = 'GET';
}
