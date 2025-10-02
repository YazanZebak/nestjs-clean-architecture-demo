import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { BcryptModule } from './infrastructure/services/bcrypt/bcrypty.module';
import { JwtModule as JwtServiceModule } from './infrastructure/services/jwt/jwt.module';
import { LoggerModule } from './infrastructure/services/logger/logger.module';
import { EnvironmentConfigModule } from './infrastructure/configuration/environment-config/environment-config.module';
import { ExceptionsModule } from './infrastructure/services/exceptions/exceptions.module';
import { ControllersModule } from './infrastructure/controllers/controllers.module';
import { UsecasesProxyModule } from './infrastructure/usecases-proxy/usecases-proxy.module';
import { TypeOrmConfigModule } from './infrastructure/configuration/typeorm/typeorm.module';
import { MulterConfigModule } from './infrastructure/configuration/multer-config/multer-config.module';
import { ServeStaticConfigModule } from './infrastructure/configuration/serve-static-config/serve-static-config.module';
import { StorageModule } from './infrastructure/services/storage/storage.module';
import { SeedService } from './infrastructure/common/seed/seed.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.secret,
    }),
    LoggerModule,
    ExceptionsModule,
    UsecasesProxyModule.register(),
    ControllersModule,
    BcryptModule,
    JwtServiceModule,
    EnvironmentConfigModule,
    TypeOrmConfigModule,
    ServeStaticConfigModule,
    MulterConfigModule,
    StorageModule,
  ],
  providers: [SeedService],
})
export class AppModule {}
