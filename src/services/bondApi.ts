import { API_BASE_URL } from '@/config/api'
import type { BondCalculationRequest, BondCalculationResponse } from '@/types/bond'

class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public response?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

class NetworkError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'NetworkError'
  }
}

export { ApiError, NetworkError }

export const bondApi = {
  /**
   * Calculate bond metrics and cashflow schedule
   * @param request - Bond calculation parameters
   * @returns Bond calculation response with metrics and cashflows
   * @throws {ApiError} - HTTP errors with status code
   * @throws {NetworkError} - Network/fetch errors
   */
  async calculateBond(request: BondCalculationRequest): Promise<BondCalculationResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/bond/calculate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(request),
      })

      // Handle HTTP error status codes
      if (!response.ok) {
        let errorMessage = `HTTP Error: ${response.status} ${response.statusText}`
        let errorData: unknown

        try {
          errorData = await response.json()
          if (typeof errorData === 'object' && errorData !== null) {
            const data = errorData as Record<string, unknown>
            if (typeof data.message === 'string') {
              errorMessage = data.message
            } else if (typeof data.error === 'string') {
              errorMessage = data.error
            }
          }
        } catch {
          // If parsing fails, use default error message
        }

        throw new ApiError(errorMessage, response.status, errorData)
      }

      // Parse and validate response
      const data = (await response.json()) as BondCalculationResponse

      // Basic validation of required fields
      if (!data || typeof data !== 'object') {
        throw new ApiError('Invalid response format', 500)
      }

      return data
    } catch (error) {
      // Re-throw known errors
      if (error instanceof ApiError) {
        throw error
      }

      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new NetworkError(
          'Unable to connect to the server. Please check your internet connection.'
        )
      }

      // Handle AbortError (request cancelled)
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new NetworkError('Request was cancelled')
      }

      // Unknown errors
      throw new NetworkError(
        error instanceof Error ? error.message : 'An unexpected error occurred'
      )
    }
  },
}
