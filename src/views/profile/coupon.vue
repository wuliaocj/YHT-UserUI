<template>
  <div class="coupon-page">
    <!-- 顶部导航栏 -->
    <div class="top-nav">
      <router-link to="/profile" class="flex items-center">
        <i class="text-lg mr-2">←</i>
      </router-link>
      <h2 class="text-lg font-medium">我的优惠券</h2>
      <div class="w-8"></div>
    </div>

    <!-- 优惠券状态筛选 -->
    <div class="coupon-status-filter">
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

    <!-- 优惠券列表 -->
    <div v-if="filteredCoupons.length > 0" class="coupon-list">
      <div 
        v-for="coupon in filteredCoupons" 
        :key="coupon.id"
        class="coupon-item"
        :class="getCouponClass(coupon.status)"
      >
        <div class="coupon-left">
          <div class="coupon-value">¥{{ coupon.value }}</div>
          <div class="coupon-condition">满{{ coupon.minAmount }}元可用</div>
        </div>
        <div class="coupon-right">
          <div class="coupon-name">{{ coupon.name }}</div>
          <div class="coupon-time">{{ coupon.startDate }} - {{ coupon.endDate }}</div>
          <div 
            v-if="coupon.status === 1" 
            class="coupon-btn"
          >
            立即使用
          </div>
          <div 
            v-else-if="coupon.status === 2" 
            class="coupon-status-text"
          >
            已使用
          </div>
          <div 
            v-else 
            class="coupon-status-text"
          >
            已过期
          </div>
        </div>
      </div>
    </div>

    <!-- 空优惠券状态 -->
    <div v-else class="empty-coupons">
      <div class="empty-icon">🎫</div>
      <div class="empty-text">暂无优惠券</div>
      <button class="btn-primary mt-4">去领取</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const currentStatus = ref(0)

const statusList = [
  { value: 0, label: '全部' },
  { value: 1, label: '可用' },
  { value: 2, label: '已使用' },
  { value: 3, label: '已过期' }
]

// 模拟优惠券数据
const coupons = ref([
  {
    id: 1,
    name: '新人优惠券',
    type: 1,
    value: 5,
    minAmount: 20,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    status: 1,
    statusText: '可用'
  },
  {
    id: 2,
    name: '满减优惠券',
    type: 1,
    value: 10,
    minAmount: 30,
    startDate: '2026-01-01',
    endDate: '2026-06-30',
    status: 1,
    statusText: '可用'
  },
  {
    id: 3,
    name: '生日优惠券',
    type: 1,
    value: 15,
    minAmount: 25,
    startDate: '2025-12-01',
    endDate: '2025-12-31',
    status: 3,
    statusText: '已过期'
  },
  {
    id: 4,
    name: '节日优惠券',
    type: 1,
    value: 8,
    minAmount: 20,
    startDate: '2026-01-01',
    endDate: '2026-01-07',
    status: 2,
    statusText: '已使用'
  }
])

const filteredCoupons = computed(() => {
  if (currentStatus.value === 0) {
    return coupons.value
  }
  return coupons.value.filter(coupon => coupon.status === currentStatus.value)
})

// 选择优惠券状态
const selectStatus = (status: number) => {
  currentStatus.value = status
}

// 获取优惠券样式类
const getCouponClass = (status: number) => {
  switch (status) {
    case 1:
      return 'coupon-available'
    case 2:
      return 'coupon-used'
    case 3:
      return 'coupon-expired'
    default:
      return ''
  }
}
</script>

<style scoped>
.coupon-page {
  min-height: 100vh;
  background-color: #F5F5F5;
}

.coupon-status-filter {
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

.coupon-list {
  padding: 10px;
}

.coupon-item {
  display: flex;
  background-color: #fff;
  border-radius: 8px;
  margin-bottom: 12px;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.coupon-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.coupon-available {
  border-left: 4px solid #00B578;
}

.coupon-used {
  border-left: 4px solid #ccc;
  opacity: 0.7;
}

.coupon-expired {
  border-left: 4px solid #999;
  opacity: 0.7;
}

.coupon-left {
  width: 120px;
  background-color: #f9f9f9;
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.coupon-value {
  font-size: 24px;
  font-weight: 700;
  color: #FF7D00;
  margin-bottom: 4px;
}

.coupon-condition {
  font-size: 12px;
  color: #999;
}

.coupon-right {
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.coupon-name {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

.coupon-time {
  font-size: 12px;
  color: #999;
  margin-bottom: 12px;
}

.coupon-btn {
  align-self: flex-start;
  padding: 6px 16px;
  background-color: #00B578;
  color: #fff;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.coupon-btn:hover {
  background-color: rgba(0, 181, 120, 0.9);
}

.coupon-status-text {
  align-self: flex-start;
  font-size: 12px;
  color: #999;
}

.empty-coupons {
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

.btn-primary {
  padding: 10px 24px;
  background-color: #00B578;
  color: #fff;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background-color: rgba(0, 181, 120, 0.9);
}

@media (min-width: 768px) {
  .coupon-item {
    margin-bottom: 16px;
  }
  
  .coupon-left {
    width: 140px;
    padding: 24px 20px;
  }
  
  .coupon-value {
    font-size: 28px;
  }
  
  .coupon-right {
    padding: 20px;
  }
  
  .coupon-name {
    font-size: 18px;
  }
}
</style>