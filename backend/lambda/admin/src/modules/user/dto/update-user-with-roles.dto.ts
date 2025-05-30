import { IsOptional, IsString, IsArray, IsInt } from 'class-validator';

export class UpdateUserWithRolesDto {
  @IsOptional()
  @IsString()
  first_name?: string;

  @IsOptional()
  @IsString()
  last_name?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  user_name?: string;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  roles?: number[];
}
