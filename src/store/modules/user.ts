import { defineStore } from 'pinia'
import type { UserInfo } from '../../types/user'

export const useUserStore = defineStore('user', {
  state: () => ({
    info: null as UserInfo | null,
    token: '',
    loading: false,
    error: ''
  }),
  getters: {
    isLoggedIn: (state) => {
      return !!state.token
    },
    userNickname: (state) => {
      return state.info?.nickname || '未登录'
    },
    userAvatar: (state) => {
      return state.info?.avatar || 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=default user avatar, simple, clean&image_size=square'
    }
  },
  actions: {
    async login(phone: string, password: string) {
      this.loading = true
      try {
        // 模拟API请求
        // const response = await userApi.login({ phone, password })
        // this.info = response.data.user
        // this.token = response.data.token
        
        // 模拟登录成功
        this.info = {
          id: 1,
          phone: phone,
          nickname: '益禾堂粉丝',
          avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=young person avatar, friendly, smiling&image_size=square',
          gender: 1,
          birthday: '2000-01-01',
          points: 100
        }
        this.token = 'mock_token_' + Date.now()
        localStorage.setItem('token', this.token)
      } catch (error) {
        this.error = '登录失败'
        console.error('Failed to login:', error)
        throw error
      } finally {
        this.loading = false
      }
    },
    async register(phone: string, password: string, code: string) {
      this.loading = true
      try {
        // 模拟API请求
        // const response = await userApi.register({ phone, password, code })
        // return response.data
        
        // 模拟注册成功
        return { success: true }
      } catch (error) {
        this.error = '注册失败'
        console.error('Failed to register:', error)
        throw error
      } finally {
        this.loading = false
      }
    },
    async fetchUserInfo() {
      this.loading = true
      try {
        // 模拟API请求
        // const response = await userApi.getUserInfo()
        // this.info = response.data
        
        // 模拟用户信息
        this.info = {
          id: 1,
          phone: '13800138000',
          nickname: '益禾堂粉丝',
          avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=young person avatar, friendly, smiling&image_size=square',
          gender: 1,
          birthday: '2000-01-01',
          points: 100
        }
      } catch (error) {
        this.error = '获取用户信息失败'
        console.error('Failed to fetch user info:', error)
      } finally {
        this.loading = false
      }
    },
    async updateUserInfo(info: Partial<UserInfo>) {
      this.loading = true
      try {
        // 模拟API请求
        // const response = await userApi.updateUserInfo(info)
        // this.info = { ...this.info, ...response.data }
        
        // 模拟更新用户信息
        if (this.info) {
          this.info = { ...this.info, ...info }
        }
      } catch (error) {
        this.error = '更新用户信息失败'
        console.error('Failed to update user info:', error)
        throw error
      } finally {
        this.loading = false
      }
    },
    logout() {
      this.info = null
      this.token = ''
      localStorage.removeItem('token')
    },
    initToken() {
      const token = localStorage.getItem('token')
      if (token) {
        this.token = token
      }
    }
  }
})