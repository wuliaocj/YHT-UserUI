<template>
  <div class="cart">
    <!-- 顶部导航栏 -->
    <div class="top-nav">
      <router-link to="/" class="flex items-center">
        <i class="text-lg mr-2">←</i>
      </router-link>
      <h2 class="text-lg font-medium">购物车</h2>
      <button class="text-base font-medium" @click="toggleEditMode">
        {{ editMode ? '完成' : '编辑' }}
      </button>
    </div>

    <!-- 购物车商品列表 -->
    <div v-if="cartItems.length > 0" class="cart-list">
      <div 
        v-for="item in cartItems" 
        :key="item.id"
        class="cart-item"
      >
        <div class="item-select">
          <input 
            type="checkbox" 
            :checked="item.selected" 
            @change="toggleItemSelected(item.id)"
            class="w-5 h-5 text-primary"
          >
        </div>
        <div class="item-image">
          <img :src="item.image" :alt="item.productName">
        </div>
        <div class="item-info">
          <div class="item-name">{{ item.productName }}</div>
          <div class="item-spec">{{ item.specNames }}</div>
          <div class="item-price-section">
            <span class="item-price">¥{{ item.price }}</span>
            <div class="item-quantity">
              <button 
                class="quantity-btn" 
                @click="updateQuantity(item.id, item.quantity - 1)"
                :disabled="item.quantity <= 1"
              >-
              </button>
              <span class="quantity-input">{{ item.quantity }}</span>
              <button 
                class="quantity-btn" 
                @click="updateQuantity(item.id, item.quantity + 1)"
              >+
              </button>
            </div>
          </div>
        </div>
        <div v-if="editMode" class="item-delete">
          <button class="delete-btn" @click="deleteItem(item.id)">
            🗑️
          </button>
        </div>
      </div>
    </div>

    <!-- 空购物车 -->
    <div v-else class="empty-cart">
      <div class="empty-icon">🛒</div>
      <div class="empty-text">购物车是空的</div>
      <router-link to="/" class="btn-primary mt-4">去逛逛</router-link>
    </div>

    <!-- 优惠券选择 -->
    <div v-if="cartItems.length > 0" class="coupon-section">
      <div class="coupon-header">
        <span class="coupon-title">优惠券</span>
        <div class="coupon-select">
          <span v-if="selectedCoupon">已选择优惠券</span>
          <span v-else>请选择优惠券</span>
          <i class="text-gray-400 ml-2">→</i>
        </div>
      </div>
    </div>

    <!-- 合计区域 -->
    <div v-if="cartItems.length > 0" class="total-section">
      <div class="total-item">
        <span>商品总价</span>
        <span>¥{{ totalAmount.toFixed(2) }}</span>
      </div>
      <div class="total-item">
        <span>优惠金额</span>
        <span class="text-secondary">-¥{{ discountAmount.toFixed(2) }}</span>
      </div>
      <div class="total-item total-amount">
        <span class="font-medium">实付金额</span>
        <span class="font-bold text-secondary text-lg">¥{{ (totalAmount - discountAmount).toFixed(2) }}</span>
      </div>
    </div>

    <!-- 底部操作栏 -->
    <div v-if="cartItems.length > 0" class="bottom-action">
      <div class="select-all">
        <input 
          type="checkbox" 
          :checked="isAllSelected" 
          @change="toggleAllSelected"
          class="w-5 h-5 text-primary"
        >
        <span>全选</span>
      </div>
      <div class="action-buttons">
        <router-link to="/" class="btn-outline">继续购物</router-link>
        <button 
          class="btn-primary" 
          @click="checkout"
          :disabled="selectedCount === 0"
        >
          结算({{ selectedCount }})
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/store/modules/cart'

const router = useRouter()
const cartStore = useCartStore()

const editMode = ref(false)
const selectedCoupon = ref(null)
const discountAmount = ref(0)

const cartItems = computed(() => cartStore.items)
const totalAmount = computed(() => cartStore.totalAmount)
const selectedCount = computed(() => cartStore.selectedCount)
const isAllSelected = computed(() => {
  if (cartItems.value.length === 0) return false
  return cartItems.value.every(item => item.selected)
})

// 切换编辑模式
const toggleEditMode = () => {
  editMode.value = !editMode.value
}

// 切换商品选中状态
const toggleItemSelected = (cartId: number) => {
  cartStore.toggleSelected(cartId)
}

// 切换全选状态
const toggleAllSelected = () => {
  cartStore.toggleAllSelected(!isAllSelected.value)
}

// 更新商品数量
const updateQuantity = async (cartId: number, quantity: number) => {
  if (quantity < 1) return
  await cartStore.updateQuantity(cartId, quantity)
}

// 删除商品
const deleteItem = async (cartId: number) => {
  await cartStore.removeItem(cartId)
}

// 结算
const checkout = () => {
  if (selectedCount.value === 0) return
  // 跳转到订单确认页
  router.push('/order')
}

// 生命周期钩子
onMounted(async () => {
  await cartStore.fetchCart()
})
</script>

<style scoped>
.cart {
  min-height: 100vh;
  background-color: #F5F5F5;
  padding-bottom: 80px;
}

.cart-list {
  background-color: #fff;
  margin-bottom: 10px;
}

.cart-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.item-select {
  margin-right: 12px;
}

.item-image {
  width: 80px;
  height: 80px;
  margin-right: 12px;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-spec {
  font-size: 12px;
  color: #999;
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-price-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-price {
  font-size: 16px;
  font-weight: 600;
  color: #FF7D00;
}

.item-quantity {
  display: flex;
  align-items: center;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}

.quantity-btn {
  width: 28px;
  height: 28px;
  border: none;
  background-color: #f5f5f5;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.quantity-btn:disabled {
  color: #ccc;
  cursor: not-allowed;
}

.quantity-input {
  width: 36px;
  text-align: center;
  font-size: 14px;
}

.item-delete {
  margin-left: 12px;
}

.delete-btn {
  border: none;
  background: none;
  font-size: 16px;
  cursor: pointer;
  color: #999;
  transition: color 0.3s ease;
}

.delete-btn:hover {
  color: #ff4d4f;
}

.empty-cart {
  min-height: calc(100vh - 60px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  color: #ccc;
}

.empty-text {
  font-size: 16px;
  color: #999;
  margin-bottom: 24px;
}

.coupon-section {
  background-color: #fff;
  padding: 16px;
  margin-bottom: 10px;
}

.coupon-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.coupon-title {
  font-size: 14px;
  color: #333;
}

.coupon-select {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #666;
  cursor: pointer;
}

.total-section {
  background-color: #fff;
  padding: 16px;
  margin-bottom: 10px;
}

.total-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 14px;
  color: #666;
}

.total-item.total-amount {
  margin-top: 8px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
  font-size: 16px;
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

.select-all {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #333;
}

.action-buttons {
  flex: 1;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.action-buttons button,
.action-buttons a {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-outline {
  border: 1px solid #00B578;
  color: #00B578;
  background-color: transparent;
  text-decoration: none;
}

.btn-outline:hover {
  background-color: rgba(0, 181, 120, 0.05);
}

.btn-primary {
  border: none;
  background-color: #00B578;
  color: #fff;
  cursor: pointer;
}

.btn-primary:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.btn-primary:hover:not(:disabled) {
  background-color: rgba(0, 181, 120, 0.9);
}

@media (min-width: 768px) {
  .cart-item {
    padding: 20px;
  }
  
  .item-image {
    width: 100px;
    height: 100px;
  }
  
  .coupon-section,
  .total-section {
    padding: 20px;
  }
  
  .bottom-action {
    padding: 16px 20px;
  }
}
</style>