import { auth } from './firebase';

// Use environment variable for API URL, fallback to localhost for development
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Standard API response wrapper
 */
class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(status: number, message: string, data?: unknown) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

/**
 * Core fetch wrapper with auth token injection and auto-refresh on 401
 */
const fetchWithAuth = async (endpoint: string, options: RequestInit = {}, params?: Record<string, string | number>, isRetry = false) => {
  let token = '';
  if (auth.currentUser) {
    token = await auth.currentUser.getIdToken();
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  if (options.headers) {
    Object.assign(headers, options.headers);
  }

  let url = `${API_BASE_URL}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, String(value));
    });
    url += `?${searchParams.toString()}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Auto-refresh token on 401 and retry once
  if (response.status === 401 && !isRetry && auth.currentUser) {
    try {
      const freshToken = await auth.currentUser.getIdToken(true);
      headers['Authorization'] = `Bearer ${freshToken}`;
      const retryResponse = await fetch(url, { ...options, headers });

      if (retryResponse.ok) {
        const retryContentType = retryResponse.headers.get("content-type");
        if (retryContentType && retryContentType.includes("application/json")) {
          return await retryResponse.json();
        }
      }

      if (retryResponse.status === 401) {
        await auth.signOut();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        throw new ApiError(401, 'Session expired. Please sign in again.');
      }

      // Replace response with retry response for downstream handling
      const contentType = retryResponse.headers.get("content-type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await retryResponse.json();
      } else {
        const text = await retryResponse.text();
        throw new ApiError(retryResponse.status, `Server returned non-JSON response (${retryResponse.status})`, { textSnippet: text.substring(0, 100) });
      }
      if (!retryResponse.ok) {
        throw new ApiError(retryResponse.status, data.message || 'An error occurred', data);
      }
      return data;
    } catch (refreshError) {
      if (refreshError instanceof ApiError) throw refreshError;
      throw new ApiError(401, 'Session expired. Please sign in again.');
    }
  }

  const contentType = response.headers.get("content-type");
  let data;
  
  if (contentType && contentType.includes("application/json")) {
    data = await response.json();
  } else {
    const text = await response.text();
    throw new ApiError(response.status, `Server returned non-JSON response (${response.status})`, { textSnippet: text.substring(0, 100) });
  }

  if (!response.ok) {
    throw new ApiError(response.status, data.message || 'An error occurred', data);
  }

  return data;
};

/**
 * API service object
 */
export const api = {
  get: (endpoint: string, options?: RequestInit & { params?: Record<string, string | number> }) => {
    const { params, ...fetchOptions } = options || {};
    return fetchWithAuth(endpoint, { ...fetchOptions, method: 'GET' }, params);
  },
    
  post: (endpoint: string, body?: unknown, options?: RequestInit) => 
    fetchWithAuth(endpoint, { ...options, method: 'POST', body: body ? JSON.stringify(body) : undefined }),
    
  put: (endpoint: string, body: unknown, options?: RequestInit) => 
    fetchWithAuth(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),
    
  delete: (endpoint: string, options?: RequestInit) => 
    fetchWithAuth(endpoint, { ...options, method: 'DELETE' }),
  
  deleteWithBody: (endpoint: string, body: unknown, options?: RequestInit) =>
    fetchWithAuth(endpoint, { ...options, method: 'DELETE', body: JSON.stringify(body) }),
};
