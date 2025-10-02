import { Injectable } from '@nestjs/common';
import {
  ServeStaticModuleOptions,
  ServeStaticModuleOptionsFactory,
} from '@nestjs/serve-static';
import { StorageService } from 'src/infrastructure/services/storage/storage.service';

@Injectable()
export class ServeStaticConfigService
  implements ServeStaticModuleOptionsFactory
{
  constructor(private storageService: StorageService) {}

  createLoggerOptions():
    | ServeStaticModuleOptions[]
    | Promise<ServeStaticModuleOptions[]> {
    const dir = this.storageService.getMediaDirectoryPath();
    return [
      {
        rootPath: dir,
        serveRoot: `/public`,
      },
    ];
  }
}
