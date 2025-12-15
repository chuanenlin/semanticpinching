import type { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';

const PROMPTS: Record<string, string> = {
  toEmoji: "Convert this text to a single emoji that best represents its meaning. Return ONLY the emoji, nothing else:",
  toWord: "Convert this text to a single word that best captures its essence. Return ONLY the word, nothing else:",
  toSentence: "Convert this text into a short sentence but longer than three words. Return ONLY the sentence, no markdown or special characters:",
  toParagraph: "Convert this text into a short paragraph with three sentences. Return ONLY the paragraph text, no markdown or special characters:",
  toArticle: "Convert this text into a succinct well-structured article with a short punchy title and two paragraphs. Use two newlines between paragraphs for spacing. Use plain text only, no markdown, no special characters. Format example:\nTitle\n\nFirst paragraph...\n\nSecond paragraph..."
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { content, toLevel } = req.body;

  if (!content || !toLevel) {
    return res.status(400).json({ error: 'Missing content or toLevel' });
  }

  const promptKey = `to${toLevel.charAt(0).toUpperCase() + toLevel.slice(1)}`;
  const prompt = PROMPTS[promptKey];

  if (!prompt) {
    return res.status(400).json({ error: 'Invalid toLevel' });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'OpenAI API key not configured' });
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

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

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    console.error('OpenAI API Error:', error);
    return res.status(500).json({ error: 'Failed to transform content' });
  }
}
