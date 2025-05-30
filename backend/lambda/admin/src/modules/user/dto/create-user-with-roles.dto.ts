import { IsArray, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateUserWithRolesDto {
  @IsString()
  user_name: string;

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
  @IsArray()
  @IsInt({ each: true })
  roles?: number[];
}
