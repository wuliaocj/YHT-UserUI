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

    <!-- 个人信息编辑对话框 -->
    <el-dialog
      v-model="editProfileDialogVisible"
      title="编辑个人信息"
      width="320px"
    >
      <el-form :model="editProfileForm" :rules="editProfileRules" ref="editProfileFormRef">
        <el-form-item prop="nickname">
          <el-input
            v-model="editProfileForm.nickname"
            placeholder="请输入昵称"
            maxlength="20"
          >
            <template #prefix>👤</template>
          </el-input>
        </el-form-item>
        <el-form-item prop="gender">
          <el-radio-group v-model="editProfileForm.gender">
            <el-radio label="1">男</el-radio>
            <el-radio label="2">女</el-radio>
            <el-radio label="0">其他</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="birthday">
          <el-date-picker
            v-model="editProfileForm.birthday"
            type="date"
            placeholder="请选择生日"
            style="width: 100%"
            value-format="YYYY-MM-DD"
            max-date="new Date()"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :loading="editProfileLoading"
            @click="handleEditProfile"
            style="width: 100%"
          >
            保存修改
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 设置对话框 -->
    <el-dialog
      v-model="settingsDialogVisible"
      title="设置"
      width="320px"
    >
      <div class="settings-content">
        <div class="settings-section">
          <h4 class="settings-title">通知设置</h4>
          <div class="settings-item">
            <span class="settings-label">接收订单通知</span>
            <el-switch v-model="settingsForm.notifications" />
          </div>
          <div class="settings-item">
            <span class="settings-label">接收活动通知</span>
            <el-switch v-model="settingsForm.privacy" />
          </div>
        </div>
        
        <div class="settings-section">
          <h4 class="settings-title">其他设置</h4>
          <div class="settings-item" @click="clearCache">
            <span class="settings-label">清除缓存</span>
            <span class="settings-arrow">→</span>
          </div>
          <div class="settings-item" @click="openAbout">
            <span class="settings-label">关于我们</span>
            <span class="settings-arrow">→</span>
          </div>
        </div>
      </div>
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

// 编辑个人信息对话框
const editProfileDialogVisible = ref(false)
const editProfileLoading = ref(false)
const editProfileFormRef = ref<FormInstance>()

// 编辑个人信息表单
const editProfileForm = reactive({
  nickname: '',
  gender: 1,
  birthday: ''
})

// 编辑个人信息验证规则
const editProfileRules = reactive({
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 20, message: '昵称长度2-20位', trigger: 'blur' }
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ],
  birthday: [
    { required: true, message: '请选择生日', trigger: 'change' }
  ]
})

// 编辑个人信息
const editProfile = () => {
  if (!isLoggedIn.value) {
    login()
    return
  }
  // 填充表单数据
  if (userStore.info) {
    editProfileForm.nickname = userStore.info.nickname || ''
    editProfileForm.gender = userStore.info.gender || 1
    editProfileForm.birthday = userStore.info.birthday || ''
  }
  // 打开编辑对话框
  editProfileDialogVisible.value = true
}

// 处理编辑个人信息提交
const handleEditProfile = async () => {
  if (!editProfileFormRef.value) return
  
  await editProfileFormRef.value.validate(async (valid) => {
    if (valid) {
      editProfileLoading.value = true
      try {
        await userStore.updateUserInfo(editProfileForm)
        editProfileDialogVisible.value = false
        alert('个人信息更新成功！')
      } catch (error) {
        alert('个人信息更新失败，请重试')
      } finally {
        editProfileLoading.value = false
      }
    }
  })
}

// 设置对话框
const settingsDialogVisible = ref(false)

// 设置表单
const settingsForm = reactive({
  notifications: true,
  privacy: true
})

// 清除缓存
const clearCache = () => {
  if (confirm('确定要清除缓存吗？')) {
    // 模拟清除缓存
    setTimeout(() => {
      alert('缓存已清除')
    }, 500)
  }
}

// 打开关于我们
const openAbout = () => {
  alert('益禾堂用户端 v1.0.0\n\n让世界爱上中国茶')
}

// 打开设置
const openSettings = () => {
  settingsDialogVisible.value = true
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

/* 设置对话框样式 */
.settings-content {
  padding: 8px 0;
}

.settings-section {
  margin-bottom: 24px;
}

.settings-title {
  font-size: 14px;
  color: #999;
  margin-bottom: 12px;
  font-weight: normal;
}

.settings-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.settings-item:hover {
  background-color: #f9f9f9;
}

.settings-item:last-child {
  border-bottom: none;
}

.settings-label {
  font-size: 15px;
  color: #333;
}

.settings-arrow {
  font-size: 14px;
  color: #999;
}
</style>