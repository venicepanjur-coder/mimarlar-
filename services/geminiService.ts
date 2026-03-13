import { GoogleGenAI, Type } from "@google/genai";
import { InputData, AnalysisResult } from '../types';

// NOTE: In a real production app, this would be a backend call to keep the key secure.
// For this demo, we assume the environment variable is available.
const apiKey = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey });

const SYSTEM_INSTRUCTION = `
You are a "Digital Business Intelligence Analyst" specialized in the Turkish architecture and construction market. Your task is to analyze a JSON list of architecture firms in Izmir provided by the user.

Analysis Criteria: For each firm in the JSON, perform a real-time web search (using Google Search & Maps) to evaluate:
1. Digital Activity: How frequently they update their website or blog.
2. Social Media Presence: Their activity levels on Instagram (followers, post frequency) and LinkedIn.
3. Google Visibility: Their Google Maps rating, number of reviews, and response rate to comments.
4. Website Quality: Mobile responsiveness and modern design (UI/UX).

Output Requirements:
- Refined List: Generate a new JSON structure including a "Digital Maturity Score" (1-10) for each firm.
- Identification: Highlight the "Top 10 Digital Leaders" who are most likely to collaborate on high-end projects like zip curtain installations.
- Marketing Strategy: Based on the results, create a B2B marketing strategy specifically for these high-visibility firms. Focus on how to present "Venice Panjur" products and the "Zip Curtain Cost Calculator" as a value-add to their workflow.
- Language: Provide the analysis and strategy in Turkish.
`;

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    analyzedFirms: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          name: { type: Type.STRING },
          location: { type: Type.STRING },
          digitalMaturityScore: { type: Type.NUMBER },
          websiteQuality: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
          socialMediaPresence: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
          googleVisibility: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
          lastDigitalActivity: { type: Type.STRING },
          keyProjects: { type: Type.ARRAY, items: { type: Type.STRING } },
          reasoning: { type: Type.STRING },
        },
        required: ['id', 'name', 'digitalMaturityScore', 'reasoning']
      }
    },
    top10: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          name: { type: Type.STRING },
          location: { type: Type.STRING },
          digitalMaturityScore: { type: Type.NUMBER },
          reasoning: { type: Type.STRING },
        },
      }
    },
    marketingStrategy: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        targetAudienceAnalysis: { type: Type.STRING },
        valueProposition: { type: Type.STRING },
        outreachPlan: { type: Type.ARRAY, items: { type: Type.STRING } },
        emailTemplateSubject: { type: Type.STRING },
        emailTemplateBody: { type: Type.STRING },
      },
      required: ['title', 'targetAudienceAnalysis', 'valueProposition', 'outreachPlan', 'emailTemplateSubject', 'emailTemplateBody']
    }
  },
  required: ['analyzedFirms', 'top10', 'marketingStrategy']
};

export const analyzeFirmsData = async (data: InputData): Promise<AnalysisResult> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please set REACT_APP_GEMINI_API_KEY or use the selection dialog.");
  }

  // We filter to the top list to ensure the model processes high-value targets effectively within token limits.
  const firmsToAnalyze = data.izmir_mimarlik_firmalari.one_cikan_ve_kurumsal_ofisler;

  const prompt = `
    Analyze the following list of architecture firms in Izmir, Turkey.
    Focus deeply on the 'one_cikan_ve_kurumsal_ofisler' list provided below.
    
    For each firm, search for their real-world digital presence (Website, Instagram, LinkedIn, Google Maps).
    
    Firm List Data:
    ${JSON.stringify(firmsToAnalyze)}
    
    Return the result strictly as JSON matching the schema provided.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("No response from Gemini.");
    }
    
    const parsed = JSON.parse(responseText);
    return parsed as AnalysisResult;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};
