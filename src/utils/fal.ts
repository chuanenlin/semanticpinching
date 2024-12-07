import { fal } from "@fal-ai/client";

// Configure FAL client
fal.config({
  credentials: import.meta.env.VITE_FAL_KEY
});

export async function generateImage(text: string): Promise<string> {
  try {
    const result = await fal.subscribe("fal-ai/flux/schnell", {
      input: {
        prompt: `${text}, best quality, 4k`
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          update.logs.map((log) => log.message).forEach(console.log);
        }
      },
    });

    if (!result.data) {
      throw new Error('No image data received');
    }

    // FAL returns the image URL in the data object
    return result.data.images[0].url;
  } catch (error) {
    console.error('Image generation failed:', error);
    throw new Error('Failed to generate image');
  }
}

export async function generateCaption(imageUrl: string): Promise<string> {
  try {
    const result = await fal.subscribe("fal-ai/florence-2-large/detailed-caption", {
      input: {
        image_url: imageUrl
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          update.logs.map((log) => log.message).forEach(console.log);
        }
      },
    });

    if (!result.data || !result.data.results) {
      throw new Error('No caption data received');
    }

    console.log('Caption result:', result.data);
    return result.data.results.trim();
  } catch (error) {
    console.error('Caption generation failed:', error);
    throw new Error('Failed to generate caption');
  }
} 