/**
 * Client-side Observability & RUM monitoring
 */

export interface PerformanceMetric {
  name: string;
  value: number;
  rating?: 'good' | 'needs-improvement' | 'poor';
}

export function initObservability() {
  if (typeof window === 'undefined') return;

  // Window error tracking
  window.addEventListener('error', (event) => {
    // Filter out extensions or irrelevant noise
    if (process.env.NODE_ENV === 'development') {
      console.warn('[RUM Error]', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    }
  });

  // Unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[RUM Unhandled Rejection]', event.reason);
    }
  });
}
