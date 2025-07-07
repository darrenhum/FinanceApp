import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Transaction } from '../entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

describe('TransactionsController', () => {
  let controller: TransactionsController;

  const mockTransactionsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        {
          provide: TransactionsService,
          useValue: mockTransactionsService,
        },
        {
          provide: getRepositoryToken(Transaction),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            createQueryBuilder: jest.fn(() => ({
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getMany: jest.fn(),
            })),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<TransactionsController>(TransactionsController);

    // Reset all mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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

      const mockRequest = {
        user: { userId: '123e4567-e89b-12d3-a456-426614174004' },
      };

      const expectedResult = {
        id: '123e4567-e89b-12d3-a456-426614174005',
        ...createTransactionDto,
        date: new Date(createTransactionDto.date),
        added_by_user_id: mockRequest.user.userId,
      };

      mockTransactionsService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createTransactionDto, mockRequest);

      expect(mockTransactionsService.create).toHaveBeenCalledWith(
        createTransactionDto,
        mockRequest.user.userId,
      );
      expect(result).toEqual(expectedResult);
    });

    it('should handle service errors', async () => {
      const createTransactionDto: CreateTransactionDto = {
        account_id: '123e4567-e89b-12d3-a456-426614174000',
        date: '2024-01-15T10:30:00.000Z',
        amount: -50.25,
      };

      const mockRequest = {
        user: { userId: '123e4567-e89b-12d3-a456-426614174004' },
      };

      const error = new Error('Service error');
      mockTransactionsService.create.mockRejectedValue(error);

      await expect(
        controller.create(createTransactionDto, mockRequest),
      ).rejects.toThrow('Service error');
    });
  });

  describe('findAll', () => {
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

      mockTransactionsService.findAll.mockResolvedValue(expectedTransactions);

      const result = await controller.findAll();

      expect(mockTransactionsService.findAll).toHaveBeenCalledWith(undefined);
      expect(result).toEqual(expectedTransactions);
    });

    it('should return filtered transactions when month filter is provided', async () => {
      const month = '2024-01';
      const expectedTransactions = [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          amount: -50.25,
          date: new Date('2024-01-15'),
        },
      ];

      mockTransactionsService.findAll.mockResolvedValue(expectedTransactions);

      const result = await controller.findAll(month);

      expect(mockTransactionsService.findAll).toHaveBeenCalledWith(month);
      expect(result).toEqual(expectedTransactions);
    });

    it('should return empty array when no transactions found', async () => {
      mockTransactionsService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(mockTransactionsService.findAll).toHaveBeenCalledWith(undefined);
      expect(result).toEqual([]);
    });

    it('should handle service errors', async () => {
      const error = new Error('Service error');
      mockTransactionsService.findAll.mockRejectedValue(error);

      await expect(controller.findAll()).rejects.toThrow('Service error');
    });
  });
});
