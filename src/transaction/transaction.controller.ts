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
import {
  TransactionListDto,
  AssetTransactionListDto,
} from './dto/transaction.dto';
import { AssetStatDto, OverallStatDto } from './dto/stat.dto';
import { StatEntity } from './entities/stat.entity';

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
    @Body() transactionListDto: TransactionListDto,
  ) {
    const transactions = await this.transactionService.findAllTransaction(
      loggedInUser,
      transactionListDto,
    );
    return transactions.map(
      (transaction) => new TransactionEntity(transaction),
    );
  }

  // * FIND ASSET STAT
  @Post('asset-stat')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: StatEntity })
  async findAssetStat(
    @LoggedInUser() loggedInUser: AuthUserEntity,
    @Body() assetStatDto: AssetStatDto,
  ) {
    const { asset_id } = assetStatDto;
    const asset = await this.assetService.findOne(asset_id);
    if (!asset) {
      throw new NotFoundException(`Asset with ${asset_id} does not exist.`);
    }
    const profit_loss = new StatEntity(
      await this.transactionService.findAssetStat(loggedInUser, assetStatDto),
    );

    return profit_loss;
  }

  // * FIND OVERALL PROFIT/LOSS
  @Post('overall-stat')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: StatEntity })
  async findOverallStat(
    @LoggedInUser() loggedInUser: AuthUserEntity,
    @Body() overallStatDto: OverallStatDto,
  ) {
    const { asset_type } = overallStatDto;
    const is_asset_type = ['stock', 'index'].includes(asset_type);
    if (!is_asset_type) {
      throw new NotFoundException(
        `Asset type with ${asset_type} does not exist.`,
      );
    }
    const profit_loss = new StatEntity(
      await this.transactionService.findOverallStat(
        loggedInUser,
        overallStatDto,
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
  @Post('asset')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: TransactionEntity })
  async findAllByAssetID(
    @LoggedInUser() loggedInUser: AuthUserEntity,
    @Body() assetTransactionListDto: AssetTransactionListDto,
  ) {
    const { asset_id } = assetTransactionListDto;
    const asset = await this.assetService.findOne(asset_id);
    if (!asset) {
      throw new NotFoundException(`Asset with ${asset_id} does not exist.`);
    }
    const transactions = await this.transactionService.findAllByAssetID(
      loggedInUser,
      assetTransactionListDto,
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
