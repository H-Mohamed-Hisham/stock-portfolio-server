import { Module } from '@nestjs/common';

// Prisma
import { PrismaModule } from '@app/prisma/prisma.module';

// Asset
import { AssetService } from '@app/asset/asset.service';

// Transaction
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';

@Module({
  controllers: [TransactionController],
  providers: [TransactionService, AssetService],
  imports: [PrismaModule],
})
export class TransactionModule {}
