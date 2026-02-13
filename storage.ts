
import { AppState, Team, TrashItem, Player, TrainingSession, Match, AIChat, SeasonPhase } from './types';

const STORAGE_KEY = 'uefa_c_pro_state_v2';

// Generador de IDs robusto con fallback para contextos no seguros
const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

const createDefaultPhases = (): SeasonPhase[] => [
  { id: 'p1', label: 'Inicio / Pretemporada', techObjectives: '', tactObjectives: '', formativeObjectives: '', observations: '' },
  { id: 'p2', label: 'Desarrollo / Formación', techObjectives: '', tactObjectives: '', formativeObjectives: '', observations: '' },
  { id: 'p3', label: 'Competencia / Consolidación', techObjectives: '', tactObjectives: '', formativeObjectives: '', observations: '' },
  { id: 'p4', label: 'Final / Evaluación', techObjectives: '', tactObjectives: '', formativeObjectives: '', observations: '' },
];

const initialState: AppState = {
  teams: [],
  activeTeamId: null,
  trash: [],
};

export const getAppState = (): AppState => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return initialState;
  try {
    const parsed = JSON.parse(saved);
    return {
      ...initialState,
      ...parsed,
      teams: parsed.teams || [],
      trash: parsed.trash || []
    };
  } catch {
    return initialState;
  }
};

const saveAppState = (state: AppState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  window.dispatchEvent(new Event('storage-update'));
};

// --- TEAM CRUD ---
export const createTeam = (teamData: Omit<Team, 'id' | 'players' | 'trainings' | 'matches' | 'chats' | 'seasonPhases'>) => {
  const state = getAppState();
  const newTeam: Team = {
    ...teamData,
    id: generateId(),
    players: [],
    trainings: [],
    matches: [],
    chats: [],
    seasonPhases: createDefaultPhases(),
  };
  state.teams.push(newTeam);
  if (!state.activeTeamId) state.activeTeamId = newTeam.id;
  saveAppState(state);
};

export const updateTeam = (id: string, updates: Partial<Team>) => {
  const state = getAppState();
  state.teams = state.teams.map(t => t.id === id ? { ...t, ...updates } : t);
  saveAppState(state);
};

export const deleteTeam = (id: string) => {
  const state = getAppState();
  const teamToDelete = state.teams.find(t => t.id === id);
  
  if (teamToDelete) {
    // 1. Crear el item de la papelera
    const trashItem: TrashItem = {
      id: generateId(),
      type: 'team',
      data: { ...teamToDelete },
      deletedAt: Date.now()
    };

    // 2. Filtrar los equipos
    const updatedTeams = state.teams.filter(t => t.id !== id);
    
    // 3. Actualizar el estado
    state.teams = updatedTeams;
    state.trash.push(trashItem);

    // 4. Si el equipo borrado era el activo, asignar uno nuevo o null
    if (state.activeTeamId === id) {
      state.activeTeamId = updatedTeams.length > 0 ? updatedTeams[0].id : null;
    }

    saveAppState(state);
  }
};

export const setActiveTeamId = (id: string) => {
  const state = getAppState();
  state.activeTeamId = id;
  saveAppState(state);
};

// --- SEASON CRUD ---
export const updateSeasonPhase = (teamId: string, phaseId: string, updates: Partial<SeasonPhase>) => {
  const state = getAppState();
  const team = state.teams.find(t => t.id === teamId);
  if (team) {
    team.seasonPhases = team.seasonPhases.map(p => p.id === phaseId ? { ...p, ...updates } : p);
    saveAppState(state);
  }
};

// --- PLAYER CRUD ---
export const createPlayer = (teamId: string, playerData: Omit<Player, 'id'>) => {
  const state = getAppState();
  const team = state.teams.find(t => t.id === teamId);
  if (team) {
    team.players.push({ ...playerData, id: generateId() });
    saveAppState(state);
  }
};

export const updatePlayer = (teamId: string, playerId: string, updates: Partial<Player>) => {
  const state = getAppState();
  const team = state.teams.find(t => t.id === teamId);
  if (team) {
    team.players = team.players.map(p => p.id === playerId ? { ...p, ...updates } : p);
    saveAppState(state);
  }
};

export const deletePlayer = (teamId: string, playerId: string) => {
  const state = getAppState();
  const team = state.teams.find(t => t.id === teamId);
  if (team) {
    const player = team.players.find(p => p.id === playerId);
    if (player) {
      team.players = team.players.filter(p => p.id !== playerId);
      state.trash.push({ id: generateId(), type: 'player', data: player, originTeamId: teamId, deletedAt: Date.now() });
      saveAppState(state);
    }
  }
};

// --- TRAINING CRUD ---
export const createTraining = (teamId: string, trainingData: TrainingSession) => {
  const state = getAppState();
  const team = state.teams.find(t => t.id === teamId);
  if (team) {
    team.trainings.push(trainingData);
    saveAppState(state);
  }
};

export const updateTraining = (teamId: string, trainingId: string, updates: Partial<TrainingSession>) => {
  const state = getAppState();
  const team = state.teams.find(t => t.id === teamId);
  if (team) {
    team.trainings = team.trainings.map(tr => tr.id === trainingId ? { ...tr, ...updates } : tr);
    saveAppState(state);
  }
};

export const deleteTraining = (teamId: string, trainingId: string) => {
  const state = getAppState();
  const team = state.teams.find(t => t.id === teamId);
  if (team) {
    const training = team.trainings.find(tr => tr.id === trainingId);
    if (training) {
      team.trainings = team.trainings.filter(tr => tr.id !== trainingId);
      state.trash.push({ id: generateId(), type: 'training', data: training, originTeamId: teamId, deletedAt: Date.now() });
      saveAppState(state);
    }
  }
};

// --- MATCH CRUD ---
export const createMatch = (teamId: string, matchData: Omit<Match, 'id'>) => {
  const state = getAppState();
  const team = state.teams.find(t => t.id === teamId);
  if (team) {
    team.matches.push({ ...matchData, id: generateId() });
    saveAppState(state);
  }
};

export const updateMatch = (teamId: string, matchId: string, updates: Partial<Match>) => {
  const state = getAppState();
  const team = state.teams.find(t => t.id === teamId);
  if (team) {
    team.matches = team.matches.map(m => m.id === matchId ? { ...m, ...updates } : m);
    saveAppState(state);
  }
};

export const deleteMatch = (teamId: string, matchId: string) => {
  const state = getAppState();
  const team = state.teams.find(t => t.id === teamId);
  if (team) {
    const match = team.matches.find(m => m.id === matchId);
    if (match) {
      team.matches = team.matches.filter(m => m.id !== matchId);
      state.trash.push({ id: generateId(), type: 'match', data: match, originTeamId: teamId, deletedAt: Date.now() });
      saveAppState(state);
    }
  }
};

// --- CHAT CRUD ---
export const saveChat = (teamId: string, chat: AIChat) => {
  const state = getAppState();
  const team = state.teams.find(t => t.id === teamId);
  if (team) {
    const existingIndex = team.chats.findIndex(c => c.id === chat.id);
    if (existingIndex > -1) {
      team.chats[existingIndex] = chat;
    } else {
      team.chats.push(chat);
    }
    saveAppState(state);
  }
};

export const deleteChat = (teamId: string, chatId: string) => {
  const state = getAppState();
  const team = state.teams.find(t => t.id === teamId);
  if (team) {
    team.chats = team.chats.filter(c => c.id !== chatId);
    saveAppState(state);
  }
};

// --- TRASH CRUD ---
export const restoreTrashItem = (trashId: string) => {
  const state = getAppState();
  const index = state.trash.findIndex(i => i.id === trashId);
  if (index > -1) {
    const item = state.trash[index];
    state.trash.splice(index, 1);
    
    if (item.type === 'team') {
      state.teams.push(item.data);
    } else if (item.originTeamId) {
      const team = state.teams.find(t => t.id === item.originTeamId);
      if (team) {
        if (item.type === 'player') team.players.push(item.data);
        if (item.type === 'training') team.trainings.push(item.data);
        if (item.type === 'match') team.matches.push(item.data);
      }
    }
    saveAppState(state);
  }
};

export const permanentDelete = (trashId: string) => {
  const state = getAppState();
  state.trash = state.trash.filter(i => i.id !== trashId);
  saveAppState(state);
};

export const clearTrash = () => {
  const state = getAppState();
  state.trash = [];
  saveAppState(state);
};
