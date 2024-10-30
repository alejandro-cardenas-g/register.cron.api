import { IsString } from 'class-validator';

export class HeaderRequestDto {
  @IsString()
  value: string;

  @IsString()
  name: string;
}
