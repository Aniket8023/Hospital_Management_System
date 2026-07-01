import toast from 'react-hot-toast';

const STORAGE_KEY = 'app_errors';

/**
 * Saves an error message to localStorage under the unified 'app_errors' key.
 * Errors are stored as a JSON array of { message, timestamp, source } objects.
 * Only the most recent 50 errors are kept to prevent unbounded storage growth.
 */
export const saveErrorToLocalStorage = (message, source = 'unknown') => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const errors = stored ? JSON.parse(stored) : [];
    errors.push({
      message: String(message),
      timestamp: new Date().toISOString(),
      source,
    });
    // Keep only the most recent 50 errors
    const trimmed = errors.slice(-50);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch (e) {
    console.error('Failed to save error to localStorage:', e);
  }
};

/**
 * Installs global error listeners (window.onerror, unhandledrejection) that
 * automatically capture runtime errors and unhandled promise rejections
 * into localStorage. Should be called once at app startup (e.g. in main.jsx).
 */
export const installGlobalErrorCapture = () => {
  // Capture synchronous errors
  window.addEventListener('error', (event) => {
    const msg = event.message || 'Unknown error';
    saveErrorToLocalStorage(msg, 'runtime');
  });

  // Capture unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const msg = event.reason?.message || event.reason || 'Unhandled promise rejection';
    saveErrorToLocalStorage(String(msg), 'promise');
  });
};

/**
 * Checks localStorage for stored error messages, displays them as toast notifications,
 * and clears them so they do not repeat on subsequent renders or page refreshes.
 */
export const showLocalStorageErrors = () => {
  try {
    const errorKeys = ['errors', 'localStorageErrors', STORAGE_KEY];

    errorKeys.forEach(key => {
      const stored = localStorage.getItem(key);
      if (stored) {
        try {
          // Attempt to parse if it is stored as a JSON array or object
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            parsed.forEach(err => {
              if (err) {
                const msg = typeof err === 'object'
                  ? (err.message || err.error || JSON.stringify(err))
                  : String(err);
                toast.error(msg, { duration: 5000 });
              }
            });
          } else if (parsed && typeof parsed === 'object') {
            const msg = parsed.message || parsed.error || JSON.stringify(parsed);
            toast.error(String(msg), { duration: 5000 });
          } else {
            toast.error(String(parsed), { duration: 5000 });
          }
        } catch (e) {
          // If not a valid JSON, display it as a plain text string
          toast.error(stored, { duration: 5000 });
        }
        // Remove from localStorage to prevent repeating the toasts
        localStorage.removeItem(key);
      }
    });
  } catch (err) {
    console.error('Failed to read or clear local storage errors:', err);
  }
};
