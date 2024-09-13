import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AssetStatDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  asset_id: string;
}

export class OverallStatDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  asset_type: string;
}
