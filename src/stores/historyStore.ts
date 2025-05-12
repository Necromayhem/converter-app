import { defineStore } from 'pinia'
import { ref, watch, type Ref } from 'vue'

interface ConversionRecord {
  id: number
  amount: number
  fromCurrency: string
  toCurrency: string
  convertedAmount: string
}

export const useHistoryStore = defineStore('history', () => {
  const history: Ref<ConversionRecord[]> = ref([])
  
  // Загрузка из localStorage при инициализации
  const savedHistory = localStorage.getItem('conversionHistory')
  if (savedHistory) {
    try {
      history.value = JSON.parse(savedHistory) as ConversionRecord[]
    } catch (e) {
      console.error('Failed to parse history from localStorage', e)
      localStorage.removeItem('conversionHistory')
    }
  }

  // Автосохранение в localStorage при изменениях
  watch(
    history,
    (newHistory) => {
      localStorage.setItem('conversionHistory', JSON.stringify(newHistory))
    },
    { deep: true }
  )

  function addRecord(record: Omit<ConversionRecord, 'id'>): void {
    history.value.unshift({
      id: Date.now(),
      ...record
    })
  }

  function removeRecord(id: number): void {
    history.value = history.value.filter(record => record.id !== id)
  }

  function clearHistory(): void {
    history.value = []
  }

  return { 
    history, 
    addRecord, 
    removeRecord, 
    clearHistory 
  }
})