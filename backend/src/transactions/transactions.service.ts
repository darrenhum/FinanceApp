import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  async create(
    createTransactionDto: CreateTransactionDto,
    userId: string,
  ): Promise<Transaction> {
    const transaction = this.transactionRepository.create({
      ...createTransactionDto,
      date: new Date(createTransactionDto.date),
      added_by_user_id: userId,
    });

    return await this.transactionRepository.save(transaction);
  }

  async findAll(month?: string): Promise<Transaction[]> {
    const queryBuilder = this.transactionRepository
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.account', 'account')
      .leftJoinAndSelect('transaction.category', 'category')
      .leftJoinAndSelect('transaction.added_by_user', 'added_by_user')
      .leftJoinAndSelect('transaction.owner_user', 'owner_user')
      .orderBy('transaction.date', 'DESC');

    if (month) {
      // Parse month in format YYYY-MM
      const [year, monthNum] = month.split('-');
      const startDate = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
      const endDate = new Date(parseInt(year), parseInt(monthNum), 0);

      queryBuilder.andWhere(
        'transaction.date >= :startDate AND transaction.date <= :endDate',
        { startDate, endDate },
      );
    }

    return await queryBuilder.getMany();
  }

  async findOne(id: string): Promise<Transaction | null> {
    return await this.transactionRepository.findOne({
      where: { id },
      relations: ['account', 'category', 'added_by_user', 'owner_user'],
    });
  }
}
