<template>
  <div class="address-edit-page">
    <!-- 顶部导航栏 -->
    <div class="top-nav">
      <router-link to="/address" class="flex items-center">
        <i class="text-lg mr-2">←</i>
      </router-link>
      <h2 class="text-lg font-medium">{{ isEditMode ? '编辑地址' : '新增地址' }}</h2>
      <button class="text-base font-medium" @click="saveAddress">
        保存
      </button>
    </div>

    <!-- 表单内容 -->
    <div class="form-container">
      <div class="form-item">
        <label class="form-label">收货人</label>
        <input 
          v-model="form.consignee" 
          type="text" 
          placeholder="请输入收货人姓名"
          class="form-input"
        >
      </div>

      <div class="form-item">
        <label class="form-label">手机号码</label>
        <input 
          v-model="form.phone" 
          type="tel" 
          placeholder="请输入手机号码"
          class="form-input"
        >
      </div>

      <div class="form-item">
        <label class="form-label">所在地区</label>
        <div class="region-selector">
          <select v-model="form.province" class="region-select" @change="onProvinceChange">
            <option value="">请选择省份</option>
            <option v-for="province in provinces" :key="province" :value="province">
              {{ province }}
            </option>
          </select>
          <select v-model="form.city" class="region-select" @change="onCityChange">
            <option value="">请选择城市</option>
            <option v-for="city in cities" :key="city" :value="city">
              {{ city }}
            </option>
          </select>
          <select v-model="form.district" class="region-select">
            <option value="">请选择区县</option>
            <option v-for="district in districts" :key="district" :value="district">
              {{ district }}
            </option>
          </select>
        </div>
      </div>

      <div class="form-item">
        <label class="form-label">详细地址</label>
        <textarea 
          v-model="form.detailAddress" 
          placeholder="请输入详细地址信息"
          class="form-textarea"
          rows="3"
        ></textarea>
      </div>

      <div class="form-item checkbox-item">
        <input 
          v-model="form.isDefault" 
          type="checkbox"
          id="isDefault"
          class="form-checkbox"
        >
        <label for="isDefault" class="checkbox-label">设为默认地址</label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Address } from '@/types/address'

const route = useRoute()
const router = useRouter()

const addressId = computed(() => route.params.id)
const isEditMode = computed(() => !!addressId.value)

// 表单数据
const form = ref<Address>({
  id: 0,
  consignee: '',
  phone: '',
  province: '',
  city: '',
  district: '',
  detailAddress: '',
  isDefault: false
})

// 模拟地区数据
const provinces = ['北京市', '上海市', '广东省', '江苏省', '浙江省']
const cities = ref<string[]>([])
const districts = ref<string[]>([])

// 省份变更事件
const onProvinceChange = () => {
  form.value.city = ''
  form.value.district = ''
  
  // 模拟城市数据
  if (form.value.province === '北京市') {
    cities.value = ['北京市']
  } else if (form.value.province === '上海市') {
    cities.value = ['上海市']
  } else if (form.value.province === '广东省') {
    cities.value = ['广州市', '深圳市', '东莞市']
  } else if (form.value.province === '江苏省') {
    cities.value = ['南京市', '苏州市', '无锡市']
  } else if (form.value.province === '浙江省') {
    cities.value = ['杭州市', '宁波市', '温州市']
  } else {
    cities.value = []
  }
  
  districts.value = []
}

// 城市变更事件
const onCityChange = () => {
  form.value.district = ''
  
  // 模拟区县数据
  if (form.value.city === '北京市') {
    districts.value = ['朝阳区', '海淀区', '东城区', '西城区']
  } else if (form.value.city === '上海市') {
    districts.value = ['浦东新区', '黄浦区', '徐汇区', '长宁区']
  } else {
    districts.value = ['区县1', '区县2', '区县3']
  }
}

// 保存地址
const saveAddress = () => {
  // 表单验证
  if (!form.value.consignee) {
    alert('请输入收货人姓名')
    return
  }
  if (!form.value.phone) {
    alert('请输入手机号码')
    return
  }
  if (!form.value.province || !form.value.city || !form.value.district) {
    alert('请选择所在地区')
    return
  }
  if (!form.value.detailAddress) {
    alert('请输入详细地址')
    return
  }
  
  // 保存成功
  alert(isEditMode.value ? '地址更新成功！' : '地址添加成功！')
  router.push('/address')
}

// 生命周期钩子
onMounted(() => {
  // 如果是编辑模式，加载地址数据
  if (isEditMode.value) {
    // 模拟加载地址数据
    form.value = {
      id: Number(addressId.value),
      consignee: '张三',
      phone: '13800138000',
      province: '北京市',
      city: '北京市',
      district: '朝阳区',
      detailAddress: '某某街道123号',
      isDefault: true
    }
    // 触发地区选择
    onProvinceChange()
    onCityChange()
  }
})
</script>

<style scoped>
.address-edit-page {
  min-height: 100vh;
  background-color: #F5F5F5;
}

.form-container {
  background-color: #fff;
  padding: 20px;
  margin-bottom: 20px;
}

.form-item {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #00B578;
  box-shadow: 0 0 0 2px rgba(0, 181, 120, 0.1);
}

.region-selector {
  display: flex;
  gap: 10px;
}

.region-select {
  flex: 1;
  padding: 12px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  font-size: 14px;
  background-color: #fff;
  transition: all 0.3s ease;
}

.region-select:focus {
  outline: none;
  border-color: #00B578;
  box-shadow: 0 0 0 2px rgba(0, 181, 120, 0.1);
}

.form-textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  font-size: 14px;
  resize: none;
  transition: all 0.3s ease;
}

.form-textarea:focus {
  outline: none;
  border-color: #00B578;
  box-shadow: 0 0 0 2px rgba(0, 181, 120, 0.1);
}

.checkbox-item {
  display: flex;
  align-items: center;
  margin-bottom: 0;
}

.form-checkbox {
  width: 16px;
  height: 16px;
  margin-right: 8px;
}

.checkbox-label {
  font-size: 14px;
  color: #333;
  cursor: pointer;
}

@media (min-width: 768px) {
  .form-container {
    padding: 24px;
    margin: 20px;
    border-radius: 8px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }
  
  .form-item {
    margin-bottom: 24px;
  }
  
  .form-label {
    font-size: 16px;
    margin-bottom: 12px;
  }
  
  .form-input,
  .region-select,
  .form-textarea {
    font-size: 16px;
    padding: 14px;
  }
  
  .checkbox-label {
    font-size: 16px;
  }
}
</style>