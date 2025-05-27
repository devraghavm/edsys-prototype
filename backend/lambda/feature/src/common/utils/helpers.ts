import { HttpException, HttpStatus } from '@nestjs/common';

export const createCustomError = (message: string, status: HttpStatus) => {
  throw new HttpException(message, status);
};
