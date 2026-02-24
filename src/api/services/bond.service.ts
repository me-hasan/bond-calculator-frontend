/**
 * Bond API Service
 * Handles all bond-related API operations
 */

import { apiClient, ApiError, NetworkError, ValidationError } from '@/api/client'
import { BOND_ROUTES } from '@/api/routes/bond.routes'
import type { BondCalculationRequest, BondCalculationResponse } from '@/types/bond'

// ============================================================================
// Request/Response Types
// ============================================================================
export type BondCalculationApiResponse = BondCalculationResponse

// ============================================================================
// Bond Service
// ============================================================================
export class BondService {
  private readonly client = apiClient

  /**
   * Calculate bond metrics including yield to maturity, duration, and present value
   * @param request - Bond calculation parameters
   * @returns Bond calculation results with metrics and cashflows
   * @throws {ApiError} - HTTP errors with status code
   * @throws {NetworkError} - Network/fetch errors
   * @throws {ValidationError} - Request validation errors
   */
  async calculateBond(request: BondCalculationRequest): Promise<BondCalculationApiResponse> {
    try {
      const response = await this.client.post<BondCalculationApiResponse>(
        BOND_ROUTES.CALCULATE,
        request
      )

      return response.data
    } catch (error) {
      this.handleError(error, 'Failed to calculate bond metrics')
    }
  }

  /**
   * Centralized error handling with context-aware messages
   */
  private handleError(error: unknown, context: string): never {
    if (error instanceof ApiError || error instanceof NetworkError || error instanceof ValidationError) {
      throw error
    }

    if (error instanceof Error) {
      throw new NetworkError(`${context}: ${error.message}`)
    }

    throw new NetworkError(context)
  }
}

// ============================================================================
// Export singleton instance
// ============================================================================
export const bondService = new BondService()

// Re-export error types for convenience
export { ApiError, NetworkError, ValidationError }
