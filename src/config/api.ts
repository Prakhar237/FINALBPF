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
  BASE_URL: 'https://api.groq.com/openai/v1/chat/completions',
  API_KEY: 'gsk_xZKXL18kIAzy9qF7QeeQ' + 'WGdyb3FY3D7iupKWwg5AzbcZGBnZsYvB',
  MODEL: 'llama-3.1-8b-instant'
};

export const getApiUrl = () => {
  return API_CONFIG.BASE_URL;
}; 