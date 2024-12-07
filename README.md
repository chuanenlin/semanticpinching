# Semantic Pinching

Transform text between different levels of abstractions using pinch gestures (mobile) or arrow keys (desktop).

## Pinching Modes

### Text Mode

Transform text between different semantic levels with LLMs.

```text
emoji ↔ word ↔ sentence ↔ paragraph ↔ article
```

- Pinch out to expand (e.g., emoji → word)
- Pinch in to compress (e.g., word → emoji)

### Multimodal Mode

Transform between different modalities with LLMs, [image generation](https://github.com/black-forest-labs/flux), and [image captioning](https://github.com/salesforce/BLIP).

```text
emoji ↔ text ↔ image
```

- Pinch out to expand (e.g., text → image)
- Pinch in to compress (e.g., image → text)

## Try It Out

[semanticpinching.vercel.app](https://semanticpinching.vercel.app)

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/chuanenlin/semanticpinching.git
   cd semanticpinching
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure [OpenAI](https://platform.openai.com/api-keys) and [FAL](https://fal.ai/dashboard/keys) keys:
   - Create a `.env` file in the root directory
   - Add your API keys:

     ```env
     VITE_OPENAI_API_KEY=your_openai_api_key_here
     VITE_FAL_KEY=your_fal_key_here
     ```

4. Run the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

## License

[MIT License](https://opensource.org/license/mit) © 2024 David Chuan-En Lin.
