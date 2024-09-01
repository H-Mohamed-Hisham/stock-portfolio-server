import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ListTransactionDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  transaction_type: string;
}
