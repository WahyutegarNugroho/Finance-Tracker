import { auth } from './firebase';

// Use environment variable for API URL, fallback to localhost for development
// ponytail: hardcoded localhost fallback → validate NEXT_PUBLIC_API_URL at build time when deploying
const API_BASE_URL = (() => {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (url) return url;
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'Missing NEXT_PUBLIC_API_URL environment variable. ' +
      'Set it in .env.local or your deployment dashboard.'
    );
  }
  return 'http://localhost:5000/api';
})();

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

const parseResponse = async (response: Response) => {
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return await response.json();
  }
  const text = await response.text();
  throw new ApiError(
    response.status,
    `Server returned non-JSON response (${response.status})`,
    { textSnippet: text.substring(0, 100) }
  );
};

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

  // ponytail: single retry → add request queue + backoff when concurrent 401s observed
  // Auto-refresh token on 401 and retry once
  if (response.status === 401 && !isRetry && auth.currentUser) {
    try {
      const freshToken = await auth.currentUser.getIdToken(true);
      headers['Authorization'] = `Bearer ${freshToken}`;
      const retryResponse = await fetch(url, { ...options, headers });

      if (retryResponse.ok) {
        return await parseResponse(retryResponse);
      }

      if (retryResponse.status === 401) {
        await auth.signOut();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        throw new ApiError(401, 'Session expired. Please sign in again.');
      }

      const data = await parseResponse(retryResponse);
      throw new ApiError(retryResponse.status, data.message || 'An error occurred', data);
    } catch (refreshError) {
      if (refreshError instanceof ApiError) throw refreshError;
      throw new ApiError(401, 'Session expired. Please sign in again.');
    }
  }

  const data = await parseResponse(response);

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
    
  delete: (endpoint: string, body?: unknown, options?: RequestInit) =>
    fetchWithAuth(endpoint, { ...options, method: 'DELETE', body: body ? JSON.stringify(body) : undefined }),
};
