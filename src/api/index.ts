/**
 * API Module Barrel Export
 * Centralized exports for all API-related modules
 */

// Client
export { apiClient, ApiError, NetworkError, ValidationError } from './client'
export type { HttpRequestConfig, ApiResponse } from './client'

// Routes
export { BOND_ROUTES } from './routes/bond.routes'

// Services
export { bondService } from './services/bond.service'
export type { BondCalculationApiResponse } from './services/bond.service'
