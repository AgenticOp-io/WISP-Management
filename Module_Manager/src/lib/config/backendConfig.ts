// Backend Configuration
// Centralized configuration for backend API endpoints

export interface BackendConfig {
  // Main backend API
  backendApiUrl: string;
  
  // STUN/TURN configuration
  stun: {
    server: string;
    port: number;
  };
  
  // Timeouts and limits
  timeout: number;
  maxRetries: number;
}

// Get configuration from environment variables
function getBackendConfig(): BackendConfig {
  // Check if we're running on the server side
  const isServer = typeof window === 'undefined';
  
  // For server-side, use import.meta.env
  // For client-side, these should be available as PUBLIC_ prefixed
  const getEnv = (key: string): string => {
    if (isServer) {
      return import.meta.env[key] || '';
    }
    // Client-side access through window or import.meta.env
    return import.meta.env[key] || '';
  };
  
  const backendApiUrl = getEnv('PUBLIC_BACKEND_API_URL') || 'http://localhost:3000/api';
  const stunServer = getEnv('PUBLIC_STUN_SERVER') || 'stun:localhost:3478';
  
  // Parse STUN server
  const stunMatch = stunServer.match(/^stun:([^:]+):(\d+)$/);
  const stunHost = stunMatch ? stunMatch[1] : 'localhost';
  const stunPort = stunMatch ? parseInt(stunMatch[2]) : 3478;
  
  return {
    backendApiUrl,
    stun: {
      server: `stun:${stunHost}:${stunPort}`,
      port: stunPort
    },
    timeout: 30000,
    maxRetries: 3
  };
}

// Export singleton instance
export const backendConfig = getBackendConfig();

// Helper function to build API URLs
export function buildApiUrl(path: string): string {
  const base = backendConfig.backendApiUrl.replace(/\/$/, '');
  const cleanPath = path.replace(/^\//, '');
  return `${base}/${cleanPath}`;
}


// Validate configuration
export function validateBackendConfig(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!backendConfig.backendApiUrl) {
    errors.push('Backend API URL is not configured');
  }
  
  if (!backendConfig.stun.server) {
    errors.push('STUN server is not configured');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// Log configuration on startup (server-side only)
if (typeof window === 'undefined') {
  console.log('Backend Configuration:', {
    backendApiUrl: backendConfig.backendApiUrl,
    stunServer: backendConfig.stun.server
  });
  
  const validation = validateBackendConfig();
  if (!validation.valid) {
    console.warn('Backend configuration validation errors:', validation.errors);
  }
}

