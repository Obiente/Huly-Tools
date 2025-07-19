<template>
  <div class="form-group">
    <label 
      v-if="label" 
      :for="id"
      class="block text-sm font-medium text-gray-300 mb-2"
    >
      {{ label }}
      <span v-if="required" class="text-red-400">*</span>
    </label>
    <div class="relative">
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :v-model="modelValue"
        :placeholder="placeholder"
        :required="required"
        :disabled="loading"
        :class="inputClasses"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        @blur="$emit('blur')"
        @focus="$emit('focus')"
      />
      
      <div v-if="loading" class="absolute right-3 top-1/2 transform -translate-y-1/2">
        <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
      </div>
    </div>
    
    <div v-if="error" class="mt-1 text-sm text-red-400">
      {{ error }}
    </div>
    
    <div v-if="hint" class="mt-1 text-sm text-gray-500">
      {{ hint }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: string
  label?: string
  type?: string
  placeholder?: string
  required?: boolean
  loading?: boolean
  error?: string
  hint?: string
  id?: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'blur'): void
  (e: 'focus'): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  label: '',
  type: 'text',
  placeholder: '',
  required: false,
  loading: false,
  error: '',
  hint: '',
  id: ''
})

defineEmits<Emits>()

const inputClasses = computed(() => [
  'w-full px-3 py-2 border rounded-md transition-colors',
  'bg-gray-700 text-white placeholder-gray-400',
  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
  props.error 
    ? 'border-red-500 focus:ring-red-500' 
    : 'border-gray-600 hover:border-gray-500',
  props.loading && 'pr-10',
  props.loading && 'opacity-75 cursor-not-allowed'
])
</script>
