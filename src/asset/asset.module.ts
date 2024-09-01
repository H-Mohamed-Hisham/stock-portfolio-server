import { Module } from '@nestjs/common';

// Prisma
import { PrismaModule } from '@app/prisma/prisma.module';

// Asset
import { AssetService } from './asset.service';
import { AssetController } from './asset.controller';

@Module({
  controllers: [AssetController],
  providers: [AssetService],
  imports: [PrismaModule],
  exports: [AssetService],
})
export class AssetModule {}
