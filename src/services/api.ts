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
      model: API_CONFIG.MODEL,
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      stream: true,
      temperature: 0.7
    };

    const response = await fetch(API_CONFIG.BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_CONFIG.API_KEY}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API Error: ${errorData.error?.message || 'Unknown error'} (Status: ${response.status})`);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('ReadableStream not supported');

    const decoder = new TextDecoder('utf-8');
    let accumulatedContent = '';
    let allVerses: string[] = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ') && line !== 'data: [DONE]') {
          try {
            const data = JSON.parse(line.slice(6));
            const content = data.choices[0]?.delta?.content || '';
            if (content) {
              accumulatedContent += content;

              // Parse the verses, handling markdown like **1.** and introductory text
              let contentToParse = accumulatedContent;
              const firstVerseIndex = contentToParse.search(/(?:^|\n)\s*\*{0,2}1[\.\)]\*{0,2}\s+/);
              if (firstVerseIndex !== -1) {
                contentToParse = contentToParse.substring(firstVerseIndex);
              } else {
                contentToParse = '';
              }
              
              const parts = contentToParse.split(/(?:^|\n)\s*\*{0,2}\d+[\.\)]\*{0,2}\s+/).filter(v => v.trim().length > 0);

              // Only emit verses that we know are finished
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
            // Ignore partial JSON parsing errors
          }
        }
      }
    }

    // Final pass to emit anything remaining
    let finalContent = accumulatedContent;
    const firstVerseIdx = finalContent.search(/(?:^|\n)\s*\*{0,2}1[\.\)]\*{0,2}\s+/);
    if (firstVerseIdx !== -1) {
      finalContent = finalContent.substring(firstVerseIdx);
    } else {
      finalContent = '';
    }
    
    const finalParts = finalContent.split(/(?:^|\n)\s*\*{0,2}\d+[\.\)]\*{0,2}\s+/).filter(v => v.trim().length > 0);
    for (let i = allVerses.length; i < finalParts.length; i++) {
      const cleanedVerse = finalParts[i].replace(/\*/g, '').trim();
      if (cleanedVerse) {
        allVerses.push(cleanedVerse);
        if (onVerse) onVerse(cleanedVerse);
      }
    }

    return allVerses;
  } catch (error) {
    console.error('Error fetching verses:', error);
    throw error;
  }
};


