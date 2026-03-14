import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateBeneficiaryDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  relationship: string;

  @IsDateString()
  dob: string;
}
