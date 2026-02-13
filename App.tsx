
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { getAppState } from './storage';
import { AppState, Team } from './types';

// Pages
import Dashboard from './pages/Dashboard';
import Teams from './pages/Teams';
import Season from './pages/Season';
import TrainingGenerator from './pages/TrainingGenerator';
import Matches from './pages/Matches';
import Players from './pages/Players';
import Progress from './pages/Progress';
import AIAssistant from './pages/AIAssistant';
import Trash from './pages/Trash';

const Sidebar = ({ activeTeam, isOpen, onClose }: { activeTeam: Team | null, isOpen: boolean, onClose: () => void }) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', label: 'Inicio', icon: 'fa-home' },
    { path: '/teams', label: 'Equipos', icon: 'fa-users-cog' },
    { path: '/season', label: 'Temporada', icon: 'fa-calendar-alt' },
    { path: '/training', label: 'Entrenamientos', icon: 'fa-clipboard-list' },
    { path: '/matches', label: 'Partidos', icon: 'fa-futbol' },
    { path: '/players', label: 'Jugadores', icon: 'fa-user-friends' },
    { path: '/progress', label: 'Progreso', icon: 'fa-chart-line' },
    { path: '/ai-assistant', label: 'Asistente IA', icon: 'fa-robot' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        ></div>
      )}
      
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-soccer-green text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:block ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <i className="fa-solid fa-shield-halved text-green-400"></i>
            UEFA C Pro
          </h1>
          <button onClick={onClose} className="lg:hidden text-white/60 hover:text-white">
            <i className="fa-solid fa-times text-xl"></i>
          </button>
        </div>
        
        {activeTeam && (
          <div className="p-4 mx-4 mt-4 bg-white/10 rounded-xl text-sm border border-white/5">
            <p className="text-green-300 font-black uppercase text-[10px] tracking-widest mb-1">Equipo Activo</p>
            <p className="font-bold truncate">{activeTeam.name}</p>
          </div>
        )}

        <nav className="flex-1 p-4 space-y-1 mt-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => { if(window.innerWidth < 1024) onClose(); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive(item.path) 
                  ? 'bg-soccer-accent text-white font-bold shadow-lg shadow-black/20' 
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <i className={`fa-solid ${item.icon} w-6 text-center`}></i>
              {item.label}
            </Link>
          ))}
        </nav>
        
        <div className="p-6 border-t border-white/10 text-[10px] text-center text-gray-400 uppercase tracking-widest font-bold">
          v1.0 &copy; Metodología RFAF/CEDIFA
        </div>
      </aside>
    </>
  );
};

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(getAppState());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleUpdate = () => setState(getAppState());
    window.addEventListener('storage-update', handleUpdate);
    return () => window.removeEventListener('storage-update', handleUpdate);
  }, []);

  const activeTeam = state.teams.find(t => t.id === state.activeTeamId) || null;

  return (
    <HashRouter>
      <div className="flex min-h-screen bg-gray-50 overflow-x-hidden">
        <Sidebar 
          activeTeam={activeTeam} 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />
        
        <div className="flex-1 flex flex-col min-w-0">
          {/* Mobile Top Header */}
          <header className="lg:hidden bg-white border-b px-4 py-3 flex justify-between items-center sticky top-0 z-30">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="w-10 h-10 flex items-center justify-center text-soccer-green bg-gray-100 rounded-xl"
            >
              <i className="fa-solid fa-bars-staggered"></i>
            </button>
            <div className="font-bold text-soccer-green flex items-center gap-2">
              <i className="fa-solid fa-shield-halved"></i>
              UEFA C Pro
            </div>
            <div className="w-10"></div> {/* Spacer */}
          </header>

          <main className="flex-1 p-4 md:p-8 overflow-y-auto">
            <div className="max-w-7xl mx-auto">
              <Routes>
                <Route path="/" element={<Dashboard activeTeam={activeTeam} />} />
                <Route path="/teams" element={<Teams state={state} />} />
                <Route path="/season" element={<Season activeTeam={activeTeam} />} />
                <Route path="/training" element={<TrainingGenerator activeTeam={activeTeam} />} />
                <Route path="/matches" element={<Matches activeTeam={activeTeam} />} />
                <Route path="/players" element={<Players activeTeam={activeTeam} />} />
                <Route path="/progress" element={<Progress activeTeam={activeTeam} />} />
                <Route path="/ai-assistant" element={<AIAssistant activeTeam={activeTeam} />} />
                <Route path="/trash" element={<Trash state={state} />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </HashRouter>
  );
};

export default App;
