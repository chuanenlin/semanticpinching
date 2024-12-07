import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const PROMPTS = {
  toEmoji: "Convert this text to a single emoji that best represents its meaning. Return ONLY the emoji, nothing else:",
  toWord: "Convert this text to a single word that best captures its essence. Return ONLY the word, nothing else:",
  toSentence: "Convert this text into a short sentence but longer than three words. Return ONLY the sentence, no markdown or special characters:",
  toParagraph: "Convert this text into a short paragraph with three sentences. Return ONLY the paragraph text, no markdown or special characters:",
  toArticle: "Convert this text into a succinct well-structured article with a short punchy title and two paragraphs. Use two newlines between paragraphs for spacing. Use plain text only, no markdown, no special characters. Format example:\nTitle\n\nFirst paragraph...\n\nSecond paragraph..."
};

export async function transformText(
  content: string,
  _fromLevel: string,
  toLevel: string,
  onStream: (chunk: string) => void
): Promise<string> {
  const prompt = PROMPTS[`to${toLevel.charAt(0).toUpperCase() + toLevel.slice(1)}` as keyof typeof PROMPTS];
  
  try {
    const stream = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a semantic transformation expert that converts text between different levels of detail. Return only plain text without any formatting, markdown, or special characters."
        },
        {
          role: "user",
          content: `${prompt}\n\nText: ${content}`
        }
      ],
      model: "gpt-4o",
      temperature: 0.7,
      max_tokens: toLevel === 'article' ? 1000 : 200,
      stream: true
    });

    let buffer = '';
    let fullResponse = '';
    const sentenceEndRegex = /[.!?]\s+/g;

    const isSimpleLevel = toLevel === 'emoji' || toLevel === 'word';

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        buffer += content;
        fullResponse += content;

        if (isSimpleLevel) {
          onStream(fullResponse);
        } else if (toLevel === 'article') {
          if (buffer.includes('\n\n')) {
            onStream(fullResponse);
            buffer = '';
          }
        } else {
          if (sentenceEndRegex.test(buffer)) {
            onStream(fullResponse);
            buffer = '';
          }
        }
      }
    }

    if (buffer) {
      onStream(fullResponse);
    }

    return fullResponse;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('Failed to transform content');
  }
} 