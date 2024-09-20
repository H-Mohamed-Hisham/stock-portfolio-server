import { Module } from '@nestjs/common';

// Prisma
import { PrismaModule } from '@app/prisma/prisma.module';

// Asset
import { AssetService } from './asset.service';
import { AssetController } from './asset.controller';

// Transaction
import { TransactionService } from 'src/transaction/transaction.service';
@Module({
  controllers: [AssetController],
  providers: [AssetService, TransactionService],
  imports: [PrismaModule],
  exports: [AssetService],
})
export class AssetModule {}
