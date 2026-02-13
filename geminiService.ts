import { GoogleGenerativeAI } from "@google/generative-ai";

// Conexión usando la nueva Key de Netlify
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// Definimos el modelo una sola vez
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const generateTrainingSession = async (params: any) => {
  const prompt = `Como experto metodólogo UEFA C (RFAF/CEDIFA), genera una sesión en formato JSON.
  Categoría: ${params.category}, Objetivo: ${params.objective}.
  Responde solo con el objeto JSON: juego, circuitoTecnico, posesion, partidoCondicionado y oleada.`;

  const result = await model.generateContent(prompt);
  return JSON.parse(result.response.text());
};

// ESTA ES LA FUNCIÓN QUE FALTABA Y CAUSABA EL ERROR
export const generateSeasonObjectives = async (params: any) => {
  const prompt = `Como experto RFAF, propón 3 objetivos clave para: Categoría ${params.category}, Nivel ${params.level}, Fase ${params.phase}, Tipo ${params.type}.`;

  const result = await model.generateContent(prompt);
  return result.response.text().trim();
};

export const chatWithAssistant = async (message: string) => {
  // Respuesta directa del asistente para el chat
  const result = await model.generateContent(message);
  return result.response.text();
};
