import { defineStore } from 'pinia'
import type { OrderItem, OrderDetail } from '../../types/order'

export const useOrderStore = defineStore('order', {
  state: () => ({
    orders: [] as OrderItem[],
    currentOrder: null as OrderDetail | null,
    loading: false,
    error: '',
    currentStatus: 0 // 0: 全部, 1: 待付款, 2: 待取餐, 3: 已完成, 4: 已取消
  }),
  getters: {
    filteredOrders: (state) => {
      if (state.currentStatus === 0) {
        return state.orders
      }
      return state.orders.filter(order => order.status === state.currentStatus)
    }
  },
  actions: {
    async fetchOrders(status?: number) {
      this.loading = true
      try {
        // 模拟API请求
        // const response = await orderApi.getOrders({ status })
        // this.orders = response.data
        
        // 模拟数据
        this.orders = [
          {
            id: 1,
            orderNo: '202601290001',
            totalAmount: 30,
            actualAmount: 28,
            status: 3,
            statusText: '已完成',
            createTime: '2026-01-29 10:00:00',
            productCount: 2
          },
          {
            id: 2,
            orderNo: '202601290002',
            totalAmount: 18,
            actualAmount: 18,
            status: 2,
            statusText: '待取餐',
            createTime: '2026-01-29 11:30:00',
            productCount: 1
          },
          {
            id: 3,
            orderNo: '202601290003',
            totalAmount: 25,
            actualAmount: 25,
            status: 1,
            statusText: '待付款',
            createTime: '2026-01-29 12:00:00',
            productCount: 2
          }
        ]
      } catch (error) {
        this.error = '获取订单失败'
        console.error('Failed to fetch orders:', error)
      } finally {
        this.loading = false
      }
    },
    async fetchOrderDetail(orderId: number) {
      this.loading = true
      try {
        // 模拟API请求
        // const response = await orderApi.getOrderDetail(orderId)
        // this.currentOrder = response.data
        
        // 模拟数据
        this.currentOrder = {
          id: orderId,
          orderNo: '202601290001',
          totalAmount: 30,
          actualAmount: 28,
          couponAmount: 2,
          status: 3,
          statusText: '已完成',
          createTime: '2026-01-29 10:00:00',
          payTime: '2026-01-29 10:01:00',
          pickupTime: '2026-01-29 10:15:00',
          addressId: 1,
          consignee: '张三',
          phone: '13800138000',
          address: '北京市朝阳区某某街道123号',
          paymentMethod: '微信支付',
          remark: '少糖',
          orderItems: [
            {
              productId: 1,
              productName: '益禾堂烤奶',
              image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=yitang milk tea with caramel, product photography, clean background&image_size=square',
              specNames: '标准糖,热',
              price: 12,
              quantity: 1
            },
            {
              productId: 2,
              productName: '杨枝甘露',
              image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=mango pomelo sago drink, product photography, clean background&image_size=square',
              specNames: '少糖,冰',
              price: 18,
              quantity: 1
            }
          ]
        }
      } catch (error) {
        this.error = '获取订单详情失败'
        console.error('Failed to fetch order detail:', error)
      } finally {
        this.loading = false
      }
    },
    async createOrder(orderData: any) {
      this.loading = true
      try {
        // 模拟API请求
        // const response = await orderApi.createOrder(orderData)
        // return response.data
        
        // 模拟创建订单
        const newOrder: OrderItem = {
          id: Date.now(),
          orderNo: `20260129${String(Date.now()).slice(-4)}`,
          totalAmount: orderData.totalAmount,
          actualAmount: orderData.actualAmount,
          status: 1,
          statusText: '待付款',
          createTime: new Date().toISOString(),
          productCount: orderData.productCount
        }
        this.orders.unshift(newOrder)
        return newOrder
      } catch (error) {
        this.error = '创建订单失败'
        console.error('Failed to create order:', error)
        throw error
      } finally {
        this.loading = false
      }
    },
    async cancelOrder(orderId: number) {
      this.loading = true
      try {
        // 模拟API请求
        // const response = await orderApi.cancelOrder(orderId)
        
        // 模拟取消订单
        const order = this.orders.find(order => order.id === orderId)
        if (order) {
          order.status = 4
          order.statusText = '已取消'
        }
      } catch (error) {
        this.error = '取消订单失败'
        console.error('Failed to cancel order:', error)
      } finally {
        this.loading = false
      }
    },
    setCurrentStatus(status: number) {
      this.currentStatus = status
    }
  }
})