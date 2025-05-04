import { createRouter, createWebHistory } from 'vue-router';
import AuthForm from '@/components/AuthForm.vue';
import RegisterForm from '@/components/RegisterForm.vue';
import HomePage from '@/components/HomePage.vue';

const routes = [
  { path: '/', redirect: '/register' },
  { path: '/register', component: RegisterForm },
  { path: '/login', component: AuthForm },
  { path: '/home', component: HomePage, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

router.beforeEach((to, from, next) => {
  const isAuthenticated = getCookie('token'); 
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});

export default router;