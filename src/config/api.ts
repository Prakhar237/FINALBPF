// Basic obfuscation helper
const decodeKey = (encoded: string) => {
  try {
    return atob(encoded);
  } catch (e) {
    return '';
  }
};

export const API_CONFIG = {
  BASE_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent',
  API_KEY: decodeKey(import.meta.env.VITE_GEMINI_API_KEY || ''),
};

export const getApiUrl = () => {
  return `${API_CONFIG.BASE_URL}?key=${API_CONFIG.API_KEY}`;
}; 