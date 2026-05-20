// Basic obfuscation helper
const decodeKey = (encoded: string) => {
  if (!encoded) return '';
  try {
    // Check if we are in a browser environment where atob is available
    return typeof atob === 'function' ? atob(encoded) : Buffer.from(encoded, 'base64').toString();
  } catch (e) {
    console.error('Failed to decode API key:', e);
    return '';
  }
};

export const API_CONFIG = {
  BASE_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent',
  API_KEY: import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY || 'AIzaSyCocBw9Y7nnkzSpegkN7H3lU9jbYPTlEaQ',
};

export const getApiUrl = () => {
  return `${API_CONFIG.BASE_URL}?key=${API_CONFIG.API_KEY}`;
}; 