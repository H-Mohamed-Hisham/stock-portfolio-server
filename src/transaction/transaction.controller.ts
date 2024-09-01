import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  UseGuards,
  // Req,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';

// Asset
import { AssetService } from '@app/asset/asset.service';

// Transaction
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionEntity } from './entities/transaction.entity';
import { ListTransactionDto } from './dto/list-transaction.dto';
import {
  AssetProfitLossDto,
  OverallProfitLossDto,
} from './dto/profit-loss.dto';
import {
  AssetProfitLossEntity,
  OverallProfitLossEntity,
} from './entities/profit-loss.entity';

// Auth
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('transaction')
@ApiTags('transaction')
export class TransactionController {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly assetService: AssetService,
  ) {}

  // * CREATE
  @Post('create')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: TransactionEntity })
  async createTransaction(@Body() createTransactionDto: CreateTransactionDto) {
    return new TransactionEntity(
      await this.transactionService.createTransaction(createTransactionDto),
    );
  }

  // * LIST
  @Post('list')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: TransactionEntity })
  async findAllTransaction(@Body() listTransactionDto: ListTransactionDto) {
    const transactions =
      await this.transactionService.findAllTransaction(listTransactionDto);
    return transactions.map(
      (transaction) => new TransactionEntity(transaction),
    );
  }

  // * FIND ASSET PROFIT/LOSS
  @Post('asset-profit-loss')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: AssetProfitLossEntity })
  async findAssetProfitLoss(@Body() assetProfitLossDto: AssetProfitLossDto) {
    const { asset_id } = assetProfitLossDto;
    const asset = await this.assetService.findOne(asset_id);
    if (!asset) {
      throw new NotFoundException(`Asset with ${asset_id} does not exist.`);
    }
    const profit_loss = new AssetProfitLossEntity(
      await this.transactionService.findAssetProfitLoss(assetProfitLossDto),
    );

    return profit_loss;
  }

  // * FIND OVERALL PROFIT/LOSS
  @Post('overall-profit-loss')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: OverallProfitLossEntity })
  async findOverallProfitLoss(
    @Body() overallProfitLossDto: OverallProfitLossDto,
  ) {
    const { asset_type } = overallProfitLossDto;
    const is_asset_type = ['stock', 'index'].includes(asset_type);
    if (!is_asset_type) {
      throw new NotFoundException(
        `Asset type with ${asset_type} does not exist.`,
      );
    }
    const profit_loss = new OverallProfitLossEntity(
      await this.transactionService.findOverallProfitLoss(overallProfitLossDto),
    );
    return profit_loss;
  }

  // * FIND BY ID
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: TransactionEntity })
  async findByTransactionID(@Param('id') id: string) {
    const transaction = new TransactionEntity(
      await this.transactionService.findByTransactionID(id),
    );
    if (!transaction) {
      throw new NotFoundException(`Transaction with ${id} does not exist.`);
    }
    return transaction;
  }

  // * FIND ALL BY ASSET ID
  @Get('asset/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: TransactionEntity })
  async findAllByAssetID(@Param('id') id: string) {
    const asset = await this.assetService.findOne(id);
    if (!asset) {
      throw new NotFoundException(`Asset with ${id} does not exist.`);
    }
    const transactions = await this.transactionService.findAllByAssetID(id);
    return transactions.map(
      (transaction) => new TransactionEntity(transaction),
    );
  }

  // * UPDATE BY ID
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: TransactionEntity })
  async updateTransaction(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    const transaction = this.transactionService.findByTransactionID(id);
    if (!transaction) {
      throw new NotFoundException(`Transaction with ${id} does not exist.`);
    }
    return new TransactionEntity(
      await this.transactionService.updateTransaction(id, updateTransactionDto),
    );
  }

  // * DELETE
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: TransactionEntity })
  async removeTransaction(@Param('id') id: string) {
    const transaction = this.transactionService.findByTransactionID(id);
    if (!transaction) {
      throw new NotFoundException(`Transaction with ${id} does not exist.`);
    }
    return new TransactionEntity(
      await this.transactionService.removeTransaction(id),
    );
  }
}
