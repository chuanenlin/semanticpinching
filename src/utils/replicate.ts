interface ReplicateRequestBody {
  input: Record<string, unknown>;
  version?: string;
}

async function replicateRequest(endpoint: string, body: ReplicateRequestBody) {
  const response = await fetch(`/api/replicate${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Replicate API Response:', {
      status: response.status,
      statusText: response.statusText,
      body: errorText
    });
    throw new Error(`Replicate API error: ${response.statusText}\n${errorText}`);
  }

  return response.json();
}

export async function generateImage(text: string): Promise<string> {
  try {
    const prediction = await replicateRequest('/models/black-forest-labs/flux-schnell/predictions', {
      input: { prompt: `${text}, best quality 4k` }
    });

    const result = await pollPrediction(prediction.id);
    const imageUrl = Array.isArray(result.output) ? result.output[0] : result.output;
    return imageUrl;
  } catch (error) {
    console.error('Replicate Image Generation Error:', error);
    throw new Error('Failed to generate image');
  }
}

async function pollPrediction(id: string) {
  while (true) {
    const response = await fetch(`/api/replicate/predictions/${id}`);
    const prediction = await response.json();
    
    if (prediction.status === 'succeeded') {
      return prediction;
    } else if (prediction.status === 'failed') {
      throw new Error('Image generation failed');
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

export async function generateCaption(imageUrl: string): Promise<string> {
  try {
    const prediction = await replicateRequest('/predictions', {
      version: "f677695e5e89f8b236e52ecd1d3f01beb44c34606419bcc19345e046d8f786f9",
      input: {
        image: imageUrl,
        question: "Generate a caption for this image in one short sentence."
      }
    });

    const result = await pollPrediction(prediction.id);
    const output = result.output;
    return output.trim().replace(/\.$/, '');
  } catch (error) {
    console.error('Replicate Caption Generation Error:', error);
    throw new Error('Failed to generate caption');
  }
} 