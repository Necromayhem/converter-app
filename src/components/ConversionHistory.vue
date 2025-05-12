<script setup lang="ts">
import { useHistoryStore } from '@/stores/historyStore'

const historyStore = useHistoryStore()

const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleString()
}
</script>

<template>
  <div class="history-container">
    <h3>История конвертаций</h3>
    
    <div v-if="historyStore.history.length === 0" class="empty-history">
      История конвертаций пуста
    </div>
    
    <ul v-else class="history-list">
      <li v-for="record in historyStore.history" :key="record.id" class="history-item">
        <div class="history-details">
          <span>{{ record.amount }} {{ record.fromCurrency }} → {{ record.convertedAmount }} {{ record.toCurrency }}</span>
          <span class="history-date">{{ formatDate(record.id) }}</span>
        </div>
        <button @click="historyStore.removeRecord(record.id)" class="delete-btn">×</button>
      </li>
    </ul>
    
    <button 
      v-if="historyStore.history.length > 0" 
      @click="historyStore.clearHistory" 
      class="clear-btn"
    >
      Очистить историю
    </button>
  </div>
</template>

<style scoped>
.history-container {
  margin-top: 2rem;
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.history-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
}

.history-details {
  display: flex;
  flex-direction: column;
}

.history-date {
  font-size: 0.8rem;
  color: #666;
}

.delete-btn {
  background: none;
  border: none;
  color: #ff4444;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0 0.5rem;
}

.clear-btn {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #ff4444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.empty-history {
  color: #666;
  font-style: italic;
}
</style>