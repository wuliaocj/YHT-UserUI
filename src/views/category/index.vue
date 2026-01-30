<template>
  <div class="category">
    <!-- 顶部导航栏 -->
    <div class="top-nav">
      <router-link to="/" class="flex items-center">
        <i class="text-lg mr-2">←</i>
      </router-link>
      <h2 class="text-lg font-medium">商品分类</h2>
      <div class="w-8"></div>
    </div>

    <div class="category-content">
      <!-- 左侧分类列表 -->
      <div class="category-sidebar">
        <div 
          v-for="category in categories" 
          :key="category.id"
          class="category-item"
          :class="{ active: currentCategoryId === category.id }"
          @click="selectCategory(category.id)"
        >
          {{ category.name }}
        </div>
      </div>

      <!-- 右侧商品列表 -->
      <div class="category-products">
        <div class="products-header">
          <h3 class="text-base font-medium">{{ currentCategoryName }}</h3>
        </div>
        <div class="products-list">
          <div 
            v-for="product in filteredProducts" 
            :key="product.id"
            class="product-card"
            @click="goToProductDetail(product.id)"
          >
            <img :src="product.image" :alt="product.name">
            <div class="product-info">
              <div class="product-name">{{ product.name }}</div>
              <div class="flex items-center">
                <span class="product-price">¥{{ product.price }}</span>
                <span v-if="product.originalPrice" class="original-price">¥{{ product.originalPrice }}</span>
              </div>
              <div class="product-sales">月售{{ product.sales }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProductStore } from '@/store/modules/product'

const router = useRouter()
const productStore = useProductStore()

// 分类和商品数据
const categories = computed(() => productStore.categories)
const currentCategoryId = computed(() => productStore.currentCategoryId)
const filteredProducts = computed(() => productStore.getProductsByCategory)
const currentCategoryName = computed(() => {
  const category = categories.value.find(c => c.id === currentCategoryId.value)
  return category?.name || '全部商品'
})

// 选择分类
const selectCategory = (categoryId: number) => {
  productStore.setCurrentCategory(categoryId)
}

// 跳转到商品详情页
const goToProductDetail = (productId: number) => {
  router.push(`/product/${productId}`)
}

// 生命周期钩子
onMounted(async () => {
  await productStore.fetchCategories()
  await productStore.fetchProducts()
  // 默认选择第一个分类
  if (categories.value.length > 0 && currentCategoryId.value === 0) {
    selectCategory(categories.value[0].id)
  }
})
</script>

<style scoped>
.category {
  min-height: 100vh;
  background-color: #F5F5F5;
}

.category-content {
  display: flex;
  min-height: calc(100vh - 60px);
}

.category-sidebar {
  width: 80px;
  background-color: #fff;
  border-right: 1px solid #f0f0f0;
  overflow-y: auto;
}

.category-item {
  padding: 16px 12px;
  text-align: center;
  font-size: 14px;
  color: #333;
  border-left: 3px solid transparent;
  transition: all 0.3s ease;
}

.category-item.active {
  background-color: #F5F5F5;
  color: #00B578;
  border-left-color: #00B578;
  font-weight: 500;
}

.category-products {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
}

.products-header {
  margin-bottom: 16px;
}

.products-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

@media (min-width: 768px) {
  .category-sidebar {
    width: 100px;
  }
  
  .category-item {
    padding: 20px 16px;
    font-size: 15px;
  }
  
  .products-list {
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }
}

@media (min-width: 1024px) {
  .category-sidebar {
    width: 120px;
  }
  
  .products-list {
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }
}
</style>