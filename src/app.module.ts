import { Module } from '@nestjs/common';

// App
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Prisma
import { PrismaModule } from './prisma/prisma.module';

// User
import { UserModule } from './user/user.module';

// Asset
import { AssetModule } from './asset/asset.module';

// Auth
import { AuthModule } from './auth/auth.module';

// Transaction
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    AuthModule,
    AssetModule,
    TransactionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
