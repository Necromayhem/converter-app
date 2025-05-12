import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useHistoryStore = defineStore('history', () => {
  const history = ref([])
  
  if (localStorage.getItem('conversionHistory')) {
    history.value = JSON.parse(localStorage.getItem('conversionHistory'))
  }

  watch(history, (newHistory) => {
    localStorage.setItem('conversionHistory', JSON.stringify(newHistory))
  }, { deep: true })

  function addRecord(record) {
    history.value.unshift({
      id: Date.now(),
      ...record
    })
  }

  function removeRecord(id) {
    history.value = history.value.filter(record => record.id !== id)
  }

  function clearHistory() {
    history.value = []
  }

  return { history, addRecord, removeRecord, clearHistory }
})