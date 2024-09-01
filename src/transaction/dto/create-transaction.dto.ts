import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsInt,
  Min,
  IsNumber,
  IsDateString,
  // IsOptional,
} from 'class-validator';

export class CreateTransactionDto {
  // @IsString()
  // @IsUUID()
  // @IsNotEmpty()
  // @ApiProperty()
  // user_id: string;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty()
  date: Date;

  @IsString()
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty()
  asset_id: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  transaction_type: string;

  @IsInt()
  @Min(1)
  @ApiProperty()
  quantity: number;

  @Min(0.01)
  @IsNumber({ maxDecimalPlaces: 2 })
  @ApiProperty()
  price: number;

  @Min(0.01)
  @IsNumber({ maxDecimalPlaces: 2 })
  @ApiProperty()
  tax: number;

  // @IsOptional()
  // @ApiProperty({ required: false })
  // total?: number;
}
