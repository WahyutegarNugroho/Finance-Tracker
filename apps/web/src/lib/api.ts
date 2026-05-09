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
 * Core fetch wrapper with auth token injection
 */
const fetchWithAuth = async (endpoint: string, options: RequestInit = {}, params?: Record<string, string | number>) => {
  // Get Firebase ID token if user is logged in
  let token = '';
  if (auth.currentUser) {
    token = await auth.currentUser.getIdToken();
  }

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  // Construct URL with query parameters if provided
  let url = `${API_BASE_URL}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, String(value));
    });
    url += `?${searchParams.toString()}`;
  }

  console.log(`[API Fetch] Calling: ${url}`);

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Check if response is actually JSON before parsing
  const contentType = response.headers.get("content-type");
  let data;
  
  if (contentType && contentType.includes("application/json")) {
    data = await response.json();
  } else {
    const text = await response.text();
    console.error(`[API Fetch Error] Expected JSON, got: ${contentType}\nResponse snippet: ${text.substring(0, 150)}`);
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
    
  post: (endpoint: string, body: unknown, options?: RequestInit) => 
    fetchWithAuth(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
    
  put: (endpoint: string, body: unknown, options?: RequestInit) => 
    fetchWithAuth(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),
    
  delete: (endpoint: string, options?: RequestInit) => 
    fetchWithAuth(endpoint, { ...options, method: 'DELETE' }),
};
