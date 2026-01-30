<template>
  <div class="order-detail">
    <!-- 顶部导航栏 -->
    <div class="top-nav">
      <router-link to="/order" class="flex items-center">
        <i class="text-lg mr-2">←</i>
      </router-link>
      <h2 class="text-lg font-medium">订单详情</h2>
      <div class="w-8"></div>
    </div>

    <!-- 订单状态 -->
    <div class="order-status-section">
      <div class="status-icon">{{ getStatusIcon(order?.status) }}</div>
      <div class="status-text">{{ order?.statusText }}</div>
      <div class="status-desc">{{ getStatusDesc(order?.status) }}</div>
    </div>

    <!-- 商品清单 -->
    <div class="product-section">
      <h3 class="section-title">商品清单</h3>
      <div 
        v-for="item in order?.orderItems" 
        :key="item.productId"
        class="product-item"
      >
        <div class="item-image">
          <img :src="item.image" :alt="item.productName">
        </div>
        <div class="item-info">
          <div class="item-name">{{ item.productName }}</div>
          <div class="item-spec">{{ item.specNames }}</div>
          <div class="item-price-quantity">
            <span class="item-price">¥{{ item.price }}</span>
            <span class="item-quantity">x{{ item.quantity }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 订单信息 -->
    <div class="info-section">
      <h3 class="section-title">订单信息</h3>
      <div class="info-item">
        <span class="info-label">订单号</span>
        <span class="info-value">{{ order?.orderNo }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">下单时间</span>
        <span class="info-value">{{ order?.createTime }}</span>
      </div>
      <div v-if="order?.payTime" class="info-item">
        <span class="info-label">支付时间</span>
        <span class="info-value">{{ order?.payTime }}</span>
      </div>
      <div v-if="order?.pickupTime" class="info-item">
        <span class="info-label">取餐时间</span>
        <span class="info-value">{{ order?.pickupTime }}</span>
      </div>
    </div>

    <!-- 收货信息 -->
    <div v-if="order?.consignee" class="address-section">
      <h3 class="section-title">收货信息</h3>
      <div class="address-info">
        <div class="consignee-info">
          <span class="consignee">{{ order?.consignee }}</span>
          <span class="phone">{{ order?.phone }}</span>
        </div>
        <div class="address">{{ order?.address }}</div>
      </div>
    </div>

    <!-- 支付信息 -->
    <div class="payment-section">
      <h3 class="section-title">支付信息</h3>
      <div class="info-item">
        <span class="info-label">支付方式</span>
        <span class="info-value">{{ order?.paymentMethod }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">商品总价</span>
        <span class="info-value">¥{{ order?.totalAmount }}</span>
      </div>
      <div v-if="order?.couponAmount" class="info-item">
        <span class="info-label">优惠金额</span>
        <span class="info-value text-secondary">-¥{{ order?.couponAmount }}</span>
      </div>
      <div class="info-item total">
        <span class="info-label">实付金额</span>
        <span class="info-value total-price">¥{{ order?.actualAmount }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useOrderStore } from '@/store/modules/order'

const route = useRoute()
const orderStore = useOrderStore()

const orderId = computed(() => Number(route.params.id))
const order = computed(() => orderStore.currentOrder)

// 获取订单状态图标
const getStatusIcon = (status?: number) => {
  switch (status) {
    case 1:
      return '⏳'
    case 2:
      return '📦'
    case 3:
      return '✅'
    case 4:
      return '❌'
    default:
      return '📋'
  }
}

// 获取订单状态描述
const getStatusDesc = (status?: number) => {
  switch (status) {
    case 1:
      return '请尽快完成支付'
    case 2:
      return '商家正在准备您的订单'
    case 3:
      return '订单已完成，感谢您的购买'
    case 4:
      return '订单已取消'
    default:
      return ''
  }
}

// 生命周期钩子
onMounted(async () => {
  await orderStore.fetchOrderDetail(orderId.value)
})
</script>

<style scoped>
.order-detail {
  min-height: 100vh;
  background-color: #F5F5F5;
}

.order-status-section {
  background-color: #00B578;
  color: #fff;
  padding: 32px 20px;
  text-align: center;
  margin-bottom: 10px;
}

.status-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.status-text {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 8px;
}

.status-desc {
  font-size: 14px;
  opacity: 0.9;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

.product-section,
.info-section,
.address-section,
.payment-section {
  background-color: #fff;
  padding: 20px;
  margin-bottom: 10px;
}

.product-item {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.item-image {
  width: 60px;
  height: 60px;
  flex-shrink: 0;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
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
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-price-quantity {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.item-price {
  color: #333;
  font-weight: 500;
}

.item-quantity {
  color: #999;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 14px;
  color: #666;
}

.info-item.total {
  margin-top: 8px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
  font-size: 16px;
}

.total-price {
  font-size: 18px;
  font-weight: 600;
  color: #FF7D00;
}

.address-info {
  font-size: 14px;
  color: #666;
}

.consignee-info {
  margin-bottom: 8px;
}

.consignee {
  font-weight: 500;
  margin-right: 16px;
}

.phone {
  color: #999;
}

.address {
  line-height: 1.4;
}

@media (min-width: 768px) {
  .order-status-section {
    padding: 40px 24px;
  }
  
  .product-section,
  .info-section,
  .address-section,
  .payment-section {
    padding: 24px;
  }
  
  .item-image {
    width: 80px;
    height: 80px;
  }
}
</style>