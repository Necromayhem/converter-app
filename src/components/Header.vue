<script setup lang="ts">
import { ref } from 'vue'
import { useThemeStore } from '@/stores/themeStore'

const themeStore = useThemeStore()

const darkMode = ref(false)

const toggleTheme = () => {
	themeStore.toggleTheme()
}
</script>

<template>
	<header class="site-header">
		<div class="header-container">
			<div class="logo">
				<svg class="logo-icon" viewBox="0 0 24 24">
					<path
						fill="currentColor"
						d="M5,3H19A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5A2,2 0 0,1 3,19V5A2,2 0 0,1 5,3M7,7A2,2 0 0,0 5,9V17A2,2 0 0,0 7,19H17A2,2 0 0,0 19,17V9A2,2 0 0,0 17,7H7M8,9H16V17H8V9Z"
					/>
				</svg>
				<span class="logo-text">CurrencyConvert</span>
			</div>

			<nav class="main-nav">
				<router-link to="/" class="nav-link">Конвертер</router-link>
				<router-link to="/rates" class="nav-link">Курсы валют</router-link>
				<router-link to="/news" class="nav-link">Новости</router-link>
				<router-link to="/history" class="nav-link">История</router-link>
			</nav>

			<div class="header-actions">
				<button class="theme-toggle" @click="toggleTheme">
					<svg width="20" height="20" viewBox="0 0 24 24">
						<path
							fill="currentColor"
							d="M12,18C11.11,18 10.26,17.8 9.5,17.45C11.56,16.5 13,14.42 13,12C13,9.58 11.56,7.5 9.5,6.55C10.26,6.2 11.11,6 12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18M20,8.69V4H15.31L12,0.69L8.69,4H4V8.69L0.69,12L4,15.31V20H8.69L12,23.31L15.31,20H20V15.31L23.31,12L20,8.69Z"
						/>
					</svg>
				</button>
				<button class="user-btn">
					<svg width="20" height="20" viewBox="0 0 24 24">
						<path
							fill="currentColor"
							d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"
						/>
					</svg>
				</button>
			</div>
		</div>
	</header>
</template>

<style scoped>
.site-header {
	background-color: #ffffff;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
	position: sticky;
	top: 0;
	z-index: 100;
}

.header-container {
	display: flex;
	align-items: center;
	justify-content: space-between;
	max-width: 1200px;
	margin: 0 auto;
	padding: 1rem 2rem;
}

.logo {
	display: flex;
	align-items: center;
	gap: 0.75rem;
}

.logo-icon {
	width: 28px;
	height: 28px;
	color: #42b983;
}

.logo-text {
	font-size: 1.5rem;
	font-weight: 700;
	color: #2c3e50;
}

.main-nav {
	display: flex;
	gap: 1.5rem;
}

.nav-link {
	color: #4a5568;
	text-decoration: none;
	font-weight: 500;
	padding: 0.5rem 0;
	position: relative;
	transition: color 0.2s;
}

.nav-link:hover {
	color: #42b983;
}

.nav-link.router-link-exact-active {
	color: #42b983;
}

.nav-link.router-link-exact-active::after {
	content: '';
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	height: 2px;
	background-color: #42b983;
}

.header-actions {
	display: flex;
	align-items: center;
	gap: 1rem;
}

.theme-toggle,
.user-btn {
	background: none;
	border: none;
	cursor: pointer;
	padding: 0.5rem;
	border-radius: 50%;
	transition: background-color 0.2s;
	display: flex;
	align-items: center;
	justify-content: center;
}

.theme-toggle:hover,
.user-btn:hover {
	background-color: #f0f0f0;
}

/* Темная тема */
.dark-theme .site-header {
	background-color: #1a202c;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.dark-theme .logo-text {
	color: #f7fafc;
}

.dark-theme .nav-link {
	color: #cbd5e0;
}

.dark-theme .nav-link:hover {
	color: #42b983;
}

.dark-theme .theme-toggle:hover,
.dark-theme .user-btn:hover {
	background-color: #2d3748;
}

@media (max-width: 768px) {
	.header-container {
		padding: 1rem;
	}

	.main-nav {
		gap: 1rem;
	}

	.logo-text {
		font-size: 1.25rem;
	}
}
</style>
