import { IsIn, IsOptional } from 'class-validator';
import { userTypes } from '../user.schema';

export class FindUserQueryParamsDto {
  @IsOptional()
  @IsIn(Object.values(userTypes), {
    message: 'Type must be either "admin" or "customer"',
  })
  type?: userTypes;
}
