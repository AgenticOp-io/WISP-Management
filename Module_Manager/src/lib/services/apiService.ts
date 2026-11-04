// Authenticated API Service with Multi-Tenant Support
// Automatically adds Firebase JWT token and tenant context to all requests

import { browser } from '$app/environment';
import { getPublicEnv } from '$lib/config/publicEnv';
import { getBackendDirectBase } from '$lib/config/api';
import { authService } from './authService';

export class ApiService {
  private baseUrl: string;

  constructor() {
    const direct = browser ? getBackendDirectBase() : '';
    this.baseUrl = direct ? `${direct}/api` : browser ? '/api' : '';
  }

  /**
   * Get Firebase ID token for authenticated requests.
   * Uses getAuthTokenForApi for robust token retrieval (wait, force refresh, retries).
   */
  private async getAuthToken(): Promise<string | null> {
    return authService.getAuthTokenForApi();
  }

  /**
   * Get current tenant ID from localStorage
   */
  private getTenantId(): string | null {
    if (!browser) return null;
    const stored = localStorage.getItem('selectedTenantId');
    if (stored && stored.trim() !== '') return stored;
    const fromEnv = getPublicEnv('PUBLIC_SINGLE_TENANT_ID');
    if (fromEnv != null && fromEnv.trim() !== '') return fromEnv.trim();
    return null;
  }

  /**
   * Make authenticated API request with tenant context
   */
  private async makeRequest(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const token = await this.getAuthToken();
    const tenantId = this.getTenantId();

    const headers = new Headers(options.headers || {});
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    // Add auth token
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    // Add tenant ID to headers (backend expects X-Tenant-ID header)
    if (tenantId) {
      headers.set('X-Tenant-ID', tenantId);
    }

    // Build URL
    let url = `${this.baseUrl}${endpoint}`;
    let body = options.body;

    return fetch(url, {
      ...options,
      headers,
      body,
    });
  }

  /**
   * GET request with authentication
   */
  async get<T = any>(endpoint: string): Promise<{ success: boolean; data?: T; error?: string }> {
    try {
      const response = await this.makeRequest(endpoint, { method: 'GET' });
      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Request failed' };
      }

      return { success: true, data };
    } catch (error) {
      console.error(`API GET ${endpoint} failed:`, error);
      return { success: false, error: String(error) };
    }
  }

  /**
   * POST request with authentication
   */
  async post<T = any>(endpoint: string, payload?: any): Promise<{ success: boolean; data?: T; error?: string }> {
    try {
      const response = await this.makeRequest(endpoint, {
        method: 'POST',
        body: payload ? JSON.stringify(payload) : undefined,
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Request failed' };
      }

      return { success: true, data };
    } catch (error) {
      console.error(`API POST ${endpoint} failed:`, error);
      return { success: false, error: String(error) };
    }
  }

  /**
   * PUT request with authentication
   */
  async put<T = any>(endpoint: string, payload: any): Promise<{ success: boolean; data?: T; error?: string }> {
    try {
      const response = await this.makeRequest(endpoint, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Request failed' };
      }

      return { success: true, data };
    } catch (error) {
      console.error(`API PUT ${endpoint} failed:`, error);
      return { success: false, error: String(error) };
    }
  }

  /**
   * DELETE request with authentication
   */
  async delete<T = any>(endpoint: string): Promise<{ success: boolean; data?: T; error?: string }> {
    try {
      const response = await this.makeRequest(endpoint, { method: 'DELETE' });
      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Request failed' };
      }

      return { success: true, data };
    } catch (error) {
      console.error(`API DELETE ${endpoint} failed:`, error);
      return { success: false, error: String(error) };
    }
  }
}

// Singleton instance
export const apiService = new ApiService();

