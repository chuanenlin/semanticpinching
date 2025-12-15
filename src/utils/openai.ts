export async function transformText(
  content: string,
  _fromLevel: string,
  toLevel: string,
  onStream: (chunk: string) => void
): Promise<string> {
  try {
    const response = await fetch('/api/transform', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content, toLevel }),
    });

    if (!response.ok) {
      throw new Error('Failed to transform content');
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body');
    }

    const decoder = new TextDecoder();
    let fullResponse = '';
    let buffer = '';
    const sentenceEndRegex = /[.!?]\s+/g;
    const isSimpleLevel = toLevel === 'emoji' || toLevel === 'word';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const text = decoder.decode(value, { stream: true });
      const lines = text.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);
            if (parsed.content) {
              buffer += parsed.content;
              fullResponse += parsed.content;

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
          } catch {
            // Skip invalid JSON
          }
        }
      }
    }

    if (buffer) {
      onStream(fullResponse);
    }

    return fullResponse;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error('Failed to transform content');
  }
}
