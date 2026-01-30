<template>
  <div class="address-page">
    <!-- 顶部导航栏 -->
    <div class="top-nav">
      <router-link to="/profile" class="flex items-center">
        <i class="text-lg mr-2">←</i>
      </router-link>
      <h2 class="text-lg font-medium">收货地址</h2>
      <router-link to="/address/edit" class="text-base font-medium">
        新增
      </router-link>
    </div>

    <!-- 地址列表 -->
    <div v-if="addresses.length > 0" class="address-list">
      <div 
        v-for="address in addresses" 
        :key="address.id"
        class="address-item"
      >
        <div class="address-header">
          <span class="consignee">{{ address.consignee }}</span>
          <span class="phone">{{ address.phone }}</span>
          <span 
            v-if="address.isDefault" 
            class="default-tag"
          >
            默认
          </span>
        </div>
        <div class="address-content">
          {{ address.province }}{{ address.city }}{{ address.district }}{{ address.detailAddress }}
        </div>
        <div class="address-actions">
          <button 
            v-if="!address.isDefault" 
            class="action-btn"
            @click="setDefault(address.id)"
          >
            设为默认
          </button>
          <button class="action-btn"
            @click="editAddress(address.id)"
          >
            编辑
          </button>
          <button class="action-btn delete"
            @click="deleteAddress(address.id)"
          >
            删除
          </button>
        </div>
      </div>
    </div>

    <!-- 空地址状态 -->
    <div v-else class="empty-addresses">
      <div class="empty-icon">📍</div>
      <div class="empty-text">暂无收货地址</div>
      <router-link to="/address/edit" class="btn-primary mt-4">新增地址</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type { Address } from '@/types/address'

const router = useRouter()

// 模拟地址数据
const addresses = ref<Address[]>([
  {
    id: 1,
    consignee: '张三',
    phone: '13800138000',
    province: '北京市',
    city: '北京市',
    district: '朝阳区',
    detailAddress: '某某街道123号',
    isDefault: true
  },
  {
    id: 2,
    consignee: '李四',
    phone: '13900139000',
    province: '上海市',
    city: '上海市',
    district: '浦东新区',
    detailAddress: '某某路456号',
    isDefault: false
  }
])

// 设置默认地址
const setDefault = (addressId: number) => {
  addresses.value.forEach(address => {
    address.isDefault = address.id === addressId
  })
  alert('设置默认地址成功！')
}

// 编辑地址
const editAddress = (addressId: number) => {
  router.push(`/address/edit/${addressId}`)
}

// 删除地址
const deleteAddress = (addressId: number) => {
  if (confirm('确定要删除这个地址吗？')) {
    addresses.value = addresses.value.filter(address => address.id !== addressId)
    alert('删除地址成功！')
  }
}
</script>

<style scoped>
.address-page {
  min-height: 100vh;
  background-color: #F5F5F5;
}

.address-list {
  padding: 10px;
}

.address-item {
  background-color: #fff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.address-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.address-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.consignee {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-right: 16px;
}

.phone {
  font-size: 14px;
  color: #666;
  margin-right: 12px;
}

.default-tag {
  font-size: 12px;
  color: #00B578;
  background-color: rgba(0, 181, 120, 0.1);
  padding: 2px 8px;
  border-radius: 10px;
}

.address-content {
  font-size: 14px;
  color: #666;
  line-height: 1.4;
  margin-bottom: 16px;
}

.address-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.action-btn {
  padding: 6px 16px;
  border: 1px solid #d9d9d9;
  border-radius: 12px;
  font-size: 12px;
  color: #666;
  background-color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn:hover {
  border-color: #00B578;
  color: #00B578;
}

.action-btn.delete:hover {
  border-color: #ff4d4f;
  color: #ff4d4f;
}

.empty-addresses {
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

.btn-primary {
  padding: 10px 24px;
  background-color: #00B578;
  color: #fff;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background-color: rgba(0, 181, 120, 0.9);
}

@media (min-width: 768px) {
  .address-item {
    padding: 20px;
    margin-bottom: 16px;
  }
  
  .address-header {
    margin-bottom: 16px;
  }
  
  .consignee {
    font-size: 18px;
  }
  
  .phone {
    font-size: 16px;
  }
  
  .address-content {
    font-size: 16px;
    margin-bottom: 20px;
  }
  
  .action-btn {
    padding: 8px 20px;
    font-size: 13px;
  }
}
</style>