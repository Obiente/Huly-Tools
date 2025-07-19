/**
 * Configuration actions - save and test functionality
 */
import { useAdminApi } from './useAdminApi'
import { useUI } from './useUI'
import type { Ref } from 'vue'

export function useConfigActions() {
  const { config, updateConfig, testConnection } = useAdminApi()
  const { showSuccess, showError, setLoading } = useUI()

  /**
   * Save configuration and test connection
   */
  async function saveConfiguration(
    apiEndpoint: string,
    apiKey: string,
    connectionStatus: Ref<'success' | 'error' | null>,
    validateForm: () => boolean
  ) {
    if (!validateForm()) {
      showError('Validation Error', 'Please fix the errors in the form')
      return
    }

    setLoading('config', true)
    
    try {
      // Update configuration
      updateConfig({
        endpoint: apiEndpoint,
        apiKey: apiKey
      })

      // Test the connection
      const isValid = await testConnection()
      
      if (isValid) {
        showSuccess('Configuration Saved', 'API connection verified successfully')
        connectionStatus.value = 'success'
        
        // Configuration saved successfully - handled by parent component
      } else {
        connectionStatus.value = 'error'
        showError('Connection Failed', 'Unable to connect to the API with the provided configuration')
      }
    } catch (error) {
      connectionStatus.value = 'error'
      const message = error instanceof Error ? error.message : 'Unknown error occurred'
      showError('Configuration Error', message)
    } finally {
      setLoading('config', false)
    }
  }

  /**
   * Test connection without saving
   */
  async function testConnectionOnly(
    apiEndpoint: string,
    apiKey: string,
    connectionStatus: Ref<'success' | 'error' | null>
  ) {
    if (!apiEndpoint || !apiKey) {
      showError('Missing Information', 'Please enter both API endpoint and key')
      return
    }

    setLoading('test', true)
    connectionStatus.value = null
    
    try {
      // Store current config
      const originalConfig = { ...config }
      
      // Temporarily update config for testing
      updateConfig({
        endpoint: apiEndpoint,
        apiKey: apiKey
      })

      // Test connection
      const isValid = await testConnection()
      
      if (isValid) {
        connectionStatus.value = 'success'
        showSuccess('Connection Successful', 'API connection verified')
      } else {
        connectionStatus.value = 'error'
        showError('Connection Failed', 'Unable to connect to the API')
      }

      // Restore original config if it was different
      if (originalConfig.endpoint !== apiEndpoint || originalConfig.apiKey !== apiKey) {
        updateConfig(originalConfig)
      }
    } catch (error) {
      connectionStatus.value = 'error'
      const message = error instanceof Error ? error.message : 'Connection test failed'
      showError('Test Failed', message)
    } finally {
      setLoading('test', false)
    }
  }

  return {
    saveConfiguration,
    testConnectionOnly
  }
}
