import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MinLength,
  // MaxLength,
  // IsOptional,
} from 'class-validator';

export class CreateAssetDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @ApiProperty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @ApiProperty({ required: false })
  symbol: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @ApiProperty()
  type: string;
}
