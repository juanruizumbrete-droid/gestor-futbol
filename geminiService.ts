import { GoogleGenerativeAI } from "@google/generative-ai"; // Asegúrate de que la importación sea así
import { Team, TrainingSession, Category, Level } from "./types";

// Usamos la variable que configuraste en Netlify
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
  
  const prompt = `Como experto metodólogo UEFA C (RFAF/CEDIFA), genera una sesión de entrenamiento completa en formato JSON.
  Categoría: ${params.category} (${params.age})
  Nivel: ${params.level}
  Nº Jugadores: ${params.playerCount}
  Objetivo Principal: ${params.objective}
  Duración: ${params.duration}
  Material: ${params.material}

  La sesión debe incluir: juego, circuitoTecnico, posesion, partidoCondicionado y oleada.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return JSON.parse(response.text());
};

// ... Repite el cambio de modelo "gemini-1.5-flash" en las otras funciones
