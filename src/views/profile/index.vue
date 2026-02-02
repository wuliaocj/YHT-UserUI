<template>
  <div class="profile">
    <!-- 顶部导航栏 -->
    <div class="top-nav">
      <div class="w-8"></div>
      <h2 class="text-lg font-medium">个人中心</h2>
      <div class="w-8"></div>
    </div>

    <!-- 用户信息区域 -->
    <div class="user-info-section">
      <div class="user-avatar">
        <img :src="userAvatar" :alt="userNickname">
      </div>
      <div class="user-details">
        <h3 class="user-nickname">{{ userNickname }}</h3>
        <p class="user-phone">{{ userPhone }}</p>
      </div>
      <div class="user-points">
        <span class="points-label">积分</span>
        <span class="points-value">{{ userPoints }}</span>
      </div>
    </div>

    <!-- 功能列表 -->
    <div class="feature-section">
      <div class="feature-item" @click="navigateTo('/order')">
        <div class="feature-icon">📋</div>
        <div class="feature-text">我的订单</div>
        <div class="feature-arrow">→</div>
      </div>
      <div class="feature-item" @click="navigateTo('/coupon')">
        <div class="feature-icon">🎫</div>
        <div class="feature-text">我的优惠券</div>
        <div class="feature-arrow">→</div>
      </div>
      <div class="feature-item" @click="navigateTo('/address')">
        <div class="feature-icon">📍</div>
        <div class="feature-text">收货地址</div>
        <div class="feature-arrow">→</div>
      </div>
    </div>

    <div class="feature-section">
      <div class="feature-item" @click="editProfile">
        <div class="feature-icon">👤</div>
        <div class="feature-text">个人信息</div>
        <div class="feature-arrow">→</div>
      </div>
      <div class="feature-item" @click="openSettings">
        <div class="feature-icon">⚙️</div>
        <div class="feature-text">设置</div>
        <div class="feature-arrow">→</div>
      </div>
      <div class="feature-item" @click="contactService">
        <div class="feature-icon">📞</div>
        <div class="feature-text">联系客服</div>
        <div class="feature-arrow">→</div>
      </div>
    </div>

    <!-- 退出登录按钮 -->
    <div v-if="isLoggedIn" class="logout-section">
      <button class="logout-btn" @click="logout">退出登录</button>
    </div>

    <!-- 登录按钮 -->
    <div v-else class="login-section">
      <button class="login-btn" @click="login">登录/注册</button>
      <button class="token-login-btn" @click="openTokenLogin">Token登录</button>
    </div>

    <!-- 登录对话框 -->
    <el-dialog
      v-model="loginDialogVisible"
      title="登录"
      width="320px"
    >
      <el-form :model="loginForm" :rules="loginRules" ref="loginFormRef">
        <el-form-item prop="phone">
          <el-input
            v-model="loginForm.phone"
            placeholder="请输入手机号"
            maxlength="11"
          >
            <template #prefix>📱</template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            show-password
          >
            <template #prefix>🔒</template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <div class="test-account-tip">
            <p class="text-sm text-gray-500">测试账号：13800138000</p>
            <p class="text-sm text-gray-500">测试密码：123456</p>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :loading="loginLoading"
            @click="handleLogin"
            style="width: 100%"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- Token登录对话框 -->
    <el-dialog
      v-model="tokenLoginDialogVisible"
      title="Token登录"
      width="320px"
    >
      <el-form :model="tokenLoginForm" :rules="tokenLoginRules" ref="tokenLoginFormRef">
        <el-form-item prop="token">
          <el-input
            v-model="tokenLoginForm.token"
            placeholder="请输入Token"
            type="textarea"
            rows="3"
          >
            <template #prefix>🔑</template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :loading="tokenLoginLoading"
            @click="handleTokenLogin"
            style="width: 100%"
          >
            确认登录
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import type { FormInstance } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()

// 登录对话框
const loginDialogVisible = ref(false)
const loginLoading = ref(false)
const loginFormRef = ref<FormInstance>()

// 登录表单
const loginForm = reactive({
  phone: '',
  password: ''
})

// 登录验证规则
const loginRules = reactive({
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少6位', trigger: 'blur' }
  ]
})

// Token登录对话框
const tokenLoginDialogVisible = ref(false)
const tokenLoginLoading = ref(false)
const tokenLoginFormRef = ref<FormInstance>()

// Token登录表单
const tokenLoginForm = reactive({
  token: ''
})

// Token登录验证规则
const tokenLoginRules = reactive({
  token: [
    { required: true, message: '请输入Token', trigger: 'blur' }
  ]
})

const isLoggedIn = computed(() => userStore.isLoggedIn)
const userNickname = computed(() => userStore.userNickname)
const userAvatar = computed(() => userStore.userAvatar)
const userPhone = computed(() => userStore.info?.phone || '未绑定手机号')
const userPoints = computed(() => userStore.info?.points || 0)

// 导航到指定页面
const navigateTo = (path: string) => {
  router.push(path)
}

// 编辑个人信息
const editProfile = () => {
  if (!isLoggedIn.value) {
    login()
    return
  }
  // 跳转到个人信息编辑页
  alert('个人信息编辑功能开发中...')
}

// 打开设置
const openSettings = () => {
  alert('设置功能开发中...')
}

// 联系客服
const contactService = () => {
  alert('客服电话：400-123-4567')
}

// 打开登录对话框
const login = () => {
  loginDialogVisible.value = true
}

// 打开Token登录对话框
const openTokenLogin = () => {
  tokenLoginDialogVisible.value = true
}

// 处理登录
const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  await loginFormRef.value.validate(async (valid) => {
    if (valid) {
      loginLoading.value = true
      try {
        await userStore.login(loginForm.phone, loginForm.password)
        loginDialogVisible.value = false
        alert('登录成功！')
      } catch (error) {
        alert('登录失败，请检查手机号和密码')
      } finally {
        loginLoading.value = false
      }
    }
  })
}

// 处理Token登录
const handleTokenLogin = async () => {
  if (!tokenLoginFormRef.value) return
  
  await tokenLoginFormRef.value.validate(async (valid) => {
    if (valid) {
      tokenLoginLoading.value = true
      try {
        // 直接设置token并获取用户信息
        userStore.token = tokenLoginForm.token
        localStorage.setItem('token', tokenLoginForm.token)
        // 尝试获取用户信息
        await userStore.fetchUserInfo()
        tokenLoginDialogVisible.value = false
        alert('Token登录成功！')
      } catch (error) {
        alert('Token登录失败，请检查Token是否正确')
      } finally {
        tokenLoginLoading.value = false
      }
    }
  })
}

// 退出登录
const logout = () => {
  if (confirm('确定要退出登录吗？')) {
    userStore.logout()
    alert('退出登录成功！')
  }
}

// 生命周期钩子
onMounted(async () => {
  userStore.initToken()
  if (isLoggedIn.value) {
    await userStore.fetchUserInfo()
  }
})
</script>

<style scoped>
.profile {
  min-height: 100vh;
  background-color: #F5F5F5;
}

.user-info-section {
  background-color: #00B578;
  color: #fff;
  padding: 24px 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.user-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-details {
  flex: 1;
}

.user-nickname {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;
}

.user-phone {
  font-size: 14px;
  opacity: 0.9;
}

.user-points {
  background-color: rgba(255, 255, 255, 0.2);
  padding: 8px 12px;
  border-radius: 16px;
  text-align: center;
}

.points-label {
  font-size: 12px;
  display: block;
  margin-bottom: 2px;
}

.points-value {
  font-size: 16px;
  font-weight: 600;
}

.feature-section {
  background-color: #fff;
  margin-bottom: 16px;
  border-radius: 8px;
  overflow: hidden;
}

.feature-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.feature-item:last-child {
  border-bottom: none;
}

.feature-item:hover {
  background-color: #f9f9f9;
}

.feature-icon {
  font-size: 20px;
  margin-right: 12px;
  width: 24px;
  text-align: center;
}

.feature-text {
  flex: 1;
  font-size: 15px;
  color: #333;
}

.feature-arrow {
  font-size: 14px;
  color: #999;
}

.logout-section,
.login-section {
  padding: 24px 16px;
}

.logout-btn,
.login-btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.logout-btn {
  background-color: #fff;
  color: #ff4d4f;
  border: 1px solid #ff4d4f;
}

.logout-btn:hover {
  background-color: #fff1f0;
}

.login-btn {
  background-color: #00B578;
  color: #fff;
  margin-bottom: 12px;
}

.login-btn:hover {
  background-color: rgba(0, 181, 120, 0.9);
}

.token-login-btn {
  background-color: #fff;
  color: #00B578;
  border: 1px solid #00B578;
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.token-login-btn:hover {
  background-color: rgba(0, 181, 120, 0.05);
}

@media (min-width: 768px) {
  .user-info-section {
    padding: 32px 24px;
  }
  
  .user-avatar {
    width: 80px;
    height: 80px;
  }
  
  .user-nickname {
    font-size: 20px;
  }
  
  .user-phone {
    font-size: 16px;
  }
  
  .feature-item {
    padding: 20px;
  }
  
  .feature-text {
    font-size: 16px;
  }
}

/* 测试账号提示样式 */
.test-account-tip {
  background-color: #f5f5f5;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 16px;
}

.test-account-tip p {
  margin: 4px 0;
  font-size: 14px;
  color: #666;
}
</style>