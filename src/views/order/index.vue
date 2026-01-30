<template>
  <div class="order-list">
    <!-- 顶部导航栏 -->
    <div class="top-nav">
      <router-link to="/" class="flex items-center">
        <i class="text-lg mr-2">←</i>
      </router-link>
      <h2 class="text-lg font-medium">我的订单</h2>
      <div class="w-8"></div>
    </div>

    <!-- 订单状态筛选 -->
    <div class="order-status-filter">
      <div 
        v-for="status in statusList" 
        :key="status.value"
        class="filter-item"
        :class="{ active: currentStatus === status.value }"
        @click="selectStatus(status.value)"
      >
        {{ status.label }}
      </div>
    </div>

    <!-- 订单列表 -->
    <div v-if="orders.length > 0" class="orders-container">
      <div 
        v-for="order in filteredOrders" 
        :key="order.id"
        class="order-card"
      >
        <div class="order-header">
          <span class="order-no">订单号：{{ order.orderNo }}</span>
          <span 
            class="order-status"
            :class="getStatusClass(order.status)"
          >
            {{ order.statusText }}
          </span>
        </div>
        <div class="order-content">
          <div 
            v-for="(item, index) in order.items" 
            :key="index"
            class="order-item"
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
        <div class="order-footer">
          <div class="order-total">
            共{{ order.productCount }}件商品，合计：
            <span class="total-price">¥{{ order.actualAmount }}</span>
          </div>
          <div class="order-actions">
            <button 
              v-if="order.status === 1" 
              class="action-btn secondary"
              @click="cancelOrder(order.id)"
            >
              取消订单
            </button>
            <button 
              v-if="order.status === 1" 
              class="action-btn primary"
              @click="payOrder(order.id)"
            >
              立即支付
            </button>
            <button 
              v-if="order.status === 2" 
              class="action-btn primary"
              @click="pickupOrder(order.id)"
            >
              确认取餐
            </button>
            <button 
              class="action-btn outline"
              @click="viewOrderDetail(order.id)"
            >
              查看详情
            </button>
            <button 
              class="action-btn outline"
              @click="buyAgain(order.id)"
            >
              再次购买
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 空订单状态 -->
    <div v-else class="empty-orders">
      <div class="empty-icon">📋</div>
      <div class="empty-text">暂无订单</div>
      <router-link to="/" class="btn-primary mt-4">去点餐</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useOrderStore } from '@/store/modules/order'

const router = useRouter()
const orderStore = useOrderStore()

const currentStatus = ref(0)

const statusList = [
  { value: 0, label: '全部' },
  { value: 1, label: '待付款' },
  { value: 2, label: '待取餐' },
  { value: 3, label: '已完成' },
  { value: 4, label: '已取消' }
]

// 模拟订单数据
const orders = ref([
  {
    id: 1,
    orderNo: '202601290001',
    totalAmount: 30,
    actualAmount: 28,
    status: 3,
    statusText: '已完成',
    createTime: '2026-01-29 10:00:00',
    productCount: 2,
    items: [
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
  },
  {
    id: 2,
    orderNo: '202601290002',
    totalAmount: 18,
    actualAmount: 18,
    status: 2,
    statusText: '待取餐',
    createTime: '2026-01-29 11:30:00',
    productCount: 1,
    items: [
      {
        productId: 2,
        productName: '杨枝甘露',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=mango pomelo sago drink, product photography, clean background&image_size=square',
        specNames: '少糖,冰',
        price: 18,
        quantity: 1
      }
    ]
  },
  {
    id: 3,
    orderNo: '202601290003',
    totalAmount: 25,
    actualAmount: 25,
    status: 1,
    statusText: '待付款',
    createTime: '2026-01-29 12:00:00',
    productCount: 2,
    items: [
      {
        productId: 1,
        productName: '益禾堂烤奶',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=yitang milk tea with caramel, product photography, clean background&image_size=square',
        specNames: '标准糖,热',
        price: 12,
        quantity: 1
      },
      {
        productId: 4,
        productName: '鸡米花',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=popcorn chicken, product photography, clean background&image_size=square',
        specNames: '中份',
        price: 13,
        quantity: 1
      }
    ]
  }
])

const filteredOrders = computed(() => {
  if (currentStatus.value === 0) {
    return orders.value
  }
  return orders.value.filter(order => order.status === currentStatus.value)
})

// 选择订单状态
const selectStatus = (status: number) => {
  currentStatus.value = status
  orderStore.setCurrentStatus(status)
}

// 获取订单状态样式类
const getStatusClass = (status: number) => {
  switch (status) {
    case 1:
      return 'pending'
    case 2:
      return 'processing'
    case 3:
      return 'completed'
    case 4:
      return 'cancelled'
    default:
      return ''
  }
}

// 查看订单详情
const viewOrderDetail = (orderId: number) => {
  router.push(`/order/detail/${orderId}`)
}

// 取消订单
const cancelOrder = async (orderId: number) => {
  if (confirm('确定要取消订单吗？')) {
    await orderStore.cancelOrder(orderId)
    // 更新本地订单状态
    const order = orders.value.find(o => o.id === orderId)
    if (order) {
      order.status = 4
      order.statusText = '已取消'
    }
  }
}

// 支付订单
const payOrder = (orderId: number) => {
  // 模拟支付
  alert('支付功能开发中...')
}

// 确认取餐
const pickupOrder = (orderId: number) => {
  // 模拟确认取餐
  alert('确认取餐成功！')
  const order = orders.value.find(o => o.id === orderId)
  if (order) {
    order.status = 3
    order.statusText = '已完成'
  }
}

// 再次购买
const buyAgain = (orderId: number) => {
  // 跳转到首页
  router.push('/')
}

// 生命周期钩子
onMounted(async () => {
  await orderStore.fetchOrders()
})
</script>

<style scoped>
.order-list {
  min-height: 100vh;
  background-color: #F5F5F5;
}

.order-status-filter {
  display: flex;
  background-color: #fff;
  padding: 12px 0;
  margin-bottom: 10px;
  overflow-x: auto;
  white-space: nowrap;
}

.filter-item {
  flex: 1;
  text-align: center;
  font-size: 14px;
  color: #666;
  padding: 8px 16px;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-item.active {
  color: #00B578;
  font-weight: 500;
}

.filter-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 2px;
  background-color: #00B578;
  border-radius: 1px;
}

.orders-container {
  padding: 10px;
}

.order-card {
  background-color: #fff;
  border-radius: 8px;
  margin-bottom: 12px;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
}

.order-no {
  font-size: 14px;
  color: #666;
}

.order-status {
  font-size: 14px;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 10px;
}

.order-status.pending {
  background-color: #fff7e6;
  color: #fa8c16;
}

.order-status.processing {
  background-color: #e6f7ff;
  color: #1890ff;
}

.order-status.completed {
  background-color: #f6ffed;
  color: #52c41a;
}

.order-status.cancelled {
  background-color: #f5f5f5;
  color: #999;
}

.order-content {
  padding: 12px 16px;
}

.order-item {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
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

.order-footer {
  padding: 12px 16px;
  border-top: 1px solid #f0f0f0;
}

.order-total {
  text-align: right;
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
}

.total-price {
  font-size: 16px;
  font-weight: 600;
  color: #FF7D00;
  margin-left: 4px;
}

.order-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  flex-wrap: wrap;
}

.action-btn {
  padding: 6px 12px;
  border-radius: 14px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn.primary {
  background-color: #00B578;
  color: #fff;
  border-color: #00B578;
}

.action-btn.secondary {
  background-color: #fff;
  color: #666;
  border-color: #d9d9d9;
}

.action-btn.outline {
  background-color: #fff;
  color: #00B578;
  border-color: #00B578;
}

.action-btn:hover {
  opacity: 0.9;
}

.empty-orders {
  min-height: calc(100vh - 120px);
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

@media (min-width: 768px) {
  .order-header,
  .order-content,
  .order-footer {
    padding: 16px 20px;
  }
  
  .item-image {
    width: 80px;
    height: 80px;
  }
  
  .action-btn {
    padding: 8px 16px;
    font-size: 13px;
  }
}
</style>