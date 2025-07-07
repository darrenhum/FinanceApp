import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TransactionsService } from './transactions.service';
import { Transaction } from '../entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';

describe('TransactionsService', () => {
  let service: TransactionsService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockQueryBuilder = {
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: getRepositoryToken(Transaction),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);

    // Reset all mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a transaction successfully', async () => {
      const createTransactionDto: CreateTransactionDto = {
        account_id: '123e4567-e89b-12d3-a456-426614174000',
        date: '2024-01-15T10:30:00.000Z',
        amount: -50.25,
        merchant: 'Test Merchant',
        description: 'Test transaction',
        category_id: '123e4567-e89b-12d3-a456-426614174001',
        owner_user_id: '123e4567-e89b-12d3-a456-426614174002',
        card_id: '123e4567-e89b-12d3-a456-426614174003',
      };

      const userId = '123e4567-e89b-12d3-a456-426614174004';
      const expectedTransaction = {
        id: '123e4567-e89b-12d3-a456-426614174005',
        ...createTransactionDto,
        date: new Date(createTransactionDto.date),
        added_by_user_id: userId,
      };

      mockRepository.create.mockReturnValue(expectedTransaction);
      mockRepository.save.mockResolvedValue(expectedTransaction);

      const result = await service.create(createTransactionDto, userId);

      expect(mockRepository.create).toHaveBeenCalledWith({
        ...createTransactionDto,
        date: new Date(createTransactionDto.date),
        added_by_user_id: userId,
      });
      expect(mockRepository.save).toHaveBeenCalledWith(expectedTransaction);
      expect(result).toEqual(expectedTransaction);
    });

    it('should handle date conversion correctly', async () => {
      const createTransactionDto: CreateTransactionDto = {
        account_id: '123e4567-e89b-12d3-a456-426614174000',
        date: '2024-01-15',
        amount: 100.0,
      };

      const userId = '123e4567-e89b-12d3-a456-426614174004';
      const expectedTransaction = {
        id: '123e4567-e89b-12d3-a456-426614174005',
        ...createTransactionDto,
        date: new Date(createTransactionDto.date),
        added_by_user_id: userId,
      };

      mockRepository.create.mockReturnValue(expectedTransaction);
      mockRepository.save.mockResolvedValue(expectedTransaction);

      await service.create(createTransactionDto, userId);

      expect(mockRepository.create).toHaveBeenCalledWith({
        ...createTransactionDto,
        date: new Date('2024-01-15'),
        added_by_user_id: userId,
      });
    });

    it('should handle minimal transaction data', async () => {
      const createTransactionDto: CreateTransactionDto = {
        account_id: '123e4567-e89b-12d3-a456-426614174000',
        date: '2024-01-15T10:30:00.000Z',
        amount: 25.5,
      };

      const userId = '123e4567-e89b-12d3-a456-426614174004';
      const expectedTransaction = {
        id: '123e4567-e89b-12d3-a456-426614174005',
        ...createTransactionDto,
        date: new Date(createTransactionDto.date),
        added_by_user_id: userId,
      };

      mockRepository.create.mockReturnValue(expectedTransaction);
      mockRepository.save.mockResolvedValue(expectedTransaction);

      const result = await service.create(createTransactionDto, userId);

      expect(result).toEqual(expectedTransaction);
    });

    it('should throw error when repository save fails', async () => {
      const createTransactionDto: CreateTransactionDto = {
        account_id: '123e4567-e89b-12d3-a456-426614174000',
        date: '2024-01-15T10:30:00.000Z',
        amount: 50.0,
      };

      const userId = '123e4567-e89b-12d3-a456-426614174004';
      const error = new Error('Database error');

      mockRepository.create.mockReturnValue({});
      mockRepository.save.mockRejectedValue(error);

      await expect(
        service.create(createTransactionDto, userId),
      ).rejects.toThrow('Database error');
    });
  });

  describe('findAll', () => {
    beforeEach(() => {
      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
    });

    it('should return all transactions when no month filter is provided', async () => {
      const expectedTransactions = [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          amount: -50.25,
          date: new Date('2024-01-15'),
        },
        {
          id: '123e4567-e89b-12d3-a456-426614174001',
          amount: 100.0,
          date: new Date('2024-01-10'),
        },
      ];

      mockQueryBuilder.getMany.mockResolvedValue(expectedTransactions);

      const result = await service.findAll();

      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith(
        'transaction',
      );
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'transaction.account',
        'account',
      );
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'transaction.category',
        'category',
      );
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'transaction.added_by_user',
        'added_by_user',
      );
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'transaction.owner_user',
        'owner_user',
      );
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
        'transaction.date',
        'DESC',
      );
      expect(mockQueryBuilder.andWhere).not.toHaveBeenCalled();
      expect(mockQueryBuilder.getMany).toHaveBeenCalled();
      expect(result).toEqual(expectedTransactions);
    });

    it('should filter transactions by month when month filter is provided', async () => {
      const month = '2024-01';
      const expectedTransactions = [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          amount: -50.25,
          date: new Date('2024-01-15'),
        },
      ];

      mockQueryBuilder.getMany.mockResolvedValue(expectedTransactions);

      const result = await service.findAll(month);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'transaction.date >= :startDate AND transaction.date <= :endDate',
        {
          startDate: new Date(2024, 0, 1), // January 1st, 2024
          endDate: new Date(2024, 1, 0), // Last day of January 2024
        },
      );
      expect(result).toEqual(expectedTransactions);
    });

    it('should handle different month formats correctly', async () => {
      const month = '2024-12';
      mockQueryBuilder.getMany.mockResolvedValue([]);

      await service.findAll(month);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'transaction.date >= :startDate AND transaction.date <= :endDate',
        {
          startDate: new Date(2024, 11, 1), // December 1st, 2024
          endDate: new Date(2024, 12, 0), // Last day of December 2024
        },
      );
    });

    it('should handle leap year February correctly', async () => {
      const month = '2024-02'; // 2024 is a leap year
      mockQueryBuilder.getMany.mockResolvedValue([]);

      await service.findAll(month);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'transaction.date >= :startDate AND transaction.date <= :endDate',
        {
          startDate: new Date(2024, 1, 1), // February 1st, 2024
          endDate: new Date(2024, 2, 0), // February 29th, 2024 (leap year)
        },
      );
    });

    it('should return empty array when no transactions found', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });

    it('should throw error when query builder fails', async () => {
      const error = new Error('Query builder error');
      mockQueryBuilder.getMany.mockRejectedValue(error);

      await expect(service.findAll()).rejects.toThrow('Query builder error');
    });
  });

  describe('findOne', () => {
    it('should return a transaction when found', async () => {
      const transactionId = '123e4567-e89b-12d3-a456-426614174000';
      const expectedTransaction = {
        id: transactionId,
        amount: -50.25,
        date: new Date('2024-01-15'),
        account: { id: '123e4567-e89b-12d3-a456-426614174001' },
        category: { id: '123e4567-e89b-12d3-a456-426614174002' },
        added_by_user: { id: '123e4567-e89b-12d3-a456-426614174003' },
        owner_user: { id: '123e4567-e89b-12d3-a456-426614174004' },
      };

      mockRepository.findOne.mockResolvedValue(expectedTransaction);

      const result = await service.findOne(transactionId);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: transactionId },
        relations: ['account', 'category', 'added_by_user', 'owner_user'],
      });
      expect(result).toEqual(expectedTransaction);
    });

    it('should return null when transaction not found', async () => {
      const transactionId = '123e4567-e89b-12d3-a456-426614174000';

      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.findOne(transactionId);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: transactionId },
        relations: ['account', 'category', 'added_by_user', 'owner_user'],
      });
      expect(result).toBeNull();
    });

    it('should throw error when repository findOne fails', async () => {
      const transactionId = '123e4567-e89b-12d3-a456-426614174000';
      const error = new Error('Database connection error');

      mockRepository.findOne.mockRejectedValue(error);

      await expect(service.findOne(transactionId)).rejects.toThrow(
        'Database connection error',
      );
    });
  });
});
