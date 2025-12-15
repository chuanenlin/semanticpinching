import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fal } from "@fal-ai/client";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { action, prompt, imageUrl } = req.body;

  if (!action) {
    return res.status(400).json({ error: 'Missing action' });
  }

  if (!process.env.FAL_KEY) {
    return res.status(500).json({ error: 'FAL API key not configured' });
  }

  fal.config({
    credentials: process.env.FAL_KEY
  });

  try {
    if (action === 'generateImage') {
      if (!prompt) {
        return res.status(400).json({ error: 'Missing prompt' });
      }

      const result = await fal.subscribe("fal-ai/flux/schnell", {
        input: {
          prompt: `${prompt}, best quality, 4k`
        },
        logs: true,
      });

      if (!result.data) {
        return res.status(500).json({ error: 'No image data received' });
      }

      return res.status(200).json({ url: result.data.images[0].url });

    } else if (action === 'generateCaption') {
      if (!imageUrl) {
        return res.status(400).json({ error: 'Missing imageUrl' });
      }

      const result = await fal.subscribe("fal-ai/florence-2-large/detailed-caption", {
        input: {
          image_url: imageUrl
        },
        logs: true,
      });

      if (!result.data || !result.data.results) {
        return res.status(500).json({ error: 'No caption data received' });
      }

      return res.status(200).json({ caption: result.data.results.trim() });

    } else {
      return res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error) {
    console.error('FAL API Error:', error);
    return res.status(500).json({ error: 'FAL API request failed' });
  }
}
