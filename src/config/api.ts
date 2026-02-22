export const API_CONFIG = {
  BASE_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent',
  API_KEY: 'AIzaSyA19C0H0YtF9Xf8_5lntVd53JzSQ-1rE1A',
};

export const getApiUrl = () => {
  return `${API_CONFIG.BASE_URL}?key=${API_CONFIG.API_KEY}`;
}; 