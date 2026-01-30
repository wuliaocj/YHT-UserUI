export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  image: string;
  specIds: string;
  specNames: string;
  price: number;
  quantity: number;
  selected: boolean;
}