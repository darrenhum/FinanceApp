import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsUUID,
  IsDateString,
} from 'class-validator';

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsUUID()
  account_id: string;

  @IsNotEmpty()
  @IsDateString()
  date: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsOptional()
  @IsString()
  merchant?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUUID()
  category_id?: string;

  @IsOptional()
  @IsUUID()
  owner_user_id?: string;

  @IsOptional()
  @IsUUID()
  card_id?: string;
}
