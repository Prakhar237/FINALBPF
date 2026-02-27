import { API_CONFIG } from '@/config/api';

export interface ApiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
  error?: {
    message: string;
    code: number;
  };
}

export const fetchVerses = async (
  userInput: string,
  bibleVersion: string = 'KJV',
  onVerse?: (verse: string) => void
): Promise<string[]> => {
  try {
    if (!API_CONFIG.API_KEY) {
      throw new Error('API key not found');
    }

    const bibleVersionNames: { [key: string]: string } = {
      'KJV': 'King James Version of the Bible',
      'NIV': 'New International Version of the Bible',
      'ESV': 'English Standard Version of the Bible',
      'NLT': 'New Living Translation of the Bible',
      'MSG': 'The Message Version of the Bible'
    };

    const fullBibleVersion = bibleVersionNames[bibleVersion] || 'King James Version of the Bible';

    const prompt = `Search for the solution of the problem: ${userInput} and give 21 direct answers in the form of Bible verses from the ${fullBibleVersion} that sympathize and provide guidance. For each verse, expand on its meaning with an additional 20-30 words of explanation or context while preserving the original message. Make sure each verse and explanation are clearly connected. Format the response with each verse numbered (1., 2., etc.) and clearly separated.`;

    const requestBody = {
      contents: [{
        parts: [{ text: prompt }]
      }]
    };

    const response = await fetch(`${API_CONFIG.BASE_URL}?key=${API_CONFIG.API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API Error: ${errorData.error?.message || 'Unknown error'} (Status: ${response.status})`);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('ReadableStream not supported');

    const decoder = new TextDecoder();
    let accumulatedContent = '';
    let allVerses: string[] = [];
    let currentVerseIndex = 1;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      accumulatedContent += chunk;

      try {
        const textMatches = accumulatedContent.match(/"text":\s*"((?:[^"\\]|\\.)*)"/g);
        if (textMatches) {
          let fullText = '';
          textMatches.forEach(match => {
            const text = match.match(/"text":\s*"((?:[^"\\]|\\.)*)"/)?.[1];
            if (text) {
              const unescaped = text.replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\');
              fullText += unescaped;
            }
          });

          const parts = fullText.split(/\d+\.\s+/).filter(v => v.trim().length > 0);

          // Only emit verses that we know are finished (because we found the next number)
          if (parts.length > allVerses.length + 1) {
            for (let i = allVerses.length; i < parts.length - 1; i++) {
              const cleanedVerse = parts[i].replace(/\*/g, '').trim();
              if (cleanedVerse) {
                allVerses.push(cleanedVerse);
                if (onVerse) onVerse(cleanedVerse);
              }
            }
          }
        }
      } catch (e) {
        console.error('Error parsing stream chunk:', e);
      }
    }

    // Final pass to emit anything remaining
    const finalMatches = accumulatedContent.match(/"text":\s*"((?:[^"\\]|\\.)*)"/g);
    if (finalMatches) {
      let finalFullText = '';
      finalMatches.forEach(match => {
        const text = match.match(/"text":\s*"((?:[^"\\]|\\.)*)"/)?.[1];
        if (text) {
          const unescaped = text.replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\');
          finalFullText += unescaped;
        }
      });
      const finalParts = finalFullText.split(/\d+\.\s+/).filter(v => v.trim().length > 0);
      for (let i = allVerses.length; i < finalParts.length; i++) {
        const cleanedVerse = finalParts[i].replace(/\*/g, '').trim();
        if (cleanedVerse) {
          allVerses.push(cleanedVerse);
          if (onVerse) onVerse(cleanedVerse);
        }
      }
    }

    return allVerses;
  } catch (error) {
    console.error('Error fetching verses:', error);
    throw error;
  }
};


