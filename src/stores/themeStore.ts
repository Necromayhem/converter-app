import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
	state: () => ({
		isDark: false,
		isSystemPreference: false,
	}),
	actions: {
		initializeTheme() {
			// Проверяем наличие сохраненной темы в localStorage
			const savedTheme = localStorage.getItem('theme')

			if (savedTheme !== null) {
				// Если тема сохранена, используем ее
				this.isDark = savedTheme === 'dark'
				this.isSystemPreference = false
			} else {
				// Если нет сохраненной темы, используем системные настройки
				this.isSystemPreference = true
				this.isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
			}

			this.applyTheme()
		},

		toggleTheme() {
			if (this.isSystemPreference) {
				// Переключаемся с системных настроек на ручное управление
				this.isSystemPreference = false
				this.isDark = !window.matchMedia('(prefers-color-scheme: dark)').matches
			} else {
				// Обычное переключение темы
				this.isDark = !this.isDark
			}

			// Сохраняем только при ручном управлении
			if (!this.isSystemPreference) {
				localStorage.setItem('theme', this.isDark ? 'dark' : 'light')
			} else {
				localStorage.removeItem('theme')
			}

			this.applyTheme()
		},

		applyTheme() {
			if (this.isDark) {
				document.documentElement.classList.add('dark-theme')
			} else {
				document.documentElement.classList.remove('dark-theme')
			}
		},

		watchSystemPreference() {
			const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

			const handler = (e: MediaQueryListEvent) => {
				if (this.isSystemPreference) {
					this.isDark = e.matches
					this.applyTheme()
				}
			}

			mediaQuery.addEventListener('change', handler)

			// Функция для отмены подписки
			return () => mediaQuery.removeEventListener('change', handler)
		},
	},
})
