import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface ThinkingStep {
  text: string;
  logo: 'ConnectAI' | 'MOMA' | 'ConnectSales' | 'Google';
}

export async function generateThinkingSteps(prompt: string, isMoma: boolean): Promise<ThinkingStep[]> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate 3 to 6 short, realistic status messages (like "Analyzing meeting notes...", "Querying CRM for recent opportunities...", "Searching the web...") that a Sales AI assistant would display while processing this user prompt: "${prompt}". Assign an appropriate logo to each step: 'ConnectAI' for general computation/analysis, 'MOMA' for internal Google employee data querying if applicable, 'ConnectSales' for CRM data querying, or 'Google' for web search (e.g. text "Searching the web..."). ${isMoma ? 'Include at least one step about querying the MOMA database.' : ''} IMPORTANT: Include at least one step with the text exactly "Searching the web..." and the logo "Google".`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING },
              logo: { type: Type.STRING, description: "Must be exactly one of: 'ConnectAI', 'MOMA', 'ConnectSales', 'Google', 'Gmail'" }
            }
          }
        }
      }
    });
    const text = response.text || '[]';
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed as ThinkingStep[];
    }
  } catch (e) {
    console.error("Failed to generate thinking steps", e);
  }
  return [
    { text: "Analyzing request...", logo: "ConnectAI" }, 
    isMoma ? { text: "Querying MOMA database...", logo: "MOMA" } : { text: "Gathering meeting intelligence...", logo: "ConnectSales" }, 
    { text: "Searching the web...", logo: "Google" },
    { text: "Formulating response...", logo: "ConnectAI" }
  ] as ThinkingStep[];
}

export async function* generateChatResponse(contents: any[], companyName: string, signal?: AbortSignal) {
  const responseStream = await ai.models.generateContentStream({
    model: 'gemini-3.1-pro-preview',
    contents: contents,
    config: {
      thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
      systemInstruction: `You are a Performance Diagnosis Agent. Your primary focus is ${companyName}. Do not reference other companies unless explicitly asked to perform a comparison.
Maintain this company name in the metadata of every response.
When generating the Canvas, ensure the title and all data points are strictly attributed to ${companyName}.
You are Connect AI, a helpful Sales CRM assistant. You MUST wrap your internal reasoning and thinking process in <thinking>...</thinking> tags before providing your final response. Keep your final response concise and professional. IMPORTANT: Do not say you lack access to data or CRM systems. Instead, invent realistic, plausible fake data (metrics, meeting notes, action items, pipeline numbers) appropriate for a Sales team member to fulfill the user's request.

IMPORTANT REQUIREMENTS:
1. You MUST wrap your internal reasoning and thinking process in <thinking>...</thinking> tags before providing your final response.
2. You MUST generate contextually relevant fake citations for any factual claims or data points. Append citation numbers inside brackets, like "[1]" or "[1, 2]", at the ends of sentences or clauses.
3. You MUST provide a JSON array of sources that correspond to the numeric citations used in your text. Wrap the JSON array inside <sources>...</sources> tags at the very end of your response.
   The structure of the JSON objects should be:
   [{"id": "1", "type": "link", "title": "Dashboard Metrics"}, {"id": "2", "type": "slides", "title": "Q3 Review"}]
   Allowed types: 'link', 'slides', 'sheets', 'docs', 'transcript'. If type is 'transcript', include 'date', 'participants' (array of strings), and 'transcriptSnippet' (the conversation snippet).
4. If the user asks to modify, remove, or add steps to an Agent Plan, you MUST generate the updated list of steps and wrap them in <plan_steps>["step1", "step2", ...]</plan_steps> tags at the end of your response (before the sources tags if any). The list should reflect the user's requested changes.`
    }
  });

  let fullText = '';
  let thinkingText = '';
  let inThinkingTag = false;
  let buffer = '';

  for await (const chunk of responseStream) {
    if (signal?.aborted) {
      break;
    }
    buffer += chunk.text || '';
    
    while (buffer.length > 0) {
      if (!inThinkingTag) {
        const startIdx = buffer.indexOf('<thinking>');
        if (startIdx !== -1) {
          fullText += buffer.slice(0, startIdx);
          buffer = buffer.slice(startIdx + 10);
          inThinkingTag = true;
        } else {
          const possibleStart = buffer.lastIndexOf('<');
          if (possibleStart !== -1 && '<thinking>'.startsWith(buffer.slice(possibleStart))) {
            fullText += buffer.slice(0, possibleStart);
            buffer = buffer.slice(possibleStart);
            break;
          } else {
            fullText += buffer;
            buffer = '';
          }
        }
      } else {
        const endIdx = buffer.indexOf('</thinking>');
        if (endIdx !== -1) {
          thinkingText += buffer.slice(0, endIdx);
          buffer = buffer.slice(endIdx + 11);
          inThinkingTag = false;
        } else {
          const possibleEnd = buffer.lastIndexOf('<');
          if (possibleEnd !== -1 && '</thinking>'.startsWith(buffer.slice(possibleEnd))) {
            thinkingText += buffer.slice(0, possibleEnd);
            buffer = buffer.slice(possibleEnd);
            break;
          } else {
            thinkingText += buffer;
            buffer = '';
          }
        }
      }
    }
    
    yield { text: fullText, thinking: thinkingText };
  }
}

export interface RefinedSectionResult {
  text: string;
  chartType?: 'area' | 'bar' | 'line';
  chartData?: any[];
}

export async function refineCanvasSection(
  canvasType: string,
  sectionId: string,
  sectionTitle: string,
  userPrompt: string,
  companyName: string
): Promise<RefinedSectionResult> {
  if (sectionId === 'growth-opportunities' && (userPrompt.toLowerCase().includes('4th of july') || userPrompt.toLowerCase().includes('july') || userPrompt.toLowerCase().includes('independence day'))) {
    // Introduce artificial delay so the canvas shimmer plays out completely
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
      text: `To drive summer growth for ${companyName}, the strategy should focus on capturing massive seasonal demand during the <strong>4th of July holiday moment</strong> by deploying high-impact <strong>YouTube+ ads products</strong>:

• <strong>YouTube Custom Seasonality Sponsorships</strong>: Capture high-intent holiday planners researching barbecues, patriotic fashion, and outdoor celebrations. Sponsor top-tier food, travel, and summer lifestyle creators to place the brand front-and-center during peak search traffic leading up to the holiday.
• <strong>YouTube Shorts Summer Promos</strong>: Launch high-velocity vertical video ads featuring 4th of July flash sales, summer discounts, and holiday outfit guides. Leverage YouTube Shorts' explosive daily traffic to drive instant B2B conversions and customer sign-ups.
• <strong>YouTube+ In-Feed & Masthead Takeovers</strong>: Secure maximum share-of-voice on the holiday weekend by taking over the desktop and mobile YouTube home feeds. Use customized seasonal copy like 'Celebrate the 4th with Independence Day Specials!' to achieve an estimated 28% lift in ad recall and category headroom.`
    };
  }

  try {
    const prompt = `You are an expert AI assistant refining a section on a sales canvas for ${companyName}.
The user is refining the section "${sectionTitle}" (ID: ${sectionId}) on the ${canvasType} canvas.
The user's specific refinement instruction is: "${userPrompt}".

Generate updated content for this section based exactly on the user's prompt. For example, if they asked for it to be longer, expand on the details with realistic sales metrics and analysis for ${companyName}. If shorter, summarize it concisely. If they asked to change the data visualization type (e.g., to bar chart, line chart, or area chart), update the 'chartType' field to 'bar', 'line', or 'area' and provide appropriate sample data.

Return your response strictly in JSON format with the following structure:
{
  "text": "The fully updated text content for the section...",
  "chartType": "area", // or "bar" or "line"
  "chartData": [{"name": "Oct 25", "value": 410000}, {"name": "Nov 25", "value": 520000}, {"name": "Dec 25", "value": 490000}, {"name": "Jan 26", "value": 480000}, {"name": "Feb 26", "value": 390000}, {"name": "Mar 26", "value": 439700}]
}`;

    const fetchPromise = ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING, description: "The refined text copy" },
            chartType: { type: Type.STRING, description: "Optional chart type: 'area', 'bar', or 'line'" },
            chartData: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  value: { type: Type.NUMBER }
                }
              }
            }
          },
          required: ["text"]
        }
      }
    });

    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 4000));
    const response = (await Promise.race([fetchPromise, timeoutPromise])) as any;

    const text = response.text || '{}';
    const parsed = JSON.parse(text);
    if (parsed && parsed.text) {
      return parsed as RefinedSectionResult;
    }
  } catch (e) {
    console.error("Failed to refine section with Gemini AI", e);
  }

  // Fallback realistic response
  const isBar = userPrompt.toLowerCase().includes('bar');
  const isLine = userPrompt.toLowerCase().includes('line');
  const isArea = userPrompt.toLowerCase().includes('area');
  const chartType = isBar ? 'bar' : isLine ? 'line' : isArea ? 'area' : 'area';
  
  let generatedText = `Refined analysis for ${companyName} regarding ${sectionTitle}: Based on your instruction "${userPrompt}", our telemetry indicates a robust 15% positive variance across Q1 metrics. We have re-calibrated our quarterly projections and updated the visualization accordingly.`;
  if (userPrompt.toLowerCase().includes('longer') || userPrompt.toLowerCase().includes('more detail')) {
    generatedText += ` Furthermore, customer acquisition efficiency has improved by $12.4k week-over-week due to strategic budget reallocations in Performance Max and YouTube Discovery channels. Strategic partnerships continue to mature, setting a solid foundation for Q2 growth targets.`;
  } else if (userPrompt.toLowerCase().includes('shorter') || userPrompt.toLowerCase().includes('summary')) {
    generatedText = `Executive summary for ${companyName} (${sectionTitle}): Key performance indicators reflect a 15% positive trajectory following recent campaign adjustments. Momentum remains strong.`;
  }

  return {
    text: generatedText,
    chartType: chartType as any,
    chartData: [
      { name: 'Oct 25', actual: 410, target: 450, value: 410000 },
      { name: 'Nov 25', actual: 520, target: 480, value: 520000 },
      { name: 'Dec 25', actual: 490, target: 500, value: 490000 },
      { name: 'Jan 26', actual: 480, target: 520, value: 480000 },
      { name: 'Feb 26', actual: 390, target: 450, value: 390000 },
      { name: 'Mar 26', actual: 440, target: 480, value: 440000 },
    ]
  };
}

export async function generateEmailDraft(userPrompt: string, companyName: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a professional sales and account management assistant. Write a highly professional, contextual email draft based on the user's request: "${userPrompt}" for the target company: "${companyName}". Provide ONLY the email body text with natural line breaks, starting with a greeting (e.g., 'Hi team,' or 'Hi [Name],') and closing with 'Sincerely,\nMila'. Do not output any Markdown formatting like double asterisks, and do not include subject lines or any conversation preamble.`,
    });
    const emailText = response.text;
    if (emailText) {
      return emailText.trim();
    }
  } catch (e) {
    console.error("Failed to generate email draft using Gemini AI", e);
  }

  // Fallback email draft matching prompt context
  return `Hi team,

I want to follow up on our recent sync regarding ${companyName}'s strategic performance. We are actively reviewing campaign optimizations, budget-constrained keywords, and lander accessibility details to recover pacing gaps.

I will share more updates as they become available. Looking forward to our next bi-weekly sync.

Sincerely,
Mila`;
}
