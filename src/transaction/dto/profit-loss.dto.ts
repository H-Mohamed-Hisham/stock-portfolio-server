import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AssetProfitLossDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  asset_id: string;
}

export class OverallProfitLossDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  asset_type: string;
}
