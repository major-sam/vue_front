import Vue from 'vue';
import Router from 'vue-router';
import ProdDB from '@/components/ProdDB';
import DevDB from '@/components/DevDB';
import Login from '@/components/Login';
import Secure from '@/components/Secure';
import store from '@/store';

Vue.use(Router);
const router = new Router({
  routes: [
    {
      path: '/',
      alias: '/prod_db',
      name: 'ProdDB',
      component: ProdDB,
      meta: {
        title: 'Production',
        requiresAuth: true,
        metaTags: [
          {
            name: 'description',
            content: 'Production DB list',
          },
          {
            property: 'og:description',
            content: 'Production DB list',
          },
        ],
      },
    },
    {
      path: '/dev_db',
      name: 'DevDB',
      component: DevDB,
      meta: {
        title: 'Development',
        requiresAuth: true,
        metaTags: [
          {
            name: 'description',
            content: 'Development DB list',
          },
          {
            property: 'og:description',
            content: 'Development DB list',
          },
        ],
      },
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {
        title: 'Login',
        metaTags: [
          {
            name: 'description',
            content: 'Login page',
          },
          {
            property: 'og:description',
            content: 'Login page',
          },
        ],
      },
    },
    {
      path: '/secure',
      name: 'secure',
      component: Secure,
      meta: {
        requiresAuth: true,
      },
    },
  ],
  mode: 'history',
  watch: {
    immediate: true,
    // eslint-disable-next-line
    handler(to, from) {
      document.title = to.meta.title || 'Your Website';
    },
  },
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters.isLoggedIn) {
      next();
      return;
    }
    next('/login');
  } else {
    next();
  }
});

export default router;
