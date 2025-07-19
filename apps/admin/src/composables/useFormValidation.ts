/**
 * Form validation composable
 * Provides reactive form validation utilities
 */

import { ref, reactive, computed, watch, readonly } from 'vue'
import type { Ref, ComputedRef } from 'vue'

export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: any) => string | null
  message?: string
}

export interface FieldValidation {
  value: any
  rules: ValidationRule[]
  error: string | null
  touched: boolean
}

export interface FormValidation {
  [fieldName: string]: FieldValidation
}

export function useFormValidation() {
  const form = reactive<FormValidation>({})

  // Add a field to the form
  function addField(
    name: string,
    initialValue: any = '',
    rules: ValidationRule[] = []
  ) {
    form[name] = {
      value: initialValue,
      rules,
      error: null,
      touched: false
    }

    // Watch for changes to validate the field
    watch(
      () => form[name]?.value,
      () => {
        if (form[name]?.touched) {
          validateField(name)
        }
      }
    )
  }

  // Remove a field from the form
  function removeField(name: string) {
    delete form[name]
  }

  // Get field value
  function getFieldValue(name: string) {
    return form[name]?.value
  }

  // Set field value
  function setFieldValue(name: string, value: any) {
    if (form[name]) {
      form[name].value = value
    }
  }

  // Mark field as touched
  function touchField(name: string) {
    if (form[name]) {
      form[name].touched = true
      validateField(name)
    }
  }

  // Validate a single field
  function validateField(name: string): boolean {
    const field = form[name]
    if (!field) return true

    field.error = null

    for (const rule of field.rules) {
      const error = validateRule(field.value, rule)
      if (error) {
        field.error = error
        return false
      }
    }

    return true
  }

  // Validate a single rule
  function validateRule(value: any, rule: ValidationRule): string | null {
    // Required validation
    if (rule.required && (!value || value.toString().trim() === '')) {
      return rule.message || 'This field is required'
    }

    // Skip other validations if value is empty and not required
    if (!value || value.toString().trim() === '') {
      return null
    }

    // String validations
    if (typeof value === 'string') {
      // Minimum length
      if (rule.minLength && value.length < rule.minLength) {
        return rule.message || `Minimum length is ${rule.minLength} characters`
      }

      // Maximum length
      if (rule.maxLength && value.length > rule.maxLength) {
        return rule.message || `Maximum length is ${rule.maxLength} characters`
      }

      // Pattern validation
      if (rule.pattern && !rule.pattern.test(value)) {
        return rule.message || 'Invalid format'
      }
    }

    // Custom validation
    if (rule.custom) {
      return rule.custom(value)
    }

    return null
  }

  // Validate all fields
  function validateForm(): boolean {
    let isValid = true
    
    for (const fieldName in form) {
      form[fieldName].touched = true
      if (!validateField(fieldName)) {
        isValid = false
      }
    }

    return isValid
  }

  // Reset form
  function resetForm() {
    for (const fieldName in form) {
      form[fieldName].error = null
      form[fieldName].touched = false
    }
  }

  // Clear form values
  function clearForm() {
    for (const fieldName in form) {
      form[fieldName].value = ''
      form[fieldName].error = null
      form[fieldName].touched = false
    }
  }

  // Get form data as object
  function getFormData(): Record<string, any> {
    const data: Record<string, any> = {}
    for (const fieldName in form) {
      data[fieldName] = form[fieldName].value
    }
    return data
  }

  // Set form data from object
  function setFormData(data: Record<string, any>) {
    for (const fieldName in data) {
      if (form[fieldName]) {
        form[fieldName].value = data[fieldName]
      }
    }
  }

  // Computed properties
  const isFormValid: ComputedRef<boolean> = computed(() => {
    return Object.values(form).every(field => !field.error)
  })

  const hasErrors: ComputedRef<boolean> = computed(() => {
    return Object.values(form).some(field => field.error !== null)
  })

  const isTouched: ComputedRef<boolean> = computed(() => {
    return Object.values(form).some(field => field.touched)
  })

  const formErrors: ComputedRef<string[]> = computed(() => {
    return Object.values(form)
      .filter(field => field.error !== null)
      .map(field => field.error as string)
  })

  return {
    // Form state
    form: readonly(form),
    
    // Field management
    addField,
    removeField,
    getFieldValue,
    setFieldValue,
    touchField,

    // Validation
    validateField,
    validateForm,
    resetForm,
    clearForm,

    // Data management
    getFormData,
    setFormData,

    // Computed properties
    isFormValid,
    hasErrors,
    isTouched,
    formErrors
  }
}

// Common validation rules
export const validationRules = {
  required: { required: true },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address'
  },
  url: {
    pattern: /^https?:\/\/.+/,
    message: 'Please enter a valid URL'
  },
  minLength: (length: number) => ({
    minLength: length,
    message: `Minimum length is ${length} characters`
  }),
  maxLength: (length: number) => ({
    maxLength: length,
    message: `Maximum length is ${length} characters`
  }),
  apiKey: {
    minLength: 10,
    pattern: /^[a-zA-Z0-9_-]+$/,
    message: 'API key must be at least 10 characters and contain only letters, numbers, hyphens, and underscores'
  }
}
