import { GoogleGenerativeAI } from "@google/generative-ai";

// Conexión usando la nueva Key que has creado sin advertencias
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const generateTrainingSession = async (params: any) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = `Como experto metodólogo UEFA C (RFAF/CEDIFA), genera una sesión de entrenamiento completa en formato JSON.
  Categoría: ${params.category}, Objetivo: ${params.objective}.
  Responde solo con el objeto JSON: juego, circuitoTecnico, posesion, partidoCondicionado y oleada.`;

  const result = await model.generateContent(prompt);
  return JSON.parse(result.response.text());
};

export const generateSeasonObjectives = async (params: any) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = `Como experto RFAF, propón 3 objetivos clave para: ${params.category}, nivel ${params.level}.`;

  const result = await model.generateContent(prompt);
  return result.response.text().trim();
};

export const chatWithAssistant = async (message: string) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  // Respuesta directa del asistente
  const result = await model.generateContent(message);
  return result.response.text();
};
