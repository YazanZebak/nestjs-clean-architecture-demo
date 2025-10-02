export interface IFormatExceptionMessage {
  message: string;
  errorCode?: number;
}

export interface IException {
  badRequestException(data: IFormatExceptionMessage): void;
  internalServerErrorException(data?: IFormatExceptionMessage): void;
  forbiddenException(data?: IFormatExceptionMessage): void;
  UnauthorizedException(data?: IFormatExceptionMessage): void;
  UnsupportedMediaTypeException(data?: IFormatExceptionMessage): void;
  NotAcceptableException(data?: IFormatExceptionMessage): void;
  NotFoundException(data?: IFormatExceptionMessage): void;
}
