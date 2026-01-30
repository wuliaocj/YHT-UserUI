import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('../views/home/index.vue'),
      meta: {
        title: '益禾堂 - 首页'
      }
    },
    {
      path: '/category',
      name: 'Category',
      component: () => import('../views/category/index.vue'),
      meta: {
        title: '商品分类'
      }
    },
    {
      path: '/product/:id',
      name: 'ProductDetail',
      component: () => import('../views/product/index.vue'),
      meta: {
        title: '商品详情'
      }
    },
    {
      path: '/cart',
      name: 'Cart',
      component: () => import('../views/cart/index.vue'),
      meta: {
        title: '购物车'
      }
    },
    {
      path: '/order',
      name: 'Order',
      component: () => import('../views/order/index.vue'),
      meta: {
        title: '我的订单'
      }
    },
    {
      path: '/order/detail/:id',
      name: 'OrderDetail',
      component: () => import('../views/order/detail.vue'),
      meta: {
        title: '订单详情'
      }
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('../views/profile/index.vue'),
      meta: {
        title: '个人中心'
      }
    },
    {
      path: '/coupon',
      name: 'Coupon',
      component: () => import('../views/profile/coupon.vue'),
      meta: {
        title: '我的优惠券'
      }
    },
    {
      path: '/address',
      name: 'Address',
      component: () => import('../views/profile/address.vue'),
      meta: {
        title: '收货地址管理'
      }
    },
    {
      path: '/address/edit/:id?',
      name: 'AddressEdit',
      component: () => import('../views/profile/addressEdit.vue'),
      meta: {
        title: '编辑收货地址'
      }
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})

// 全局前置守卫，设置页面标题
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title as string
  }
  next()
})

export default router