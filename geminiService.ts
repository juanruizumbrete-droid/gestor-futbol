import { GoogleGenerativeAI } from "@google/generative-ai";
import { Team, TrainingSession, Category, Level } from "./types";

// Inicializamos la IA con la versión 1 estable para evitar el error 404
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const generateTrainingSession = async (params: {
  category: Category;
  age: string;
  level: Level;
  playerCount: number;
  objective: string;
  duration: string;
  material: string;
}): Promise<any> => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  const prompt = `Como experto metodólogo UEFA C (RFAF/CEDIFA), genera una sesión en formato JSON.
  Categoría: ${params.category}, Nivel: ${params.level}, Objetivo: ${params.objective}.
  Responde solo con JSON: juego, circuitoTecnico, posesion, partidoCondicionado, oleada.`;

  const result = await model.generateContent(prompt);
  return JSON.parse(result.response.text());
};

export const generateSeasonObjectives = async (params: {
  category: Category;
  level: Level;
  phase: string;
  type: 'técnicos' | 'tácticos' | 'formativos';
}): Promise<string> => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  const prompt = `Como experto RFAF, propón 3 objetivos clave para:
  Categoría: ${params.category}, Fase: ${params.phase}, Tipo: ${params.type}.`;

  const result = await model.generateContent(prompt);
  return result.response.text().trim();
};

export const chatWithAssistant = async (
  message: string,
  context: {
    activeTeam: Team | null;
    history: { role: 'user' | 'model'; text: string }[];
  }
) => {
  // Usamos el modelo flash 1.5 que es el más rápido y compatible
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const chat = model.startChat({
    history: context.history.map(h => ({
      role: h.role === 'user' ? 'user' : 'model',
      parts: [{ text: h.text }],
    })),
  });

  const result = await chat.sendMessage(message);
  return result.response.text();
};
