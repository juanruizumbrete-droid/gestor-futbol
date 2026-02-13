
import React, { useState } from 'react';
import { AppState, Team, Category, Level } from '../types';
import { createTeam, updateTeam, deleteTeam, setActiveTeamId } from '../storage';

const Teams: React.FC<{ state: AppState }> = ({ state }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Team>>({
    name: '',
    category: 'Alevín',
    level: 'Medio',
    age: '',
    season: '2024-2025'
  });

  const openCreate = () => {
    setEditingId(null);
    setFormData({ name: '', category: 'Alevín', level: 'Medio', age: '', season: '2024-2025' });
    setShowModal(true);
  };

  const openEdit = (team: Team) => {
    setEditingId(team.id);
    setFormData(team);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateTeam(editingId, formData);
    } else {
      createTeam({
        name: formData.name || 'Nuevo Equipo',
        category: formData.category as Category,
        level: formData.level as Level,
        age: formData.age || '',
        season: formData.season || '2024-2025',
      });
    }
    setShowModal(false);
  };

  const confirmDeleteTeam = (e: React.MouseEvent, id: string, name: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm(`¿Mover el equipo "${name}" a la papelera?\nSe conservarán sus jugadores, entrenamientos y partidos.`)) {
      deleteTeam(id);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Panel de Control</h1>
          <p className="text-gray-500 text-sm">Gestiona tus plantillas y activa el equipo de trabajo</p>
        </div>
        <button 
          onClick={openCreate}
          className="w-full sm:w-auto bg-soccer-green text-white px-6 py-3 rounded-2xl hover:bg-soccer-accent transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95"
        >
          <i className="fa-solid fa-plus"></i> Nuevo Equipo
        </button>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {state.teams.map(team => {
          const isActive = state.activeTeamId === team.id;
          return (
            <div 
              key={team.id}
              className={`bg-white p-6 rounded-3xl border-2 transition-all flex flex-col ${
                isActive 
                  ? 'border-soccer-accent shadow-xl bg-green-50/30' 
                  : 'border-gray-100 hover:border-gray-200 shadow-sm'
              }`}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 leading-tight">{team.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-black uppercase tracking-widest bg-gray-100 px-2 py-0.5 rounded text-gray-500">{team.category}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest bg-green-100 px-2 py-0.5 rounded text-green-700">{team.season}</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button 
                    type="button"
                    onClick={() => openEdit(team)}
                    className="p-2.5 text-soccer-accent hover:bg-green-50 rounded-xl transition"
                    title="Editar"
                  >
                    <i className="fa-solid fa-pen-to-square"></i>
                  </button>
                  <button 
                    type="button"
                    onClick={(e) => confirmDeleteTeam(e, team.id, team.name)}
                    className="p-2.5 text-red-400 hover:bg-red-50 rounded-xl transition"
                    title="Borrar"
                  >
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              </div>
              
              <div className="flex-1 space-y-3 mb-8">
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Competitividad</span>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    team.level === 'Élite' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {team.level}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Efectivos</span>
                  <span className="text-sm font-bold text-gray-700">{team.players.length} Jugadores</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveTeamId(team.id)}
                disabled={isActive}
                className={`w-full py-3.5 rounded-2xl transition-all font-black uppercase tracking-[0.15em] text-xs flex items-center justify-center gap-2 ${
                  isActive 
                    ? 'bg-soccer-accent/10 text-soccer-accent cursor-default border-2 border-transparent'
                    : 'bg-white text-soccer-green border-2 border-soccer-green hover:bg-soccer-green hover:text-white shadow-md active:scale-[0.98]'
                }`}
              >
                {isActive ? (
                  <><i className="fa-solid fa-circle-check text-lg"></i> Equipo Activo</>
                ) : (
                  'Activar Equipo'
                )}
              </button>
            </div>
          );
        })}
        
        {state.teams.length === 0 && (
          <div className="col-span-full py-24 bg-white rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 px-6 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <i className="fa-solid fa-users text-4xl opacity-20"></i>
            </div>
            <p className="font-bold text-xl text-gray-600">Comienza tu andadura</p>
            <p className="text-sm max-w-xs mt-2">Crea tu primer equipo para desbloquear todas las herramientas metodológicas.</p>
            <button onClick={openCreate} className="mt-8 bg-soccer-green text-white px-8 py-3 rounded-2xl font-bold shadow-lg hover:bg-soccer-accent transition-all">Crear ahora</button>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center p-4 z-[100]">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8 bg-soccer-green text-white flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">{editingId ? 'Editar Perfil' : 'Alta de Equipo'}</h2>
                <p className="text-white/60 text-xs font-bold uppercase tracking-widest mt-1">Configuración Metodológica</p>
              </div>
              <button onClick={() => setShowModal(false)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition">
                <i className="fa-solid fa-times text-xl"></i>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Denominación del Equipo</label>
                <input 
                  type="text" required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-soccer-accent outline-none font-bold text-gray-700 shadow-inner"
                  placeholder="Ej: Umbrete Alevín A"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Temporada (Año)</label>
                <input 
                  type="text" required
                  value={formData.season}
                  onChange={e => setFormData({...formData, season: e.target.value})}
                  className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-soccer-accent outline-none font-bold text-gray-700 shadow-inner"
                  placeholder="Ej: 2024-2025"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Categoría</label>
                  <select 
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value as Category})}
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold text-gray-700"
                  >
                    <option>Prebenjamín</option>
                    <option>Benjamín</option>
                    <option>Alevín</option>
                    <option>Infantil</option>
                    <option>Cadete</option>
                    <option>Juvenil</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nivel CEDIFA</label>
                  <select 
                    value={formData.level}
                    onChange={e => setFormData({...formData, level: e.target.value as Level})}
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold text-gray-700"
                  >
                    <option>Bajo</option>
                    <option>Medio</option>
                    <option>Alto</option>
                    <option>Élite</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Franja de Edad</label>
                <input 
                  type="text" required
                  value={formData.age}
                  onChange={e => setFormData({...formData, age: e.target.value})}
                  className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold text-gray-700 shadow-inner"
                  placeholder="Ej: 10-12 años"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="submit"
                  className="flex-1 py-4 bg-soccer-green text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-soccer-accent transition-all shadow-xl shadow-soccer-green/20"
                >
                  {editingId ? 'Actualizar' : 'Finalizar Alta'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Teams;
