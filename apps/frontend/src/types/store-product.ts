import { Product } from './product';

export interface StoreProduct {
  id: string;
  storeId: string;
  productId: string;
  stock: number;
  storePrice: number | null;
  createdAt: string;
  updatedAt: string;
  product: Product;
}

export interface PaginatedStoreProducts {
  data: StoreProduct[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

