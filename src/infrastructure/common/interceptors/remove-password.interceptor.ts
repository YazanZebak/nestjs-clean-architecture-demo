import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class RemovePasswordInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(map((data) => this.removePasswordFromResponse(data)));
  }

  private removePasswordFromResponse(data: any): any {
    if (Array.isArray(data)) {
      return data.map((item) => this.removePasswordFromResponse(item));
    } else if (data && typeof data === 'object') {
      const newData = { ...data };

      Object.keys(newData).forEach((key) => {
        if (key === 'password') {
          delete newData[key];
        } else if (
          typeof newData[key] === 'object' &&
          !(newData[key] instanceof Date)
        ) {
          newData[key] = this.removePasswordFromResponse(newData[key]);
        }
      });
      return newData;
    }
    return data;
  }
}
