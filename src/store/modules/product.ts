import { defineStore } from 'pinia'
import type { ProductItem, ProductDetail, ProductSpec } from '../../types/product'

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [] as ProductItem[],
    categories: [] as Array<{
      id: number
      name: string
      icon: string
    }>,
    currentCategoryId: 0,
    loading: false,
    error: ''
  }),
  getters: {
    getProductsByCategory: (state) => {
      if (state.currentCategoryId === 0) {
        return state.products
      }
      return state.products.filter(product => product.categoryId === state.currentCategoryId)
    },
    getCategoryById: (state) => (id: number) => {
      return state.categories.find(category => category.id === id)
    }
  },
  actions: {
    async fetchCategories() {
      this.loading = true
      try {
        // 模拟API请求
        // const response = await productApi.getCategories()
        // this.categories = response.data
        
        // 模拟数据
        this.categories = [
          { id: 1, name: '奶茶', icon: '🍵' },
          { id: 2, name: '果茶', icon: '🍹' },
          { id: 3, name: '咖啡', icon: '☕' },
          { id: 4, name: '小吃', icon: '🍟' },
          { id: 5, name: '套餐', icon: '🍱' }
        ]
      } catch (error) {
        this.error = '获取分类失败'
        console.error('Failed to fetch categories:', error)
      } finally {
        this.loading = false
      }
    },
    async fetchProducts(categoryId?: number) {
      this.loading = true
      try {
        // 模拟API请求
        // const response = await productApi.getProducts({ categoryId })
        // this.products = response.data
        
        // 模拟数据
        this.products = [
          {
            id: 1,
            name: '益禾堂烤奶',
            image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=yitang milk tea with caramel, product photography, clean background&image_size=square',
            price: 12,
            originalPrice: 15,
            sales: 1234,
            categoryId: 1,
            categoryName: '奶茶',
            status: 1
          },
          {
            id: 2,
            name: '杨枝甘露',
            image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=mango pomelo sago drink, product photography, clean background&image_size=square',
            price: 18,
            sales: 987,
            categoryId: 2,
            categoryName: '果茶',
            status: 1
          },
          {
            id: 3,
            name: '美式咖啡',
            image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=americano coffee, product photography, clean background&image_size=square',
            price: 15,
            originalPrice: 18,
            sales: 567,
            categoryId: 3,
            categoryName: '咖啡',
            status: 1
          },
          {
            id: 4,
            name: '鸡米花',
            image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=popcorn chicken, product photography, clean background&image_size=square',
            price: 10,
            sales: 789,
            categoryId: 4,
            categoryName: '小吃',
            status: 1
          },
          {
            id: 5,
            name: '烤奶套餐',
            image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=milk tea set with popcorn chicken, product photography, clean background&image_size=square',
            price: 20,
            originalPrice: 25,
            sales: 456,
            categoryId: 5,
            categoryName: '套餐',
            status: 1
          },
          {
            id: 6,
            name: '珍珠奶茶',
            image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=bubble milk tea, product photography, clean background&image_size=square',
            price: 13,
            sales: 1023,
            categoryId: 1,
            categoryName: '奶茶',
            status: 1
          }
        ]
      } catch (error) {
        this.error = '获取商品失败'
        console.error('Failed to fetch products:', error)
      } finally {
        this.loading = false
      }
    },
    setCurrentCategory(id: number) {
      this.currentCategoryId = id
    }
  }
})