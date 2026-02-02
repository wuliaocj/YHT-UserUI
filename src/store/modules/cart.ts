import { defineStore } from 'pinia'
import type { CartItem } from '../../types/cart'
import { cartApi } from '../../services/api'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
    loading: false,
    error: ''
  }),
  getters: {
    totalCount: (state) => {
      return state.items.reduce((count, item) => count + item.quantity, 0)
    },
    totalAmount: (state) => {
      return state.items.reduce((amount, item) => {
        if (item.selected) {
          return amount + item.price * item.quantity
        }
        return amount
      }, 0)
    },
    selectedItems: (state) => {
      return state.items.filter(item => item.selected)
    },
    selectedCount: (state) => {
      return state.items.filter(item => item.selected).length
    }
  },
  actions: {
    async fetchCart() {
      this.loading = true
      try {
        // 使用实际API请求
        const response = await cartApi.getCart()
        this.items = response
      } catch (error) {
        this.error = '获取购物车失败'
        console.error('Failed to fetch cart:', error)
        // 失败时使用空数组
        this.items = []
      } finally {
        this.loading = false
      }
    },
    async addToCart(product: any, specs: any[], quantity: number) {
      this.loading = true
      try {
        // 使用实际API请求
        await cartApi.addToCart({
          productId: product.id,
          specIds: specs.map(spec => spec.id).join(','),
          quantity
        })
        
        // 添加成功后重新获取购物车数据
        await this.fetchCart()
      } catch (error) {
        this.error = '添加到购物车失败'
        console.error('Failed to add to cart:', error)
      } finally {
        this.loading = false
      }
    },
    async updateQuantity(cartId: number, quantity: number) {
      this.loading = true
      try {
        // 使用实际API请求
        await cartApi.updateCart({
          cartId,
          quantity
        })
        
        // 更新成功后重新获取购物车数据
        await this.fetchCart()
      } catch (error) {
        this.error = '更新数量失败'
        console.error('Failed to update quantity:', error)
      } finally {
        this.loading = false
      }
    },
    async removeItem(cartId: number) {
      this.loading = true
      try {
        // 使用实际API请求
        await cartApi.deleteCart(cartId)
        
        // 删除成功后重新获取购物车数据
        await this.fetchCart()
      } catch (error) {
        this.error = '删除商品失败'
        console.error('Failed to remove item:', error)
      } finally {
        this.loading = false
      }
    },
    toggleSelected(cartId: number) {
      const item = this.items.find(item => item.id === cartId)
      if (item) {
        item.selected = !item.selected
      }
    },
    toggleAllSelected(selected: boolean) {
      this.items.forEach(item => {
        item.selected = selected
      })
    },
    clearCart() {
      this.items = []
    }
  }
})