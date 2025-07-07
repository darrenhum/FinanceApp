import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { CreateTransactionDto } from './create-transaction.dto';

describe('CreateTransactionDto', () => {
  describe('account_id validation', () => {
    it('should pass with valid UUID', async () => {
      const dto = plainToClass(CreateTransactionDto, {
        account_id: '123e4567-e89b-12d3-a456-426614174000',
        date: '2024-01-15T10:30:00.000Z',
        amount: 50.25,
      });

      const errors = await validate(dto);
      const accountIdErrors = errors.filter(
        (err) => err.property === 'account_id',
      );
      expect(accountIdErrors).toHaveLength(0);
    });

    it('should fail with invalid UUID', async () => {
      const dto = plainToClass(CreateTransactionDto, {
        account_id: 'invalid-uuid',
        date: '2024-01-15T10:30:00.000Z',
        amount: 50.25,
      });

      const errors = await validate(dto);
      const accountIdErrors = errors.filter(
        (err) => err.property === 'account_id',
      );
      expect(accountIdErrors).toHaveLength(1);
      expect(accountIdErrors[0].constraints).toHaveProperty('isUuid');
    });

    it('should fail when missing', async () => {
      const dto = plainToClass(CreateTransactionDto, {
        date: '2024-01-15T10:30:00.000Z',
        amount: 50.25,
      });

      const errors = await validate(dto);
      const accountIdErrors = errors.filter(
        (err) => err.property === 'account_id',
      );
      expect(accountIdErrors).toHaveLength(1);
      expect(accountIdErrors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('should fail with empty string', async () => {
      const dto = plainToClass(CreateTransactionDto, {
        account_id: '',
        date: '2024-01-15T10:30:00.000Z',
        amount: 50.25,
      });

      const errors = await validate(dto);
      const accountIdErrors = errors.filter(
        (err) => err.property === 'account_id',
      );
      expect(accountIdErrors).toHaveLength(1);
      expect(accountIdErrors[0].constraints).toHaveProperty('isNotEmpty');
    });
  });

  describe('date validation', () => {
    it('should pass with valid ISO date string', async () => {
      const dto = plainToClass(CreateTransactionDto, {
        account_id: '123e4567-e89b-12d3-a456-426614174000',
        date: '2024-01-15T10:30:00.000Z',
        amount: 50.25,
      });

      const errors = await validate(dto);
      const dateErrors = errors.filter((err) => err.property === 'date');
      expect(dateErrors).toHaveLength(0);
    });

    it('should pass with simple date format', async () => {
      const dto = plainToClass(CreateTransactionDto, {
        account_id: '123e4567-e89b-12d3-a456-426614174000',
        date: '2024-01-15',
        amount: 50.25,
      });

      const errors = await validate(dto);
      const dateErrors = errors.filter((err) => err.property === 'date');
      expect(dateErrors).toHaveLength(0);
    });

    it('should fail with invalid date format', async () => {
      const dto = plainToClass(CreateTransactionDto, {
        account_id: '123e4567-e89b-12d3-a456-426614174000',
        date: 'invalid-date',
        amount: 50.25,
      });

      const errors = await validate(dto);
      const dateErrors = errors.filter((err) => err.property === 'date');
      expect(dateErrors).toHaveLength(1);
      expect(dateErrors[0].constraints).toHaveProperty('isDateString');
    });

    it('should fail with non-ISO date format', async () => {
      const dto = plainToClass(CreateTransactionDto, {
        account_id: '123e4567-e89b-12d3-a456-426614174000',
        date: '01/15/2024',
        amount: 50.25,
      });

      const errors = await validate(dto);
      const dateErrors = errors.filter((err) => err.property === 'date');
      expect(dateErrors).toHaveLength(1);
      expect(dateErrors[0].constraints).toHaveProperty('matches');
    });

    it('should fail when missing', async () => {
      const dto = plainToClass(CreateTransactionDto, {
        account_id: '123e4567-e89b-12d3-a456-426614174000',
        amount: 50.25,
      });

      const errors = await validate(dto);
      const dateErrors = errors.filter((err) => err.property === 'date');
      expect(dateErrors).toHaveLength(1);
      expect(dateErrors[0].constraints).toHaveProperty('isNotEmpty');
    });
  });

  describe('amount validation', () => {
    it('should pass with valid positive number', async () => {
      const dto = plainToClass(CreateTransactionDto, {
        account_id: '123e4567-e89b-12d3-a456-426614174000',
        date: '2024-01-15T10:30:00.000Z',
        amount: 50.25,
      });

      const errors = await validate(dto);
      const amountErrors = errors.filter((err) => err.property === 'amount');
      expect(amountErrors).toHaveLength(0);
    });

    it('should pass with valid negative number', async () => {
      const dto = plainToClass(CreateTransactionDto, {
        account_id: '123e4567-e89b-12d3-a456-426614174000',
        date: '2024-01-15T10:30:00.000Z',
        amount: -50.25,
      });

      const errors = await validate(dto);
      const amountErrors = errors.filter((err) => err.property === 'amount');
      expect(amountErrors).toHaveLength(0);
    });

    it('should pass with zero', async () => {
      const dto = plainToClass(CreateTransactionDto, {
        account_id: '123e4567-e89b-12d3-a456-426614174000',
        date: '2024-01-15T10:30:00.000Z',
        amount: 0,
      });

      const errors = await validate(dto);
      const amountErrors = errors.filter((err) => err.property === 'amount');
      expect(amountErrors).toHaveLength(0);
    });

    it('should transform string numbers to numbers', async () => {
      const dto = plainToClass(CreateTransactionDto, {
        account_id: '123e4567-e89b-12d3-a456-426614174000',
        date: '2024-01-15T10:30:00.000Z',
        amount: '50.25',
      });

      const errors = await validate(dto);
      const amountErrors = errors.filter((err) => err.property === 'amount');
      expect(amountErrors).toHaveLength(0);
      expect(dto.amount).toBe(50.25);
    });

    it('should fail with non-numeric string', async () => {
      const dto = plainToClass(CreateTransactionDto, {
        account_id: '123e4567-e89b-12d3-a456-426614174000',
        date: '2024-01-15T10:30:00.000Z',
        amount: 'not-a-number',
      });

      const errors = await validate(dto);
      const amountErrors = errors.filter((err) => err.property === 'amount');
      expect(amountErrors).toHaveLength(1);
      expect(amountErrors[0].constraints).toHaveProperty('isNumber');
    });

    it('should fail with amount too large', async () => {
      const dto = plainToClass(CreateTransactionDto, {
        account_id: '123e4567-e89b-12d3-a456-426614174000',
        date: '2024-01-15T10:30:00.000Z',
        amount: 1000000,
      });

      const errors = await validate(dto);
      const amountErrors = errors.filter((err) => err.property === 'amount');
      expect(amountErrors).toHaveLength(1);
      expect(amountErrors[0].constraints).toHaveProperty('max');
    });

    it('should fail with amount too small', async () => {
      const dto = plainToClass(CreateTransactionDto, {
        account_id: '123e4567-e89b-12d3-a456-426614174000',
        date: '2024-01-15T10:30:00.000Z',
        amount: -1000000,
      });

      const errors = await validate(dto);
      const amountErrors = errors.filter((err) => err.property === 'amount');
      expect(amountErrors).toHaveLength(1);
      expect(amountErrors[0].constraints).toHaveProperty('min');
    });

    it('should fail when missing', async () => {
      const dto = plainToClass(CreateTransactionDto, {
        account_id: '123e4567-e89b-12d3-a456-426614174000',
        date: '2024-01-15T10:30:00.000Z',
      });

      const errors = await validate(dto);
      const amountErrors = errors.filter((err) => err.property === 'amount');
      expect(amountErrors).toHaveLength(1);
      expect(amountErrors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('should fail with NaN', async () => {
      const dto = plainToClass(CreateTransactionDto, {
        account_id: '123e4567-e89b-12d3-a456-426614174000',
        date: '2024-01-15T10:30:00.000Z',
        amount: NaN,
      });

      const errors = await validate(dto);
      const amountErrors = errors.filter((err) => err.property === 'amount');
      expect(amountErrors).toHaveLength(1);
      expect(amountErrors[0].constraints).toHaveProperty('isNumber');
    });

    it('should fail with Infinity', async () => {
      const dto = plainToClass(CreateTransactionDto, {
        account_id: '123e4567-e89b-12d3-a456-426614174000',
        date: '2024-01-15T10:30:00.000Z',
        amount: Infinity,
      });

      const errors = await validate(dto);
      const amountErrors = errors.filter((err) => err.property === 'amount');
      expect(amountErrors).toHaveLength(1);
      expect(amountErrors[0].constraints).toHaveProperty('isNumber');
    });
  });

  describe('merchant validation', () => {
    it('should pass with valid merchant name', async () => {
      const dto = plainToClass(CreateTransactionDto, {
        account_id: '123e4567-e89b-12d3-a456-426614174000',
        date: '2024-01-15T10:30:00.000Z',
        amount: 50.25,
        merchant: 'Test Merchant',
      });

      const errors = await validate(dto);
      const merchantErrors = errors.filter(
        (err) => err.property === 'merchant',
      );
      expect(merchantErrors).toHaveLength(0);
    });

    it('should pass when omitted', async () => {
      const dto = plainToClass(CreateTransactionDto, {
        account_id: '123e4567-e89b-12d3-a456-426614174000',
        date: '2024-01-15T10:30:00.000Z',
        amount: 50.25,
      });

      const errors = await validate(dto);
      const merchantErrors = errors.filter(
        (err) => err.property === 'merchant',
      );
      expect(merchantErrors).toHaveLength(0);
    });

    it('should trim whitespace', async () => {
      const dto = plainToClass(CreateTransactionDto, {
        account_id: '123e4567-e89b-12d3-a456-426614174000',
        date: '2024-01-15T10:30:00.000Z',
        amount: 50.25,
        merchant: '  Test Merchant  ',
      });

      const errors = await validate(dto);
      const merchantErrors = errors.filter(
        (err) => err.property === 'merchant',
      );
      expect(merchantErrors).toHaveLength(0);
      expect(dto.merchant).toBe('Test Merchant');
    });

    it('should fail with too long merchant name', async () => {
      const dto = plainToClass(CreateTransactionDto, {
        account_id: '123e4567-e89b-12d3-a456-426614174000',
        date: '2024-01-15T10:30:00.000Z',
        amount: 50.25,
        merchant: 'a'.repeat(256),
      });

      const errors = await validate(dto);
      const merchantErrors = errors.filter(
        (err) => err.property === 'merchant',
      );
      expect(merchantErrors).toHaveLength(1);
      expect(merchantErrors[0].constraints).toHaveProperty('maxLength');
    });

    it('should fail with non-string merchant', async () => {
      const dto = plainToClass(CreateTransactionDto, {
        account_id: '123e4567-e89b-12d3-a456-426614174000',
        date: '2024-01-15T10:30:00.000Z',
        amount: 50.25,
        merchant: 123,
      });

      const errors = await validate(dto);
      const merchantErrors = errors.filter(
        (err) => err.property === 'merchant',
      );
      expect(merchantErrors).toHaveLength(1);
      expect(merchantErrors[0].constraints).toHaveProperty('isString');
    });
  });

  describe('description validation', () => {
    it('should pass with valid description', async () => {
      const dto = plainToClass(CreateTransactionDto, {
        account_id: '123e4567-e89b-12d3-a456-426614174000',
        date: '2024-01-15T10:30:00.000Z',
        amount: 50.25,
        description: 'Test transaction description',
      });

      const errors = await validate(dto);
      const descriptionErrors = errors.filter(
        (err) => err.property === 'description',
      );
      expect(descriptionErrors).toHaveLength(0);
    });

    it('should pass when omitted', async () => {
      const dto = plainToClass(CreateTransactionDto, {
        account_id: '123e4567-e89b-12d3-a456-426614174000',
        date: '2024-01-15T10:30:00.000Z',
        amount: 50.25,
      });

      const errors = await validate(dto);
      const descriptionErrors = errors.filter(
        (err) => err.property === 'description',
      );
      expect(descriptionErrors).toHaveLength(0);
    });

    it('should trim whitespace', async () => {
      const dto = plainToClass(CreateTransactionDto, {
        account_id: '123e4567-e89b-12d3-a456-426614174000',
        date: '2024-01-15T10:30:00.000Z',
        amount: 50.25,
        description: '  Test description  ',
      });

      const errors = await validate(dto);
      const descriptionErrors = errors.filter(
        (err) => err.property === 'description',
      );
      expect(descriptionErrors).toHaveLength(0);
      expect(dto.description).toBe('Test description');
    });

    it('should fail with too long description', async () => {
      const dto = plainToClass(CreateTransactionDto, {
        account_id: '123e4567-e89b-12d3-a456-426614174000',
        date: '2024-01-15T10:30:00.000Z',
        amount: 50.25,
        description: 'a'.repeat(1001),
      });

      const errors = await validate(dto);
      const descriptionErrors = errors.filter(
        (err) => err.property === 'description',
      );
      expect(descriptionErrors).toHaveLength(1);
      expect(descriptionErrors[0].constraints).toHaveProperty('maxLength');
    });

    it('should fail with non-string description', async () => {
      const dto = plainToClass(CreateTransactionDto, {
        account_id: '123e4567-e89b-12d3-a456-426614174000',
        date: '2024-01-15T10:30:00.000Z',
        amount: 50.25,
        description: 123,
      });

      const errors = await validate(dto);
      const descriptionErrors = errors.filter(
        (err) => err.property === 'description',
      );
      expect(descriptionErrors).toHaveLength(1);
      expect(descriptionErrors[0].constraints).toHaveProperty('isString');
    });
  });

  describe('optional UUID fields validation', () => {
    const optionalUuidFields = [
      'category_id',
      'owner_user_id',
      'card_id',
    ] as const;

    optionalUuidFields.forEach((field) => {
      describe(`${field} validation`, () => {
        it('should pass with valid UUID', async () => {
          const dto = plainToClass(CreateTransactionDto, {
            account_id: '123e4567-e89b-12d3-a456-426614174000',
            date: '2024-01-15T10:30:00.000Z',
            amount: 50.25,
            [field]: '123e4567-e89b-12d3-a456-426614174001',
          });

          const errors = await validate(dto);
          const fieldErrors = errors.filter((err) => err.property === field);
          expect(fieldErrors).toHaveLength(0);
        });

        it('should pass when omitted', async () => {
          const dto = plainToClass(CreateTransactionDto, {
            account_id: '123e4567-e89b-12d3-a456-426614174000',
            date: '2024-01-15T10:30:00.000Z',
            amount: 50.25,
          });

          const errors = await validate(dto);
          const fieldErrors = errors.filter((err) => err.property === field);
          expect(fieldErrors).toHaveLength(0);
        });

        it('should fail with invalid UUID', async () => {
          const dto = plainToClass(CreateTransactionDto, {
            account_id: '123e4567-e89b-12d3-a456-426614174000',
            date: '2024-01-15T10:30:00.000Z',
            amount: 50.25,
            [field]: 'invalid-uuid',
          });

          const errors = await validate(dto);
          const fieldErrors = errors.filter((err) => err.property === field);
          expect(fieldErrors).toHaveLength(1);
          expect(fieldErrors[0].constraints).toHaveProperty('isUuid');
        });
      });
    });
  });

  describe('complete validation scenarios', () => {
    it('should pass with all valid fields', async () => {
      const dto = plainToClass(CreateTransactionDto, {
        account_id: '123e4567-e89b-12d3-a456-426614174000',
        date: '2024-01-15T10:30:00.000Z',
        amount: -50.25,
        merchant: 'Test Merchant',
        description: 'Test transaction description',
        category_id: '123e4567-e89b-12d3-a456-426614174001',
        owner_user_id: '123e4567-e89b-12d3-a456-426614174002',
        card_id: '123e4567-e89b-12d3-a456-426614174003',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass with minimal required fields', async () => {
      const dto = plainToClass(CreateTransactionDto, {
        account_id: '123e4567-e89b-12d3-a456-426614174000',
        date: '2024-01-15T10:30:00.000Z',
        amount: 50.25,
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail with multiple validation errors', async () => {
      const dto = plainToClass(CreateTransactionDto, {
        account_id: 'invalid-uuid',
        date: 'invalid-date',
        amount: 'not-a-number',
        merchant: 'a'.repeat(256),
        description: 'a'.repeat(1001),
        category_id: 'invalid-uuid',
        owner_user_id: 'invalid-uuid',
        card_id: 'invalid-uuid',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);

      // Check that each field has validation errors
      const fieldErrors = errors.reduce(
        (acc, error) => {
          acc[error.property] = error;
          return acc;
        },
        {} as Record<string, any>,
      );

      expect(fieldErrors).toHaveProperty('account_id');
      expect(fieldErrors).toHaveProperty('date');
      expect(fieldErrors).toHaveProperty('amount');
      expect(fieldErrors).toHaveProperty('merchant');
      expect(fieldErrors).toHaveProperty('description');
      expect(fieldErrors).toHaveProperty('category_id');
      expect(fieldErrors).toHaveProperty('owner_user_id');
      expect(fieldErrors).toHaveProperty('card_id');
    });
  });
});
