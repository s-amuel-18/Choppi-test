import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { UserModule } from './components/user/user.module';
import { AuthModule } from './components/auth/auth.module';
import { StoreModule } from './components/store/store.module';
import { ProductsModule } from './components/products/products.module';

@Module({
  imports: [AppConfigModule, DatabaseModule, UserModule, AuthModule, StoreModule, ProductsModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}
