
import { GoogleGenAI, Type } from "@google/genai";
import { Team, TrainingSession, Category, Level } from "./types";

// Always use process.env.API_KEY directly as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateTrainingSession = async (params: {
  category: Category;
  age: string;
  level: Level;
  playerCount: number;
  objective: string;
  duration: string;
  material: string;
}): Promise<Partial<TrainingSession['content']>> => {
  const prompt = `Como experto metodólogo UEFA C (RFAF/CEDIFA), genera una sesión de entrenamiento completa.
  Categoría: ${params.category} (${params.age})
  Nivel: ${params.level}
  Nº Jugadores: ${params.playerCount}
  Objetivo Principal: ${params.objective}
  Duración: ${params.duration}
  Material: ${params.material}

  La sesión debe incluir:
  1. Juego de activación/lúdico.
  2. Circuito técnico (analítico o global).
  3. Posesión con objetivo táctico.
  4. Partido condicionado para el objetivo.
  5. Oleada (finalización).

  Usa terminología técnica profesional de CEDIFA.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          juego: { type: Type.STRING },
          circuitoTecnico: { type: Type.STRING },
          posesion: { type: Type.STRING },
          partidoCondicionado: { type: Type.STRING },
          oleada: { type: Type.STRING },
        },
        required: ["juego", "circuitoTecnico", "posesion", "partidoCondicionado", "oleada"],
      },
    },
  });

  return JSON.parse(response.text);
};

export const generateSeasonObjectives = async (params: {
  category: Category;
  level: Level;
  phase: string;
  type: 'técnicos' | 'tácticos' | 'formativos';
}): Promise<string> => {
  const prompt = `Como experto coordinador metodológico RFAF/CEDIFA, propón objetivos específicos para la planificación de temporada.
  
  CONTEXTO:
  Categoría: ${params.category}
  Nivel del equipo: ${params.level}
  Fase de Temporada: ${params.phase}
  Tipo de Objetivos: ${params.type}

  REQUISITOS:
  - Redacta de 3 a 5 puntos clave.
  - Usa terminología académica de fútbol base.
  - Ajusta la complejidad al nivel ${params.level}.
  - Sé conciso y directo.
  
  Devuelve solo los puntos clave, sin introducciones ni despedidas.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
  });

  return response.text.trim();
};

export const chatWithAssistant = async (
  message: string,
  context: {
    activeTeam: Team | null;
    history: { role: 'user' | 'model'; text: string }[];
  }
) => {
  const { activeTeam } = context;
  
  const systemInstruction = `Eres un "Asistente formativo para entrenadores UEFA C", experto en metodología RFAF y CEDIFA. 
  Tu tono es profesional, alentador y técnico. 
  
  CONTEXTO DEL EQUIPO ACTUAL:
  ${activeTeam ? `
  Nombre: ${activeTeam.name}
  Categoría: ${activeTeam.category}
  Jugadores: ${activeTeam.players.length}
  Últimos Partidos: ${activeTeam.matches.slice(-3).map(m => m.opponent).join(', ')}
  Objetivos de temporada: ${activeTeam.season}
  ` : 'No hay equipo activo seleccionado.'}

  REGLA CRÍTICA: Al final de cada respuesta importante, incluye SIEMPRE el mensaje: "Esta IA es una herramienta de apoyo. La decisión final es del entrenador."
  `;

  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: { systemInstruction },
  });

  const response = await chat.sendMessage({ message });
  return response.text;
};
