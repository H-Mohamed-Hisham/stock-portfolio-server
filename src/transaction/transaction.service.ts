import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

// Prisma
import { PrismaService } from '@app/prisma/prisma.service';

// Transaction
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import {
  TransactionListDto,
  AssetTransactionListDto,
} from './dto/transaction.dto';
import { AssetStatDto, OverallStatDto } from './dto/stat.dto';
import { RemoveTransactionDto } from './dto/remove-transaction.dto';

// Auth
import { AuthUserEntity } from '@app/auth/entities/auth.entity';

// Utils
import { calculateTotal } from '@app/utils/calculation';

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}

  // * CREATE
  async createTransaction(
    loggedInUser: AuthUserEntity,
    createTransactionDto: CreateTransactionDto,
  ) {
    const logged_in_user = loggedInUser;
    const { transaction_type, quantity, price, tax } = createTransactionDto;

    const total = calculateTotal({
      transaction_type: transaction_type,
      quantity: quantity,
      price: price,
      tax: tax,
    });

    const transaction = await this.prisma.transaction.create({
      data: {
        user_id: logged_in_user.id,
        price: new Prisma.Decimal(price),
        tax: new Prisma.Decimal(tax),
        total: new Prisma.Decimal(total),
        ...createTransactionDto,
      },
    });

    return transaction;
  }

  // * LIST
  async findAllTransaction(
    loggedInUser: AuthUserEntity,
    transactionListDto: TransactionListDto,
  ) {
    const logged_in_user = loggedInUser;
    const { transaction_type } = transactionListDto;

    return await this.prisma.transaction.findMany({
      where: {
        user_id: logged_in_user.id,
        ...(['buy', 'sell'].includes(transaction_type) && {
          transaction_type: transaction_type,
        }),
      },
      select: {
        id: true,
        user_id: true,
        date: true,
        asset_id: true,
        transaction_type: true,
        quantity: true,
        price: true,
        tax: true,
        total: true,
        asset: {
          select: {
            id: true,
            name: true,
            symbol: true,
            type: true,
          },
        },
      },
    });
  }

  // * FIND BY TRANSACTION ID
  findByTransactionID(loggedInUser: AuthUserEntity, id: string) {
    const logged_in_user = loggedInUser;
    return this.prisma.transaction.findUnique({
      where: { id, user_id: logged_in_user.id },
      select: {
        id: true,
        user_id: true,
        date: true,
        asset_id: true,
        transaction_type: true,
        quantity: true,
        price: true,
        tax: true,
        total: true,
        asset: {
          select: {
            id: true,
            name: true,
            symbol: true,
            type: true,
          },
        },
      },
    });
  }

  // * FIND BY ASSET ID
  findAllByAssetID(
    loggedInUser: AuthUserEntity,
    assetTransactionListDto: AssetTransactionListDto,
  ) {
    const { asset_id } = assetTransactionListDto;
    const logged_in_user = loggedInUser;
    return this.prisma.transaction.findMany({
      where: {
        asset_id: asset_id,
        user_id: logged_in_user.id,
      },
      select: {
        id: true,
        user_id: true,
        date: true,
        asset_id: true,
        transaction_type: true,
        quantity: true,
        price: true,
        tax: true,
        total: true,
        asset: {
          select: {
            id: true,
            name: true,
            symbol: true,
            type: true,
          },
        },
      },
    });
  }

  // * UPDATE BY ID
  updateTransaction(
    loggedInUser: AuthUserEntity,
    id: string,
    updateTransactionDto: UpdateTransactionDto,
  ) {
    const logged_in_user = loggedInUser;
    const { transaction_type, quantity, price, tax } = updateTransactionDto;

    const total = calculateTotal({
      transaction_type: transaction_type,
      quantity: quantity,
      price: price,
      tax: tax,
    });

    const transaction = this.prisma.transaction.update({
      where: { id, user_id: logged_in_user.id },
      data: {
        user_id: logged_in_user.id,
        price: new Prisma.Decimal(price),
        tax: new Prisma.Decimal(tax),
        total: new Prisma.Decimal(total),
        ...updateTransactionDto,
      },
    });

    return transaction;
  }

  // * REMOVE BY TRANSACTION ID
  removeTransactionByID(loggedInUser: AuthUserEntity, id: string) {
    const logged_in_user = loggedInUser;
    return this.prisma.transaction.delete({
      where: { id, user_id: logged_in_user.id },
    });
  }

  // * REMOVE TRANSACTIONS
  removeTransactions(
    loggedInUser: AuthUserEntity,
    removeTransactionDto: RemoveTransactionDto,
  ) {
    const logged_in_user = loggedInUser;
    return this.prisma.transaction.deleteMany({
      where: {
        user_id: logged_in_user.id,
        id: {
          in: removeTransactionDto.transaction_id,
        },
      },
    });
  }

  // * ASSET STAT
  async findAssetStat(
    loggedInUser: AuthUserEntity,
    assetStatDto: AssetStatDto,
  ) {
    const logged_in_user = loggedInUser;
    const { asset_id } = assetStatDto;

    const asset_detail = await this.prisma.asset.findUnique({
      where: {
        id: asset_id,
      },
      select: {
        name: true,
        symbol: true,
      },
    });

    const { name, symbol } = asset_detail;

    const buy_transaction = await this.prisma.transaction.aggregate({
      _sum: {
        total: true,
        quantity: true,
      },
      where: {
        transaction_type: 'buy',
        asset_id: asset_id,
        user_id: logged_in_user.id,
      },
    });

    const sell_transaction = await this.prisma.transaction.aggregate({
      _sum: {
        total: true,
        quantity: true,
      },
      where: {
        transaction_type: 'sell',
        asset_id: asset_id,
        user_id: logged_in_user.id,
      },
    });

    const invested = buy_transaction?._sum.total ?? 0;
    const returns = sell_transaction?._sum.total ?? 0;

    const quantity_bought = buy_transaction?._sum.quantity ?? 0;
    const quantity_sold = sell_transaction?._sum.quantity ?? 0;
    const quantity_holding = quantity_bought - quantity_sold;

    const profit_loss_amount =
      quantity_sold === 0
        ? 0
        : returns > invested
          ? Number(returns) - Number(invested)
          : Number(invested) - Number(returns);

    const profit_loss_status =
      quantity_sold === 0
        ? 'no profit no loss'
        : Number(invested) < Number(returns)
          ? 'profit'
          : Number(invested) > Number(returns)
            ? 'loss'
            : 'no profit no loss';

    const result = {
      name,
      symbol,
      invested: Number(invested),
      returns: Number(returns),
      quantity_bought,
      quantity_sold,
      quantity_holding,
      profit_loss_amount: Number(profit_loss_amount),
      profit_loss_status,
    };

    return result;
  }

  // * OVERALL STAT
  async findOverallStat(
    loggedInUser: AuthUserEntity,
    overallStatDto: OverallStatDto,
  ) {
    const logged_in_user = loggedInUser;

    const { asset_type } = overallStatDto;

    const buy_transaction = await this.prisma.transaction.aggregate({
      _sum: {
        total: true,
        quantity: true,
      },
      where: {
        transaction_type: 'buy',
        asset: {
          type: asset_type,
        },
        user_id: logged_in_user.id,
      },
    });

    const sell_transaction = await this.prisma.transaction.aggregate({
      _sum: {
        total: true,
        quantity: true,
      },
      where: {
        transaction_type: 'sell',
        asset: {
          type: asset_type,
        },
        user_id: logged_in_user.id,
      },
    });

    const invested = buy_transaction?._sum.total ?? 0;
    const returns = sell_transaction?._sum.total ?? 0;
    const quantity_bought = buy_transaction?._sum.quantity ?? 0;
    const quantity_sold = sell_transaction?._sum.quantity ?? 0;
    const quantity_holding = quantity_bought - quantity_sold;
    const profit_loss_amount =
      returns > invested
        ? Number(returns) - Number(invested)
        : Number(invested) - Number(returns);
    const profit_loss_status =
      Number(invested) < Number(returns)
        ? 'profit'
        : Number(invested) > Number(returns)
          ? 'loss'
          : 'no profit no loss';

    const result = {
      name: asset_type === 'stock' ? 'Stock' : 'Index',
      symbol: asset_type === 'stock' ? 'STOCK' : 'INDEX',
      invested: Number(invested),
      returns: Number(returns),
      quantity_bought,
      quantity_sold,
      quantity_holding,
      profit_loss_amount: Number(profit_loss_amount),
      profit_loss_status,
    };

    return result;
  }

  findTransactionWithAssetID(id: string) {
    return this.prisma.transaction.findFirst({
      where: { asset_id: id },
      select: {
        id: true,
        user_id: true,
        date: true,
        asset_id: true,
        transaction_type: true,
        quantity: true,
        price: true,
        tax: true,
        total: true,
        asset: {
          select: {
            id: true,
            name: true,
            symbol: true,
            type: true,
          },
        },
      },
    });
  }
}
