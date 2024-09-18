import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TransactionListDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  transaction_type: string;
}

export class AssetTransactionListDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  asset_id: string;
}
