<script setup lang="ts">
import { useCurrencyConverter } from './composables/useCurrencyConverter'
import { useHistoryStore } from './stores/historyStore'
import ConversionHistory from './components/ConversionHistory.vue'
import Header from './components/Header.vue'
import NewsSection from './components/NewsSection.vue'
import Converter from './components/Converter.vue'
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
	<div class="main">
		<div class="left-block"><Converter /></div>
		<div class="right-block"><NewsSection /></div>
	</div>
</template>

<style scoped>
.main {
	display: flex;
	justify-content: center;
	padding: 1.5rem;
}
</style>
