import { Transaction, Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/library';
import { Transform } from 'class-transformer';

// Asset
import { AssetEntity } from 'src/asset/entities/asset.entity';

export class TransactionEntity implements Transaction {
  constructor({ ...data }: Partial<TransactionEntity>) {
    Object.assign(this, data);
  }

  @ApiProperty()
  id: string;

  @ApiProperty()
  user_id: string;

  @ApiProperty()
  date: Date;

  @ApiProperty()
  asset_id: string;

  @ApiProperty()
  transaction_type: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  asset: AssetEntity;

  @ApiProperty()
  @Transform(({ value }: { value: Decimal }) =>
    new Prisma.Decimal(value).toNumber(),
  )
  price: Decimal;

  @ApiProperty()
  @Transform(({ value }: { value: Decimal }) =>
    new Prisma.Decimal(value).toNumber(),
  )
  tax: Decimal;

  @ApiProperty()
  @Transform(({ value }: { value: Decimal }) =>
    new Prisma.Decimal(value).toNumber(),
  )
  total: Decimal;
}
