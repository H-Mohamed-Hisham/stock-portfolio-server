import { Injectable } from '@nestjs/common';

// Prisma
import { PrismaService } from '@app/prisma/prisma.service';

// Asset
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';

@Injectable()
export class AssetService {
  constructor(private prisma: PrismaService) {}

  create(createAssetDto: CreateAssetDto) {
    return this.prisma.asset.create({ data: createAssetDto });
  }

  findAll() {
    return this.prisma.asset.findMany();
  }

  findOne(id: string) {
    return this.prisma.asset.findUnique({ where: { id } });
  }

  update(id: string, updateAssetDto: UpdateAssetDto) {
    return this.prisma.asset.update({
      where: { id },
      data: updateAssetDto,
    });
  }

  remove(id: string) {
    return this.prisma.asset.delete({ where: { id } });
  }
}
