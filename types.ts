
export type Level = 'Bajo' | 'Medio' | 'Alto' | 'Élite';
export type Category = 'Prebenjamín' | 'Benjamín' | 'Alevín' | 'Infantil' | 'Cadete' | 'Juvenil';
export type Position = 'Portero' | 'Defensa Central' | 'Lateral' | 'Mediocentro' | 'Extremo' | 'Delantero';
export type PlayerRating = 'mejora' | 'igual' | 'reforzar';

export interface SeasonPhase {
  id: string;
  label: string;
  techObjectives: string;
  tactObjectives: string;
  formativeObjectives: string;
  observations: string;
}

export interface Player {
  id: string;
  name: string;
  position: Position;
  control: PlayerRating;
  passing: PlayerRating;
  participation: PlayerRating;
  attitude: PlayerRating;
  comments: string;
}

export interface TrainingSession {
  id: string;
  date: string;
  category: Category;
  age: string;
  level: Level;
  playerCount: number;
  objective: string;
  duration: string;
  material: string;
  content: {
    juego: string;
    circuitoTecnico: string;
    posesion: string;
    partidoCondicionado: string;
    oleada: string;
  };
}

export interface Match {
  id: string;
  date: string;
  opponent: string;
  objective: string;
  observations: string;
  successes: string;
  toCorrect: string;
  weeklyProposal: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface AIChat {
  id: string;
  title: string;
  messages: ChatMessage[];
  lastUpdate: number;
}

export interface Team {
  id: string;
  name: string;
  category: Category;
  age: string;
  level: Level;
  season: string;
  seasonPhases: SeasonPhase[];
  players: Player[];
  trainings: TrainingSession[];
  matches: Match[];
  chats: AIChat[];
}

export type TrashType = 'team' | 'player' | 'training' | 'match';

export interface TrashItem {
  id: string;
  type: TrashType;
  data: any;
  originTeamId?: string;
  deletedAt: number;
}

export interface AppState {
  teams: Team[];
  activeTeamId: string | null;
  trash: TrashItem[];
}
