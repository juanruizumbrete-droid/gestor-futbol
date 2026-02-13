import { GoogleGenerativeAI } from "@google/generative-ai";

// Inicializamos la conexión directamente desde la web (Frontend)
// Netlify usará la VITE_GEMINI_API_KEY que configuraste
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const generateTrainingSession = async (params: any) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  const prompt = `Como experto metodólogo UEFA C (RFAF/CEDIFA), genera una sesión de entrenamiento completa en formato JSON.
  Categoría: ${params.category}, Nivel: ${params.level}, Objetivo Principal: ${params.objective}.
  La sesión debe incluir campos: juego, circuitoTecnico, posesion, partidoCondicionado y oleada.`;

  const result = await model.generateContent(prompt);
  return JSON.parse(result.response.text());
};

export const chatWithAssistant = async (message: string) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  const result = await model.generateContent(message);
  return result.response.text();
};
