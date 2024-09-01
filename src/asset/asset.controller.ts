import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

// Asset
import { AssetService } from './asset.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { AssetEntity } from './entities/asset.entity';

@Controller('asset')
@ApiTags('asset')
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @Post()
  @ApiCreatedResponse({ type: AssetEntity })
  @Post()
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
  @ApiOkResponse({ type: AssetEntity })
  update(@Param('id') id: string, @Body() updateAssetDto: UpdateAssetDto) {
    const asset = this.assetService.findOne(id);
    if (!asset) {
      throw new NotFoundException(`Asset with ${id} does not exist.`);
    }
    return this.assetService.update(id, updateAssetDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: AssetEntity })
  remove(@Param('id') id: string) {
    const asset = this.assetService.findOne(id);
    if (!asset) {
      throw new NotFoundException(`Asset with ${id} does not exist.`);
    }
    return this.assetService.remove(id);
  }
}
