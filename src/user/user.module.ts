import { Module } from '@nestjs/common';

// Prisma
import { PrismaModule } from '@app/prisma/prisma.module';

// User
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [PrismaModule],
  exports: [UserService],
})
export class UserModule {}
