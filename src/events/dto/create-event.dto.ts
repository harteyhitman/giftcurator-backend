import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsDateString()
  date: string;

  @IsString()
  @IsNotEmpty()
  beneficiaryId: string;
}
