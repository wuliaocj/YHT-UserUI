export interface OrderItem {
  id: number;
  orderNo: string;
  totalAmount: number;
  actualAmount: number;
  status: number;
  statusText: string;
  createTime: string;
  productCount: number;
}

export interface OrderDetail {
  id: number;
  orderNo: string;
  totalAmount: number;
  actualAmount: number;
  couponAmount?: number;
  status: number;
  statusText: string;
  createTime: string;
  payTime?: string;
  pickupTime?: string;
  addressId?: number;
  consignee?: string;
  phone?: string;
  address?: string;
  paymentMethod?: string;
  remark?: string;
  orderItems: OrderProduct[];
}

export interface OrderProduct {
  productId: number;
  productName: string;
  image: string;
  specNames: string;
  price: number;
  quantity: number;
}