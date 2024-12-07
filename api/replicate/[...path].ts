import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  const path = request.url?.replace('/api/replicate/', '') || '';
  const replicateUrl = `https://api.replicate.com/v1/${path}`;

  try {
    const replicateResponse = await fetch(replicateUrl, {
      method: request.method,
      headers: {
        'Authorization': `Token ${process.env.VITE_REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: request.method !== 'GET' ? JSON.stringify(request.body) : undefined,
    });

    const data = await replicateResponse.json();

    if (!replicateResponse.ok) {
      throw new Error(JSON.stringify(data));
    }

    response.status(replicateResponse.status).json(data);
  } catch (error) {
    console.error('Replicate API Error:', error);
    response.status(500).json({ error: 'Failed to proxy request to Replicate API' });
  }
} 