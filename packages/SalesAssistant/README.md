# Sales Assistant Component Package

This package contains the Sales Assistant sidebar component and related files for use in React projects.

## How to Use

1.  Copy this `SalesAssistant` folder into your React project (e.g., into your `src/components/` directory).
2.  Ensure you have the necessary dependencies installed in your project:
    ```bash
    npm install @google/genai recharts
    ```
3.  Import and use the `RightPanel` component in your app.

## Configuration (API Key)

To use the AI features, you need to provide a Gemini API key. There are two ways to do this:

### Option 1: Using Environment Variables (Recommended)
Create a `.env` file at the root of your project and add your key:
```text
VITE_GEMINI_API_KEY=your_actual_api_key_here
```
This is the standard way for Vite-based projects.

### Option 2: Hardcoding in `gemini.ts` (Quick Test)
Open `gemini.ts` and replace line 3 with your key directly:
```typescript
const ai = new GoogleGenAI({ apiKey: 'your_actual_api_key_here' });
```
*⚠️ Warning: Do not commit your API key to public repositories like GitHub!*
