<script setup>
import { useCurrencyConverter } from './composables/useCurrencyConverter'
import { useHistoryStore } from './stores/historyStore'
import ConversionHistory from './components/ConversionHistory.vue'

const {
  amount,
  fromCurrency,
  toCurrency,
  convertedAmount,
  currencies,
  isLoading,
  error,
  fetchExchangeRate,
  swapCurrencies
} = useCurrencyConverter()

const historyStore = useHistoryStore()

const convert = async () => {
  await fetchExchangeRate()
  if (!isLoading.value && !error.value) {
    historyStore.addRecord({
      amount: amount.value,
      fromCurrency: fromCurrency.value,
      toCurrency: toCurrency.value,
      convertedAmount: convertedAmount.value
    })
  }
}
</script>

<template>
  <div class="converter-app">
    <h1>Конвертер валют</h1>
    
    <div class="converter-container">
      <div class="input-group">
        <label for="amount">Сумма:</label>
        <input 
          id="amount" 
          type="number" 
          v-model.number="amount" 
          min="0" 
          step="0.01" 
          @keyup.enter="convert"
        />
      </div>
      
      <div class="currency-selectors">
        <div class="input-group">
          <label for="from-currency">Из:</label>
          <select id="from-currency" v-model="fromCurrency" @change="fetchExchangeRate">
            <option v-for="currency in currencies" :value="currency.code" :key="`from-${currency.code}`">
              {{ currency.name }} ({{ currency.code }})
            </option>
          </select>
        </div>
        
        <button @click="swapCurrencies" class="swap-btn" title="Поменять валюты местами">
          ↔
        </button>
        
        <div class="input-group">
          <label for="to-currency">В:</label>
          <select id="to-currency" v-model="toCurrency" @change="fetchExchangeRate">
            <option v-for="currency in currencies" :value="currency.code" :key="`to-${currency.code}`">
              {{ currency.name }} ({{ currency.code }})
            </option>
          </select>
        </div>
      </div>
      
      <div class="result-section">
        <button @click="convert" class="convert-btn" :disabled="isLoading">
          {{ isLoading ? 'Загрузка...' : 'Конвертировать' }}
        </button>
        
        <div v-if="error" class="error-message">{{ error }}</div>
        
        <div v-else class="result">
          <span v-if="convertedAmount !== null">
            {{ amount }} {{ fromCurrency }} = {{ convertedAmount }} {{ toCurrency }}
          </span>
        </div>
      </div>
    </div>
    
    <ConversionHistory />
  </div>
</template>

<style scoped>
.converter-app {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  font-family: Arial, sans-serif;
}

h1 {
  text-align: center;
  color: #2c3e50;
}

.converter-container {
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.input-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #333;
}

input, select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.currency-selectors {
  display: flex;
  align-items: flex-end;
  gap: 1rem;
}

.swap-btn {
  padding: 0.5rem 1rem;
  background-color: #f0f0f0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.2rem;
  height: fit-content;
}

.swap-btn:hover {
  background-color: #e0e0e0;
}

.result-section {
  margin-top: 1.5rem;
  text-align: center;
}

.convert-btn {
  padding: 0.75rem 1.5rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.convert-btn:hover {
  background-color: #369f6e;
}

.convert-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.result {
  margin-top: 1rem;
  font-size: 1.2rem;
  font-weight: bold;
  color: #2c3e50;
}

.error-message {
  color: #ff4444;
  margin-top: 1rem;
}

@media (max-width: 600px) {
  .converter-app {
    padding: 1rem;
  }
  
  .currency-selectors {
    flex-direction: column;
    align-items: stretch;
  }
  
  .swap-btn {
    align-self: center;
    margin: 0.5rem 0;
  }
}
</style>