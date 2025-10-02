import { Global, Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from './multer-config.service';
import { StorageModule } from 'src/infrastructure/services/storage/storage.module';

@Module({
  imports: [
    StorageModule,
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
  ],
  exports: [MulterModule],
})
export class MulterConfigModule {}
