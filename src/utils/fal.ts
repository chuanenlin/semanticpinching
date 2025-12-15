export async function generateImage(text: string): Promise<string> {
  try {
    const response = await fetch('/api/fal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'generateImage', prompt: text }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate image');
    }

    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error('Image generation failed:', error);
    throw new Error('Failed to generate image');
  }
}

export async function generateCaption(imageUrl: string): Promise<string> {
  try {
    const response = await fetch('/api/fal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'generateCaption', imageUrl }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate caption');
    }

    const data = await response.json();
    return data.caption;
  } catch (error) {
    console.error('Caption generation failed:', error);
    throw new Error('Failed to generate caption');
  }
}
