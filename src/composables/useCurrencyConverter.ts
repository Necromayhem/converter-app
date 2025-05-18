import { ref, computed, type Ref } from 'vue'
import axios, { type AxiosResponse } from 'axios'

interface Currency {
	code: string
	name: string
}

interface ExchangeRateData {
	result: string
	'error-type'?: string
	conversion_rates: Record<string, number>
	time_last_update_utc: string
}

interface CachedRate {
	data: ExchangeRateData
	timestamp: number
}

interface CachedRates {
	[key: string]: CachedRate
}

export function useCurrencyConverter() {
	const amount: Ref<number> = ref(1)
	const fromCurrency: Ref<string> = ref('USD')
	const toCurrency: Ref<string> = ref('EUR')
	const exchangeRate: Ref<number | null> = ref(null)
	const isLoading: Ref<boolean> = ref(false)
	const error: Ref<string | null> = ref(null)
	const lastUpdated: Ref<Date | null> = ref(null)

	const API_KEY: string = '7e4360c7c3083a80f199c37a'
	const API_URL: string = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/`
	const CACHE_KEY: string = 'currencyExchangeRatesCache'
	const CACHE_EXPIRY: number = 14400000 // 4 часа

	// Инициализация кеша из localStorage
	const initializeCache = (): CachedRates => {
		const cachedData = localStorage.getItem(CACHE_KEY)
		return cachedData ? JSON.parse(cachedData) : {}
	}

	const cachedRates: Ref<CachedRates> = ref(initializeCache())

	const currencies: Ref<Currency[]> = ref([
		{ code: 'USD', name: 'Доллар США' },
		{ code: 'EUR', name: 'Евро' },
		{ code: 'GBP', name: 'Фунт стерлингов' },
		{ code: 'JPY', name: 'Японская иена' },
		{ code: 'CNY', name: 'Китайский юань' },
		{ code: 'INR', name: 'Индийская рупия' },
		{ code: 'CAD', name: 'Канадский доллар' },
		{ code: 'AUD', name: 'Австралийский доллар' },
		{ code: 'CHF', name: 'Швейцарский франк' },
		{ code: 'NZD', name: 'Новозеландский доллар' },
		{ code: 'SEK', name: 'Шведская крона' },
		{ code: 'NOK', name: 'Норвежская крона' },
		{ code: 'DKK', name: 'Датская крона' },
		{ code: 'SGD', name: 'Сингапурский доллар' },
		{ code: 'HKD', name: 'Гонконгский доллар' },
		{ code: 'KRW', name: 'Южнокорейская вона' },
		{ code: 'TRY', name: 'Турецкая лира' },
		{ code: 'BRL', name: 'Бразильский реал' },
		{ code: 'ZAR', name: 'Южноафриканский рэнд' },
		{ code: 'MXN', name: 'Мексиканское песо' },
		{ code: 'RUB', name: 'Российский рубль' },
		{ code: 'AED', name: 'Дирхам ОАЭ' },
		{ code: 'SAR', name: 'Саудовский риял' },
		{ code: 'THB', name: 'Тайский бат' },
		{ code: 'MYR', name: 'Малайзийский ринггит' },
		{ code: 'IDR', name: 'Индонезийская рупия' },
		{ code: 'PHP', name: 'Филиппинское песо' },
		{ code: 'ILS', name: 'Израильский шекель' },
		{ code: 'PLN', name: 'Польский злотый' },
		{ code: 'CZK', name: 'Чешская крона' },
		{ code: 'HUF', name: 'Венгерский форинт' },
		{ code: 'RON', name: 'Румынский лей' },
		{ code: 'HRK', name: 'Хорватская куна' },
		{ code: 'BGN', name: 'Болгарский лев' },
		{ code: 'ISK', name: 'Исландская крона' },
		{ code: 'UAH', name: 'Украинская гривна' },
		{ code: 'KZT', name: 'Казахстанский тенге' },
		{ code: 'BYN', name: 'Белорусский рубль' },
		{ code: 'CLP', name: 'Чилийское песо' },
		{ code: 'EGP', name: 'Египетский фунт' },
		{ code: 'PKR', name: 'Пакистанская рупия' },
		{ code: 'BDT', name: 'Бангладешская така' },
	])

	const convertedAmount = computed<string>(() => {
		if (!exchangeRate.value) return '0'
		return (amount.value * exchangeRate.value).toFixed(2)
	})

	// Сохранение данных в кеш
	const saveToCache = (currency: string, data: ExchangeRateData) => {
		const cacheEntry: CachedRate = {
			data,
			timestamp: Date.now(),
		}

		cachedRates.value[currency] = cacheEntry
		localStorage.setItem(CACHE_KEY, JSON.stringify(cachedRates.value))
	}

	// Проверка актуальности кеша
	const isCacheValid = (currency: string): boolean => {
		if (!cachedRates.value[currency]) return false

		const cacheAge = Date.now() - cachedRates.value[currency].timestamp
		return cacheAge < CACHE_EXPIRY
	}

	async function fetchExchangeRate(): Promise<void> {
		// Проверяем актуальный кеш
		if (cachedRates.value[fromCurrency.value]) {
			const cacheAge =
				Date.now() - cachedRates.value[fromCurrency.value].timestamp
			const cacheValid = cacheAge < CACHE_EXPIRY

			if (cacheValid) {
				console.log(
					`✅ Используется кеш (возраст: ${Math.floor(cacheAge / 60000)} мин.)`,
					cachedRates.value[fromCurrency.value].data
				)
				const cachedData = cachedRates.value[fromCurrency.value].data
				exchangeRate.value = cachedData.conversion_rates[toCurrency.value]
				lastUpdated.value = new Date(cachedData.time_last_update_utc)
				return
			}
		}

		console.log('🔄 Запрашиваем новые данные с API...')
		isLoading.value = true
		error.value = null

		try {
			const response = await axios.get(`${API_URL}${fromCurrency.value}`)

			if (response.data.result === 'success') {
				console.log('📥 Получены новые данные:', response.data)
				saveToCache(fromCurrency.value, response.data)
				exchangeRate.value = response.data.conversion_rates[toCurrency.value]
				lastUpdated.value = new Date(response.data.time_last_update_utc)
			}
		} catch (err) {
			console.error('❌ Ошибка при запросе:', err)
		} finally {
			isLoading.value = false
		}
	}

	const audioSwap = ref<HTMLAudioElement | null>(null)

	const playSwap = () => {
		if (!audioSwap.value) {
			audioSwap.value = new Audio('sounds/coins-swoosh.mp3')
			audioSwap.value.load()
		}
		audioSwap.value.currentTime = 0
		audioSwap.value.play()
	}

	function swapCurrencies(): void {
		const temp = fromCurrency.value
		fromCurrency.value = toCurrency.value
		toCurrency.value = temp
		fetchExchangeRate()
		playSwap()
	}

	fetchExchangeRate()

	return {
		amount,
		fromCurrency,
		toCurrency,
		convertedAmount,
		currencies,
		isLoading,
		error,
		lastUpdated,
		fetchExchangeRate,
		swapCurrencies,
	}
}
