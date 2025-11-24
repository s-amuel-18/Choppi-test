import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { Store } from './store.entity';
import { Product } from '../products/product.entity';
import { StoreProduct } from '../products/store-product.entity';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Store, Product, StoreProduct]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [StoreController],
  providers: [StoreService],
  exports: [StoreService],
})
export class StoreModule {}
