<template>
  <div class="home">
    <!-- 顶部导航栏 -->
    <div class="top-nav">
      <div class="flex items-center">
        <h1 class="text-xl font-bold text-primary">益禾堂</h1>
      </div>
      <div class="flex items-center space-x-4">
        <div class="relative w-48">
          <input 
            type="text" 
            placeholder="搜索商品" 
            class="w-full px-3 py-1 bg-light rounded-full text-sm focus:outline-none"
          >
          <i class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</i>
        </div>
        <router-link to="/cart" class="relative">
          <i class="text-xl">🛒</i>
          <span v-if="cartCount > 0" class="cart-badge">{{ cartCount }}</span>
        </router-link>
      </div>
    </div>

    <!-- 轮播图区域 -->
    <div class="carousel">
      <div 
        v-for="(item, index) in carouselItems" 
        :key="index" 
        class="carousel-item"
        :class="{ active: currentSlide === index }"
        v-show="currentSlide === index"
      >
        <img :src="item.image" :alt="item.title">
      </div>
      <div class="carousel-indicators">
        <span 
          v-for="(item, index) in carouselItems" 
          :key="index"
          class="w-2 h-2 rounded-full mx-1"
          :class="{ active: currentSlide === index }"
          @click="currentSlide = index"
        ></span>
      </div>
    </div>

    <!-- 分类导航 -->
    <div class="category-nav">
      <div 
        v-for="category in categories" 
        :key="category.id"
        class="category-item"
        :class="{ active: currentCategoryId === category.id }"
        @click="selectCategory(category.id)"
      >
        <div class="category-icon">{{ category.icon }}</div>
        <div class="category-name">{{ category.name }}</div>
      </div>
    </div>

    <!-- 商品列表 -->
    <div class="product-list">
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

    <!-- 底部导航栏 -->
    <div class="bottom-nav">
      <router-link to="/" class="nav-item active">
        <i class="nav-icon">🏠</i>
        <span class="nav-text">首页</span>
      </router-link>
      <router-link to="/category" class="nav-item">
        <i class="nav-icon">📋</i>
        <span class="nav-text">分类</span>
      </router-link>
      <router-link to="/cart" class="nav-item">
        <i class="nav-icon">🛒</i>
        <span class="nav-text">购物车</span>
      </router-link>
      <router-link to="/profile" class="nav-item">
        <i class="nav-icon">👤</i>
        <span class="nav-text">我的</span>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProductStore } from '@/store/modules/product'
import { useCartStore } from '@/store/modules/cart'

const router = useRouter()
const productStore = useProductStore()
const cartStore = useCartStore()

// 轮播图数据
const carouselItems = [
  {
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=milk tea promotion banner, vibrant, attractive, clean design&image_size=landscape_16_9',
    title: '新品上市'
  },
  {
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=tea shop discount banner, summer theme, refreshing&image_size=landscape_16_9',
    title: '夏日促销'
  },
  {
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=loyalty program banner, rewards, customer appreciation&image_size=landscape_16_9',
    title: '会员福利'
  }
]

const currentSlide = ref(0)
let slideInterval: number | null = null

// 轮播图自动播放
const startCarousel = () => {
  slideInterval = window.setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % carouselItems.length
  }, 3000)
}

const stopCarousel = () => {
  if (slideInterval) {
    clearInterval(slideInterval)
    slideInterval = null
  }
}

// 分类和商品数据
const categories = computed(() => productStore.categories)
const currentCategoryId = computed(() => productStore.currentCategoryId)
const filteredProducts = computed(() => productStore.getProductsByCategory)
const cartCount = computed(() => cartStore.totalCount)

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
  startCarousel()
  await productStore.fetchCategories()
  await productStore.fetchProducts()
  await cartStore.fetchCart()
})

onUnmounted(() => {
  stopCarousel()
})
</script>

<style scoped>
.home {
  min-height: 100vh;
  padding-bottom: 60px;
}

.carousel {
  position: relative;
  width: 100%;
  height: 180px;
  overflow: hidden;
}

.carousel-item {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: opacity 0.5s ease;
}

.carousel-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.carousel-indicators {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
}

.carousel-indicators span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.5);
  margin: 0 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.carousel-indicators span.active {
  background-color: #fff;
  width: 16px;
  border-radius: 3px;
}

.product-list {
  padding: 10px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

@media (min-width: 768px) {
  .product-list {
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
  }
}

@media (min-width: 1024px) {
  .product-list {
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }
}
</style>