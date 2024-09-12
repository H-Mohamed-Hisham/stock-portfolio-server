import { ApiProperty } from '@nestjs/swagger';

export class AuthUserEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;
}
export class AuthEntity {
  @ApiProperty()
  access_token: string;

  @ApiProperty({ type: AuthUserEntity })
  user: AuthUserEntity;
}
