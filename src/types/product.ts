export interface ProductItem {
  id: number;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  sales: number;
  categoryId: number;
  categoryName: string;
  status: number;
}

export interface ProductDetail {
  id: number;
  name: string;
  image: string;
  images: string[];
  price: number;
  originalPrice?: number;
  sales: number;
  categoryId: number;
  categoryName: string;
  description: string;
  tasteList?: ProductSpec[];
  temperatureList?: ProductSpec[];
  status: number;
}

export interface ProductSpec {
  id: number;
  productId: number;
  type: string;
  name: string;
  price: number;
  status: number;
}