import { defineStore } from 'pinia'
import type { CartItem } from '../../types/cart'

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
        // 模拟API请求
        // const response = await cartApi.getCart()
        // this.items = response.data
        
        // 模拟数据
        this.items = [
          {
            id: 1,
            productId: 1,
            productName: '益禾堂烤奶',
            image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=yitang milk tea with caramel, product photography, clean background&image_size=square',
            specIds: '1,2',
            specNames: '标准糖,热',
            price: 12,
            quantity: 1,
            selected: true
          },
          {
            id: 2,
            productId: 2,
            productName: '杨枝甘露',
            image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=mango pomelo sago drink, product photography, clean background&image_size=square',
            specIds: '3,4',
            specNames: '少糖,冰',
            price: 18,
            quantity: 1,
            selected: true
          }
        ]
      } catch (error) {
        this.error = '获取购物车失败'
        console.error('Failed to fetch cart:', error)
      } finally {
        this.loading = false
      }
    },
    async addToCart(product: any, specs: any[], quantity: number) {
      this.loading = true
      try {
        // 模拟API请求
        // const response = await cartApi.addToCart({
        //   productId: product.id,
        //   specIds: specs.map(spec => spec.id).join(','),
        //   quantity
        // })
        
        // 模拟添加到购物车
        const existingItem = this.items.find(item => 
          item.productId === product.id && 
          item.specIds === specs.map(spec => spec.id).join(',')
        )
        
        if (existingItem) {
          existingItem.quantity += quantity
        } else {
          const newItem: CartItem = {
            id: Date.now(),
            productId: product.id,
            productName: product.name,
            image: product.image,
            specIds: specs.map(spec => spec.id).join(','),
            specNames: specs.map(spec => spec.name).join(','),
            price: product.price,
            quantity,
            selected: true
          }
          this.items.push(newItem)
        }
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
        // 模拟API请求
        // const response = await cartApi.updateQuantity(cartId, quantity)
        
        // 模拟更新数量
        const item = this.items.find(item => item.id === cartId)
        if (item) {
          item.quantity = quantity
        }
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
        // 模拟API请求
        // const response = await cartApi.removeItem(cartId)
        
        // 模拟删除
        this.items = this.items.filter(item => item.id !== cartId)
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