/**
 * API Client Configuration and Base HTTP Client
 * Provides a centralized HTTP client with error handling, interceptors, and type safety
 */

import { API_BASE_URL } from '@/config/api'

// ============================================================================
// Types
// ============================================================================
export interface HttpRequestConfig extends RequestInit {
  params?: Record<string, string | number>
}

export interface ApiResponse<T> {
  data: T
  status: number
  statusText: string
  headers: Headers
}

// ============================================================================
// Error Classes
// ============================================================================
export class ApiError extends Error {
  statusCode: number
  response?: unknown
  details?: unknown

  constructor(
    message: string,
    statusCode: number,
    response?: unknown,
    details?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    this.response = response
    this.details = details
    Object.setPrototypeOf(this, ApiError.prototype)
  }
}

export class NetworkError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'NetworkError'
    Object.setPrototypeOf(this, NetworkError.prototype)
  }
}

export class ValidationError extends Error {
  fields?: Record<string, string>

  constructor(message: string, fields?: Record<string, string>) {
    super(message)
    this.name = 'ValidationError'
    this.fields = fields
    Object.setPrototypeOf(this, ValidationError.prototype)
  }
}

// ============================================================================
// HTTP Client Class
// ============================================================================
class HttpClient {
  private baseUrl: string
  private defaultHeaders: Record<string, string>

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
  }

  /**
   * Build query string from params object
   */
  private buildQueryString(params?: Record<string, string | number>): string {
    if (!params) return ''
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, String(value))
    })
    return searchParams.toString()
  }

  /**
   * Get full URL with query parameters
   */
  private getUrl(endpoint: string, params?: Record<string, string | number>): string {
    const queryString = this.buildQueryString(params)
    const url = `${this.baseUrl}${endpoint}`
    return queryString ? `${url}?${queryString}` : url
  }

  /**
   * Parse error response
   */
  private async parseErrorResponse(response: Response): Promise<{ message: string; details?: unknown }> {
    try {
      const data = await response.json()
      if (typeof data === 'object' && data !== null) {
        const record = data as Record<string, unknown>
        const message = typeof record.message === 'string' ? record.message
          : typeof record.error === 'string' ? record.error
          : typeof record.detail === 'string' ? record.detail
          : response.statusText

        // Include additional details for debugging
        const details = record.error !== undefined || record.detail !== undefined
          ? { ...record }
          : undefined

        return { message, details }
      }
      return { message: response.statusText }
    } catch {
      return { message: response.statusText }
    }
  }

  /**
   * Core HTTP request method
   */
  private async request<T>(
    endpoint: string,
    config: HttpRequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const { params, headers = {}, ...restConfig } = config
    const url = this.getUrl(endpoint, params)

    const requestInit: RequestInit = {
      ...restConfig,
      headers: {
        ...this.defaultHeaders,
        ...headers,
      },
    }

    try {
      const response = await fetch(url, requestInit)

      // Handle HTTP errors
      if (!response.ok) {
        const errorResponse = await this.parseErrorResponse(response)

        // Handle specific status codes
        if (response.status === 400) {
          throw new ValidationError(errorResponse.message)
        }

        if (response.status === 401) {
          throw new ApiError('Unauthorized: Please check your credentials', response.status, undefined, errorResponse.details)
        }

        if (response.status === 403) {
          throw new ApiError('Forbidden: You do not have access to this resource', response.status, undefined, errorResponse.details)
        }

        if (response.status === 404) {
          throw new ApiError('Resource not found', response.status, undefined, errorResponse.details)
        }

        if (response.status >= 500) {
          throw new ApiError('Server error: Please try again later', response.status, errorResponse.details, errorResponse.details)
        }

        throw new ApiError(errorResponse.message, response.status, errorResponse.details)
      }

      const data = await response.json()

      return {
        data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      }
    } catch (error) {
      // Re-throw known errors
      if (error instanceof ApiError || error instanceof ValidationError) {
        throw error
      }

      // Handle network errors
      if (error instanceof TypeError) {
        throw new NetworkError(
          'Unable to connect to the server. Please check your internet connection.'
        )
      }

      // Handle AbortError
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new NetworkError('Request was cancelled')
      }

      // Unknown errors
      throw new NetworkError(
        error instanceof Error ? error.message : 'An unexpected error occurred'
      )
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, config?: HttpRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'GET' })
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    body?: unknown,
    config?: HttpRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    body?: unknown,
    config?: HttpRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  /**
   * PATCH request
   */
  async patch<T>(
    endpoint: string,
    body?: unknown,
    config?: HttpRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, config?: HttpRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' })
  }
}

// ============================================================================
// Export singleton instance
// ============================================================================
export const apiClient = new HttpClient(API_BASE_URL)
