import { Asset } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class AssetEntity implements Asset {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  symbol: string;

  @ApiProperty()
  type: string;

  // * INFO : Below Code Is For Reference
  // constructor({ author, ...data }: Partial<ArticleEntity>) {
  //   Object.assign(this, data);
  //   if (author) {
  //     this.author = new UserEntity(author);
  //   }
  // }
}
