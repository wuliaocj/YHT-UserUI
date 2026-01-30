import http from '../http/axios'
import type { ProductItem, ProductDetail } from '../../types/product'
import type { CartItem } from '../../types/cart'
import type { OrderItem, OrderDetail } from '../../types/order'
import type { UserInfo } from '../../types/user'
import type { Address } from '../../types/address'

// 商品相关API
export const productApi = {
  // 获取商品分类
  getCategories: () => {
    return http.get('/category/list')
  },
  // 获取商品列表
  getProducts: (params: { categoryId?: number; page: number; pageSize: number }) => {
    return http.get('/product/list', { params })
  },
  // 获取商品详情
  getProductDetail: (id: number) => {
    return http.get<ProductDetail>(`/product/${id}`)
  }
}

// 购物车相关API
export const cartApi = {
  // 添加到购物车
  addToCart: (data: { productId: number; specIds: string; quantity: number }) => {
    return http.post('/cart/add', data)
  },
  // 获取购物车列表
  getCart: () => {
    return http.get<CartItem[]>('/cart/list')
  },
  // 更新购物车商品
  updateCart: (data: { cartId: number; quantity: number }) => {
    return http.put('/cart/update', data)
  },
  // 删除购物车商品
  deleteCart: (id: number) => {
    return http.delete(`/cart/delete/${id}`)
  }
}

// 订单相关API
export const orderApi = {
  // 创建订单
  createOrder: (data: {
    addressId: number;
    cartIds: number[];
    couponId?: number;
    remark?: string;
    paymentMethod: string;
  }) => {
    return http.post('/order/create', data)
  },
  // 获取订单列表
  getOrders: (params: { status?: number; page: number; pageSize: number }) => {
    return http.get<OrderItem[]>('/order/list', { params })
  },
  // 获取订单详情
  getOrderDetail: (id: number) => {
    return http.get<OrderDetail>(`/order/${id}`)
  },
  // 取消订单
  cancelOrder: (id: number) => {
    return http.put(`/order/cancel/${id}`)
  }
}

// 用户相关API
export const userApi = {
  // 登录
  login: (data: { phone: string; password: string }) => {
    return http.post('/user/login', data)
  },
  // 注册
  register: (data: { phone: string; password: string; code: string }) => {
    return http.post('/user/register', data)
  },
  // 获取用户信息
  getUserInfo: () => {
    return http.get<UserInfo>('/user/info')
  },
  // 更新用户信息
  updateUserInfo: (data: Partial<UserInfo>) => {
    return http.put('/user/update', data)
  }
}

// 地址相关API
export const addressApi = {
  // 获取地址列表
  getAddresses: () => {
    return http.get<Address[]>('/address/list')
  },
  // 新增地址
  addAddress: (data: Omit<Address, 'id'>) => {
    return http.post('/address/add', data)
  },
  // 更新地址
  updateAddress: (data: Address) => {
    return http.put('/address/update', data)
  },
  // 删除地址
  deleteAddress: (id: number) => {
    return http.delete(`/address/delete/${id}`)
  }
}

// 优惠券相关API
export const couponApi = {
  // 获取优惠券列表
  getCoupons: () => {
    return http.get('/coupon/list')
  },
  // 领取优惠券
  receiveCoupon: (id: number) => {
    return http.post(`/coupon/receive/${id}`)
  }
}