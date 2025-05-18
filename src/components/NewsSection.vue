<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useThemeStore } from '@/stores/themeStore'

const themeStore = useThemeStore()
const articles = ref<NewsArticle[]>([])
const loading = ref<boolean>(true)
const error = ref<string | null>(null)

interface NewsSource {
	name: string
}

interface NewsArticle {
	title: string
	url: string
	source: NewsSource
	publishedAt: string
}

const fetchNews = async () => {
	try {
		loading.value = true
		error.value = null
		const response = await fetch(
			'https://gnews.io/api/v4/top-headlines?category=business&lang=ru&max=10&apikey=cb47e92582bba4bfbf17aa19280863bd'
		)
		if (!response.ok) throw new Error('Ошибка загрузки новостей')
		const data = await response.json()
		articles.value = data.articles || []
	} catch (err) {
		console.error('Error:', err)
		error.value = 'Не удалось загрузить новости'
	} finally {
		loading.value = false
	}
}

onMounted(fetchNews)
</script>

<template>
	<div class="news-section" :class="{ 'dark-theme': themeStore.isDark }">
		<h3>Последние финансовые новости</h3>

		<div v-if="loading" class="loading">Загрузка новостей...</div>
		<div v-else-if="error" class="error">{{ error }}</div>

		<ul v-else class="news-list">
			<li v-for="(article, index) in articles" :key="index" class="news-item">
				<a
					:href="article.url"
					target="_blank"
					rel="noopener noreferrer"
					class="news-link"
				>
					{{ article.title }}
					<div class="news-meta">
						<span class="source">{{ article.source.name }}</span>
						<span class="date">
							{{ new Date(article.publishedAt).toLocaleDateString() }}
						</span>
					</div>
				</a>
			</li>
		</ul>
	</div>
</template>

<style scoped>
.news-section {
	padding: 1.5rem;
	border-radius: 12px;
	background-color: #f8f9fa;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	transition: all 0.3s ease;
}

.news-section.dark-theme {
	background-color: #2d3748;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

h3 {
	margin-top: 0;
	margin-bottom: 1.2rem;
	color: #2c3e50;
	font-size: 1.25rem;
	border-bottom: 1px solid #e0e0e0;
	padding-bottom: 0.5rem;
}

.dark-theme h3 {
	color: #f7fafc;
	border-bottom-color: #4a5568;
}

.loading,
.error {
	text-align: center;
	padding: 1rem;
	color: #666;
}

.dark-theme .loading,
.dark-theme .error {
	color: #cbd5e0;
}

.news-list {
	list-style: none;
	padding: 0;
	margin: 0 0 1.5rem 0;
}

.news-item {
	padding: 0.8rem 0;
	border-bottom: 1px solid #e0e0e0;
}

.dark-theme .news-item {
	border-bottom-color: #4a5568;
}

.news-item:last-child {
	border-bottom: none;
}

.news-link {
	display: block;
	text-decoration: none;
	color: #2c3e50;
	transition: color 0.2s;
}

.dark-theme .news-link {
	color: #f7fafc;
}

.news-link:hover {
	color: #42b983;
}

.news-meta {
	display: flex;
	justify-content: space-between;
	margin-top: 0.5rem;
	font-size: 0.8rem;
	color: #666;
}

.dark-theme .news-meta {
	color: #cbd5e0;
}

.source {
	font-weight: 500;
}
</style>
