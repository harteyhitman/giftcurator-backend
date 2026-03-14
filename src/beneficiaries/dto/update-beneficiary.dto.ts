import { IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateBeneficiaryDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  relationship?: string;

  @IsOptional()
  @IsDateString()
  dob?: string;
}
