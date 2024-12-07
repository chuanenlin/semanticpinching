import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  try {
    // Get path from query parameters instead of URL
    const path = Array.isArray(request.query.path) 
      ? request.query.path.join('/')
      : request.query.path || '';

    const replicateUrl = `https://api.replicate.com/v1/${path}`;

    // Debug logging
    console.log('Request details:', {
      method: request.method,
      url: replicateUrl,
      path: path,
      hasToken: !!process.env.REPLICATE_API_TOKEN,
      tokenFirstChars: process.env.REPLICATE_API_TOKEN ? process.env.REPLICATE_API_TOKEN.substring(0, 4) + '...' : 'none',
      body: request.method !== 'GET' ? JSON.stringify(request.body) : 'no body'
    });

    const replicateResponse = await fetch(replicateUrl, {
      method: request.method,
      headers: {
        'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: request.method !== 'GET' ? JSON.stringify(request.body) : undefined,
    });

    const data = await replicateResponse.json();

    // Log response status and headers
    console.log('Replicate API response:', {
      status: replicateResponse.status,
      headers: Object.fromEntries(replicateResponse.headers.entries()),
      data: data
    });

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