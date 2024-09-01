import { PartialType } from '@nestjs/swagger';

// Transaction
import { CreateTransactionDto } from './create-transaction.dto';

export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {}
