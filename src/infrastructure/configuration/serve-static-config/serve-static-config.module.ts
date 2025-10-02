import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ServeStaticConfigService } from './serve-static-config.service';

@Module({
  imports: [
    ServeStaticModule.forRootAsync({ useClass: ServeStaticConfigService }),
  ],
})
export class ServeStaticConfigModule {}
