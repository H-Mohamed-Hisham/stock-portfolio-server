import { ApiProperty } from '@nestjs/swagger';

export class StatEntity {
  constructor({ ...data }: Partial<StatEntity>) {
    Object.assign(this, data);
  }

  @ApiProperty({ required: false, nullable: true })
  name?: string | null;

  @ApiProperty({ required: false, nullable: true })
  symbol?: string | null;

  @ApiProperty()
  invested: Number;

  @ApiProperty()
  returns: Number;

  @ApiProperty()
  quantity_bought: Number;

  @ApiProperty()
  quantity_sold: Number;

  @ApiProperty()
  quantity_holding: Number;

  @ApiProperty()
  profit_loss_amount: Number;

  @ApiProperty()
  profit_loss_status: string;
}
