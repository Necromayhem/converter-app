import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: '/',
			component: () => import('@/views/HomeView.vue'),
		},
		{
			path: '/converter',
			component: () => import('@/components/Converter.vue'),
		},
		{
			path: '/history',
			component: () => import('@/components/ConversionHistory.vue'),
		},
		// {
		// 	path: '/weather',
		// 	component: () => import('@/components/ConversionHistory.vue'),
		// },
	],
})

export default router
