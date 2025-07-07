import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsUUID,
  IsDateString,
  MaxLength,
  Matches,
  Min,
  Max,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateTransactionDto {
  @IsNotEmpty({ message: 'Account ID is required' })
  @IsUUID('all', { message: 'Account ID must be a valid UUID' })
  account_id: string;

  @IsNotEmpty({ message: 'Date is required' })
  @IsDateString({}, { message: 'Date must be a valid ISO date string' })
  @Matches(/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?)?$/, {
    message:
      'Date must be in valid ISO format (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss.sssZ)',
  })
  date: string;

  @IsNotEmpty({ message: 'Amount is required' })
  @IsNumber(
    { allowNaN: false, allowInfinity: false, maxDecimalPlaces: 2 },
    { message: 'Amount must be a valid number with up to 2 decimal places' },
  )
  @Min(-999999.99, { message: 'Amount cannot be less than -999999.99' })
  @Max(999999.99, { message: 'Amount cannot be greater than 999999.99' })
  @Transform(({ value }: { value: unknown }) => {
    if (typeof value === 'string') {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? value : parsed;
    }
    return value;
  })
  amount: number;

  @IsOptional()
  @IsString({ message: 'Merchant must be a string' })
  @MaxLength(255, { message: 'Merchant name cannot exceed 255 characters' })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  merchant?: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @MaxLength(1000, { message: 'Description cannot exceed 1000 characters' })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  description?: string;

  @IsOptional()
  @IsUUID('all', { message: 'Category ID must be a valid UUID' })
  category_id?: string;

  @IsOptional()
  @IsUUID('all', { message: 'Owner User ID must be a valid UUID' })
  owner_user_id?: string;

  @IsOptional()
  @IsUUID('all', { message: 'Card ID must be a valid UUID' })
  card_id?: string;
}
