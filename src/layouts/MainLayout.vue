<script setup lang="ts">
import Header from '@/components/Header.vue'
import { useThemeStore } from '@/stores/themeStore'
import { onMounted, onUnmounted } from 'vue'

const themeStore = useThemeStore()

onMounted(() => {
	const cleanup = themeStore.watchSystemPreference()
	onUnmounted(cleanup)
})
</script>

<template>
	<Header />
	<slot />
</template>
