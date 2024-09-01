import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

// Prisma
import { PrismaService } from '@app/prisma/prisma.service';

// Transaction
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { ListTransactionDto } from './dto/list-transaction.dto';
import {
  AssetProfitLossDto,
  OverallProfitLossDto,
} from './dto/profit-loss.dto';

// User
import { UserStorage } from '@app/user/user.storage';

// Utils
import { calculateTotal } from '@app/utils/calculation';

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}

  // * CREATE
  async createTransaction(createTransactionDto: CreateTransactionDto) {
    const logged_in_user = UserStorage.get();
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
  async findAllTransaction(listTransactionDto: ListTransactionDto) {
    const logged_in_user = UserStorage.get();
    const { transaction_type } = listTransactionDto;

    return await this.prisma.transaction.findMany({
      where: {
        user_id: logged_in_user.id,
        ...(['buy', 'sell'].includes(transaction_type) && {
          transaction_type: transaction_type,
        }),
      },
    });
  }

  // * FIND BY TRANSACTION ID
  findByTransactionID(id: string) {
    const logged_in_user = UserStorage.get();
    return this.prisma.transaction.findUnique({
      where: { id, user_id: logged_in_user.id },
    });
  }

  // * FIND BY ASSET ID
  findAllByAssetID(id: string) {
    const logged_in_user = UserStorage.get();
    return this.prisma.transaction.findMany({
      where: {
        asset_id: id,
        user_id: logged_in_user.id,
      },
    });
  }

  // * UPDATE BY ID
  updateTransaction(id: string, updateTransactionDto: UpdateTransactionDto) {
    const logged_in_user = UserStorage.get();
    return this.prisma.transaction.update({
      where: { id, user_id: logged_in_user.id },
      data: updateTransactionDto,
    });
  }

  // * DELETE
  removeTransaction(id: string) {
    const logged_in_user = UserStorage.get();
    return this.prisma.transaction.delete({
      where: { id, user_id: logged_in_user.id },
    });
  }

  // * ASSET PROFIT/LOSS
  async findAssetProfitLoss(assetProfitLossDto: AssetProfitLossDto) {
    const logged_in_user = UserStorage.get();
    const { asset_id } = assetProfitLossDto;

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

  // * OVERALL PROFIT/LOSS
  async findOverallProfitLoss(overallProfitLossDto: OverallProfitLossDto) {
    const logged_in_user = UserStorage.get();
    const { asset_type } = overallProfitLossDto;

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
}
