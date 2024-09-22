import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';

// Asset
import { AssetService } from './asset.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { AssetEntity } from './entities/asset.entity';

// Transaction
import { TransactionService } from '@app/transaction/transaction.service';

// Auth
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('asset')
@ApiTags('asset')
export class AssetController {
  constructor(
    private readonly assetService: AssetService,
    private readonly transactionService: TransactionService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: AssetEntity })
  create(@Body() createAssetDto: CreateAssetDto) {
    return this.assetService.create(createAssetDto);
  }

  @Get()
  @ApiOkResponse({ type: AssetEntity, isArray: true })
  findAll() {
    return this.assetService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: AssetEntity })
  async findOne(@Param('id') id: string) {
    const asset = this.assetService.findOne(id);
    if (!asset) {
      throw new NotFoundException(`Asset with ${id} does not exist.`);
    }
    return asset;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: AssetEntity })
  update(@Param('id') id: string, @Body() updateAssetDto: UpdateAssetDto) {
    const asset = this.assetService.findOne(id);
    if (!asset) {
      throw new NotFoundException(`Asset with ${id} does not exist.`);
    }
    return this.assetService.update(id, updateAssetDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: AssetEntity })
  async remove(@Param('id') id: string) {
    const findTransactionWithAssetID =
      await this.transactionService.findTransactionWithAssetID(id);

    if (findTransactionWithAssetID) {
      throw new BadRequestException(
        `Unable to delete : Asset is connected with transaction, Try removing transaction related to ${findTransactionWithAssetID.asset.name} first and remove this asset`,
      );
    }

    const asset = await this.assetService.findOne(id);
    if (!asset) {
      throw new NotFoundException(`Asset with ${id} does not exist.`);
    }
    return this.assetService.remove(id);
  }
}
