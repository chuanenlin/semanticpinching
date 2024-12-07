import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  try {
    let replicateUrl: string;
    const pathSegments = request.url?.split('/api/replicate/')[1] || '';

    // Handle model-specific predictions
    if (pathSegments.startsWith('models/')) {
      replicateUrl = `https://api.replicate.com/v1/${pathSegments}`;
    } 
    // Handle polling and general predictions
    else {
      replicateUrl = `https://api.replicate.com/v1/${pathSegments}`;
    }

    console.log('Proxying request to:', replicateUrl);

    const replicateResponse = await fetch(replicateUrl, {
      method: request.method,
      headers: {
        'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: request.method !== 'GET' ? JSON.stringify(request.body) : undefined,
    });

    const data = await replicateResponse.json();

    if (!replicateResponse.ok) {
      console.error('Replicate API error:', {
        status: replicateResponse.status,
        data: data
      });
      throw new Error(JSON.stringify(data));
    }

    return response.status(replicateResponse.status).json(data);
  } catch (error) {
    console.error('Replicate API Error:', error);
    return response.status(500).json({ 
      error: 'Failed to proxy request to Replicate API',
      details: error instanceof Error ? error.message : String(error)
    });
  }
} 