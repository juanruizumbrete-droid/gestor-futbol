import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. Intentamos capturar la clave
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// 2. Verificación de seguridad en consola
if (!apiKey) {
  console.error("🚨 ERROR CRÍTICO: La API Key no está llegando a la aplicación. Revisa el nombre en Netlify.");
} else {
  console.log("✅ API Key detectada correctamente.");
}

const genAI = new GoogleGenerativeAI(apiKey || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const generateTrainingSession = async (params: any) => {
  const prompt = `Como experto UEFA C, genera sesión JSON: ${params.objective}`;
  const result = await model.generateContent(prompt);
  return JSON.parse(result.response.text());
};

export const generateSeasonObjectives = async (params: any) => {
  const prompt = `Objetivos RFAF para ${params.category}, nivel ${params.level}`;
  const result = await model.generateContent(prompt);
  return result.response.text().trim();
};

export const chatWithAssistant = async (message: string) => {
  const result = await model.generateContent(message);
  return result.response.text();
};
