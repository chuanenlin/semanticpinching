# Semantic Pinching

Transform a piece of text between different levels of abstractions using pinch gestures or arrow keys.

`emoji ↔ word ↔ sentence ↔ paragraph ↔ article`

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

3. Configure your [OpenAI API key](https://platform.openai.com/api-keys):
   - Create a `.env` file in the root directory

     ```bash
     touch .env
     ```

   - Add your OpenAI API key:

     ```
     VITE_OPENAI_API_KEY=your_api_key_here
     ```

4. Run the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

## License

[MIT License](https://opensource.org/license/mit) &copy; 2024 David Chuan-En Lin.
