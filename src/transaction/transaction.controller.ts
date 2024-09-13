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
import { LoggedInUser } from 'src/auth/auth.decorator';
import { AuthUserEntity } from 'src/auth/entities/auth.entity';

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
  async createTransaction(
    @LoggedInUser() loggedInUser: AuthUserEntity,
    @Body() createTransactionDto: CreateTransactionDto,
  ) {
    return new TransactionEntity(
      await this.transactionService.createTransaction(
        loggedInUser,
        createTransactionDto,
      ),
    );
  }

  // * LIST
  @Post('list')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: TransactionEntity })
  async findAllTransaction(
    @LoggedInUser() loggedInUser: AuthUserEntity,
    @Body() listTransactionDto: ListTransactionDto,
  ) {
    const transactions = await this.transactionService.findAllTransaction(
      loggedInUser,
      listTransactionDto,
    );
    return transactions.map(
      (transaction) => new TransactionEntity(transaction),
    );
  }

  // * FIND ASSET PROFIT/LOSS
  @Post('asset-profit-loss')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: AssetProfitLossEntity })
  async findAssetProfitLoss(
    @LoggedInUser() loggedInUser: AuthUserEntity,
    @Body() assetProfitLossDto: AssetProfitLossDto,
  ) {
    const { asset_id } = assetProfitLossDto;
    const asset = await this.assetService.findOne(asset_id);
    if (!asset) {
      throw new NotFoundException(`Asset with ${asset_id} does not exist.`);
    }
    const profit_loss = new AssetProfitLossEntity(
      await this.transactionService.findAssetProfitLoss(
        loggedInUser,
        assetProfitLossDto,
      ),
    );

    return profit_loss;
  }

  // * FIND OVERALL PROFIT/LOSS
  @Post('overall-profit-loss')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: OverallProfitLossEntity })
  async findOverallProfitLoss(
    @LoggedInUser() loggedInUser: AuthUserEntity,
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
      await this.transactionService.findOverallProfitLoss(
        loggedInUser,
        overallProfitLossDto,
      ),
    );
    return profit_loss;
  }

  // * FIND BY ID
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: TransactionEntity })
  async findByTransactionID(
    @LoggedInUser() loggedInUser: AuthUserEntity,
    @Param('id') id: string,
  ) {
    const transaction = new TransactionEntity(
      await this.transactionService.findByTransactionID(loggedInUser, id),
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
  async findAllByAssetID(
    @LoggedInUser() loggedInUser: AuthUserEntity,
    @Param('id') id: string,
  ) {
    const asset = await this.assetService.findOne(id);
    if (!asset) {
      throw new NotFoundException(`Asset with ${id} does not exist.`);
    }
    const transactions = await this.transactionService.findAllByAssetID(
      loggedInUser,
      id,
    );
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
    @LoggedInUser() loggedInUser: AuthUserEntity,
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    const transaction = this.transactionService.findByTransactionID(
      loggedInUser,
      id,
    );
    if (!transaction) {
      throw new NotFoundException(`Transaction with ${id} does not exist.`);
    }
    return new TransactionEntity(
      await this.transactionService.updateTransaction(
        loggedInUser,
        id,
        updateTransactionDto,
      ),
    );
  }

  // * DELETE
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: TransactionEntity })
  async removeTransaction(
    @LoggedInUser() loggedInUser: AuthUserEntity,
    @Param('id') id: string,
  ) {
    const transaction = this.transactionService.findByTransactionID(
      loggedInUser,
      id,
    );
    if (!transaction) {
      throw new NotFoundException(`Transaction with ${id} does not exist.`);
    }
    return new TransactionEntity(
      await this.transactionService.removeTransaction(loggedInUser, id),
    );
  }
}
