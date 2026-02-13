import { GoogleGenerativeAI } from "@google/generative-ai";
import { Team, TrainingSession, Category, Level } from "./types";

// Usamos la variable configurada en Netlify
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

  La sesión debe incluir campos: juego, circuitoTecnico, posesion, partidoCondicionado y oleada.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return JSON.parse(response.text());
};

export const generateSeasonObjectives = async (params: {
  category: Category;
  level: Level;
  phase: string;
  type: 'técnicos' | 'tácticos' | 'formativos';
}): Promise<string> => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  const prompt = `Como experto coordinador RFAF/CEDIFA, propón objetivos para:
  Categoría: ${params.category}, Nivel: ${params.level}, Fase: ${params.phase}, Tipo: ${params.type}.
  Devuelve solo 3-5 puntos clave.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text().trim();
};

export const chatWithAssistant = async (
  message: string,
  context: {
    activeTeam: Team | null;
    history: { role: 'user' | 'model'; text: string }[];
  }
) => {
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: "Eres un Asistente para entrenadores UEFA C experto en RFAF y CEDIFA. Tu tono es profesional. Al final añade: 'Esta IA es una herramienta de apoyo. La decisión final es del entrenador.'"
  });

  const chat = model.startChat({
    history: context.history.map(h => ({
      role: h.role === 'user' ? 'user' : 'model',
      parts: [{ text: h.text }]
    }))
  });

  const result = await chat.sendMessage(message);
  const response = await result.response;
  return response.text();
};
