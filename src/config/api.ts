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
  BASE_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:streamGenerateContent',
  API_KEY: decodeKey(import.meta.env.VITE_GEMINI_API_KEY || ''),
};

export const getApiUrl = () => {
  return `${API_CONFIG.BASE_URL}?key=${API_CONFIG.API_KEY}`;
}; 