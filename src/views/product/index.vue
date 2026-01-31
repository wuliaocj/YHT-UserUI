<template>
  <div class="product-detail">
    <!-- 顶部导航栏 -->
    <div class="top-nav">
      <router-link to="/" class="flex items-center">
        <i class="text-lg mr-2">←</i>
      </router-link>
      <h2 class="text-lg font-medium">商品详情</h2>
      <div class="flex items-center">
        <i class="text-lg mr-4">📤</i>
      </div>
    </div>

    <!-- 商品图片轮播 -->
    <div class="product-carousel">
      <div 
        v-for="(image, index) in productImages" 
        :key="index" 
        class="carousel-item"
        v-show="currentImageIndex === index"
      >
        <img :src="image" :alt="product?.name">
      </div>
      <div class="carousel-indicators">
        <span 
          v-for="(image, index) in productImages" 
          :key="index"
          class="w-2 h-2 rounded-full mx-1"
          :class="{ active: currentImageIndex === index }"
          @click="currentImageIndex = index"
        ></span>
      </div>
    </div>

    <!-- 商品信息 -->
    <div class="product-info">
      <h3 class="product-name">{{ product?.name }}</h3>
      <div class="product-price-section">
        <span class="product-price">¥{{ product?.price }}</span>
        <span v-if="product?.originalPrice" class="original-price">¥{{ product?.originalPrice }}</span>
        <span class="product-sales">月售{{ product?.sales }}</span>
      </div>
    </div>

    <!-- 规格选择 -->
    <div class="spec-section">
      <div class="spec-item">
        <div class="spec-label">口味</div>
        <div class="spec-options">
          <div 
            v-for="taste in product?.tasteList" 
            :key="taste.id"
            class="spec-option"
            :class="{ active: selectedTaste?.id === taste.id }"
            @click="selectTaste(taste)"
          >
            {{ taste.name }}
            <span v-if="taste.price > 0" class="spec-price">+¥{{ taste.price }}</span>
          </div>
        </div>
      </div>
      <div class="spec-item">
        <div class="spec-label">温度</div>
        <div class="spec-options">
          <div 
            v-for="temp in product?.temperatureList" 
            :key="temp.id"
            class="spec-option"
            :class="{ active: selectedTemperature?.id === temp.id }"
            @click="selectTemperature(temp)"
          >
            {{ temp.name }}
            <span v-if="temp.price > 0" class="spec-price">+¥{{ temp.price }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 商品描述 -->
    <div class="description-section">
      <h4 class="section-title">商品描述</h4>
      <div class="description-content">
        {{ product?.description }}
      </div>
    </div>

    <!-- 底部操作栏 -->
    <div class="bottom-action">
      <router-link to="/cart" class="cart-icon">
        <i class="text-xl">🛒</i>
        <span v-if="cartCount > 0" class="cart-badge">{{ cartCount }}</span>
      </router-link>
      <div class="action-buttons">
        <button class="btn-outline" @click="addToCart">加入购物车</button>
        <button class="btn-primary" @click="buyNow">立即购买</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductStore } from '@/store/modules/product'
import { useCartStore } from '@/store/modules/cart'
import type { ProductSpec } from '@/types/product'

const route = useRoute()
const router = useRouter()
const productStore = useProductStore()
const cartStore = useCartStore()

const productId = computed(() => Number(route.params.id))
const currentImageIndex = ref(0)
const selectedTaste = ref<ProductSpec | null>(null)
const selectedTemperature = ref<ProductSpec | null>(null)

// 模拟商品数据
const product = ref({
  id: productId.value,
  name: '益禾堂烤奶',
  image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=yitang milk tea with caramel, product photography, clean background&image_size=square',
  images: [
    'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=yitang milk tea with caramel, product photography, clean background&image_size=square',
    'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=milk tea with tapioca pearls, close up, product photography&image_size=square',
    'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=tea shop interior, cozy atmosphere, milk tea display&image_size=square'
  ],
  price: 12,
  originalPrice: 15,
  sales: 1234,
  categoryId: 1,
  categoryName: '奶茶',
  description: '益禾堂招牌烤奶，采用优质茶叶和新鲜牛奶，加入焦糖风味，口感醇厚，香气四溢，是店内的畅销产品之一。',
  tasteList: [
    { id: 1, productId: productId.value, type: 'taste', name: '标准糖', price: 0, status: 1 },
    { id: 2, productId: productId.value, type: 'taste', name: '少糖', price: 0, status: 1 },
    { id: 3, productId: productId.value, type: 'taste', name: '无糖', price: 0, status: 1 },
    { id: 4, productId: productId.value, type: 'taste', name: '多糖', price: 0, status: 1 }
  ],
  temperatureList: [
    { id: 5, productId: productId.value, type: 'temperature', name: '热', price: 0, status: 1 },
    { id: 6, productId: productId.value, type: 'temperature', name: '温', price: 0, status: 1 },
    { id: 7, productId: productId.value, type: 'temperature', name: '冰', price: 0, status: 1 },
    { id: 8, productId: productId.value, type: 'temperature', name: '少冰', price: 0, status: 1 }
  ],
  status: 1
})

const productImages = computed(() => product.value.images || [product.value.image])
const cartCount = computed(() => cartStore.totalCount)

// 选择口味
const selectTaste = (taste: ProductSpec) => {
  selectedTaste.value = taste
}

// 选择温度
const selectTemperature = (temp: ProductSpec) => {
  selectedTemperature.value = temp
}

// 加入购物车
const addToCart = async () => {
  if (!product.value) return
  
  const selectedSpecs = []
  if (selectedTaste.value) selectedSpecs.push(selectedTaste.value)
  if (selectedTemperature.value) selectedSpecs.push(selectedTemperature.value)

  
  await cartStore.addToCart(product.value, selectedSpecs, 1)
  // 显示成功提示
  alert('加入购物车成功！')
}

// 立即购买
const buyNow = async () => {
  if (!product.value) return
  
  const selectedSpecs = []
  if (selectedTaste.value) selectedSpecs.push(selectedTaste.value as never)
  if (selectedTemperature.value) selectedSpecs.push(selectedTemperature.value as never)
  
  await cartStore.addToCart(product.value, selectedSpecs, 1)
  router.push('/cart')
}

// 生命周期钩子
onMounted(async () => {
  await cartStore.fetchCart()
  // 默认选择第一个口味和温度
  if (product.value.tasteList && product.value.tasteList.length > 0) {
    selectedTaste.value = product.value.tasteList[0]
  }
  if (product.value.temperatureList && product.value.temperatureList.length > 0) {
    selectedTemperature.value = product.value.temperatureList[0]
  }
})
</script>

<style scoped>
.product-detail {
  min-height: 100vh;
  padding-bottom: 80px;
  background-color: #F5F5F5;
}

.product-carousel {
  position: relative;
  width: 100%;
  height: 300px;
  background-color: #fff;
}

.carousel-item {
  width: 100%;
  height: 100%;
}

.carousel-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.carousel-indicators {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
}

.carousel-indicators span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.3);
  margin: 0 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.carousel-indicators span.active {
  background-color: #00B578;
  width: 16px;
  border-radius: 3px;
}

.product-info {
  background-color: #fff;
  padding: 16px;
  margin-bottom: 10px;
}

.product-name {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #333;
}

.product-price-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.product-price {
  font-size: 20px;
  font-weight: 700;
  color: #FF7D00;
}

.original-price {
  font-size: 14px;
  color: #999;
  text-decoration: line-through;
}

.product-sales {
  font-size: 12px;
  color: #999;
}

.spec-section {
  background-color: #fff;
  padding: 16px;
  margin-bottom: 10px;
}

.spec-item {
  margin-bottom: 16px;
}

.spec-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
}

.spec-options {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.spec-option {
  padding: 8px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 4px;
}

.spec-option.active {
  border-color: #00B578;
  color: #00B578;
  background-color: rgba(0, 181, 120, 0.05);
}

.spec-price {
  font-size: 12px;
  color: #FF7D00;
}

.description-section {
  background-color: #fff;
  padding: 16px;
  margin-bottom: 10px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #333;
}

.description-content {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

.bottom-action {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  border-top: 1px solid #f0f0f0;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 100;
}

.cart-icon {
  position: relative;
  padding: 8px;
}

.action-buttons {
  flex: 1;
  display: flex;
  gap: 12px;
}

.action-buttons button {
  flex: 1;
  padding: 10px 0;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-outline {
  border: 1px solid #00B578;
  color: #00B578;
  background-color: transparent;
}

.btn-outline:hover {
  background-color: rgba(0, 181, 120, 0.05);
}

.btn-primary {
  background-color: #00B578;
  color: #fff;
  border: none;
}

.btn-primary:hover {
  background-color: rgba(0, 181, 120, 0.9);
}

@media (min-width: 768px) {
  .product-carousel {
    height: 400px;
  }
  
  .product-info {
    padding: 20px;
  }
  
  .spec-section {
    padding: 20px;
  }
  
  .description-section {
    padding: 20px;
  }
}
</style>