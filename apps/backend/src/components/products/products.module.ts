import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { Product } from './product.entity';
import { StoreProduct } from './store-product.entity';
import { Store } from '../store/store.entity';
import { ProductsService } from './products.service';
import {
  ProductsController,
  StoreProductsController,
} from './products.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, StoreProduct, Store]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [ProductsController, StoreProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
