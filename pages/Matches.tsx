
import React, { useState } from 'react';
import { Team, Match } from '../types';
import { createMatch, updateMatch, deleteMatch } from '../storage';

const Matches: React.FC<{ activeTeam: Team | null }> = ({ activeTeam }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Match>>({
    opponent: '',
    objective: '',
    observations: '',
    successes: '',
    toCorrect: '',
    weeklyProposal: ''
  });

  if (!activeTeam) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
        <p className="text-gray-400 font-bold">Selecciona un equipo para analizar sus partidos.</p>
      </div>
    );
  }

  const openCreate = () => {
    setEditingId(null);
    setFormData({ opponent: '', objective: '', observations: '', successes: '', toCorrect: '', weeklyProposal: '' });
    setShowModal(true);
  };

  const openEdit = (match: Match) => {
    setEditingId(match.id);
    setFormData(match);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMatch(activeTeam.id, editingId, formData);
    } else {
      createMatch(activeTeam.id, {
        date: new Date().toLocaleDateString('es-ES'),
        opponent: formData.opponent || 'Rival Desconocido',
        objective: formData.objective || '',
        observations: formData.observations || '',
        successes: formData.successes || '',
        toCorrect: formData.toCorrect || '',
        weeklyProposal: formData.weeklyProposal || ''
      });
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Análisis Competitivo</h1>
          <p className="text-gray-500 font-medium">Histórico de partidos y evaluaciones de {activeTeam.name}</p>
        </div>
        <button 
          onClick={openCreate}
          className="bg-soccer-green text-white px-5 py-2.5 rounded-xl hover:bg-soccer-accent transition flex items-center gap-2 shadow-lg"
        >
          <i className="fa-solid fa-plus"></i> Registrar Partido
        </button>
      </header>

      <div className="space-y-6">
        {activeTeam.matches.slice().reverse().map(match => (
          <div 
            key={match.id}
            className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow"
          >
            <div className="bg-gray-50 p-6 border-b flex justify-between items-center">
              <div className="flex items-center gap-4">
                <span className="bg-soccer-green text-white px-4 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest">{match.date}</span>
                <h3 className="text-xl font-bold text-gray-800">vs {match.opponent}</h3>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                <button 
                  onClick={() => openEdit(match)}
                  className="p-2 text-soccer-accent hover:bg-green-100 rounded-xl transition"
                >
                  <i className="fa-solid fa-edit"></i>
                </button>
                <button 
                  onClick={() => confirm('¿Mover a papelera?') && deleteMatch(activeTeam.id, match.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition"
                >
                  <i className="fa-solid fa-trash-alt"></i>
                </button>
              </div>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <MatchMetric label="Objetivo del día" value={match.objective} icon="fa-bullseye" />
              <MatchMetric label="Lo que salió bien" value={match.successes} icon="fa-check-circle" color="text-green-600" />
              <MatchMetric label="Puntos a corregir" value={match.toCorrect} icon="fa-exclamation-triangle" color="text-red-600" />
              <MatchMetric label="Propuesta Semanal" value={match.weeklyProposal} icon="fa-calendar-day" color="text-blue-600" />
              
              {match.observations && (
                <div className="md:col-span-4 p-5 bg-gray-50 rounded-2xl border border-gray-100">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <i className="fa-solid fa-comments"></i> Observaciones Generales
                  </h4>
                  <p className="text-sm text-gray-600 font-medium italic">"{match.observations}"</p>
                </div>
              )}
            </div>
          </div>
        ))}
        {activeTeam.matches.length === 0 && (
          <div className="py-20 text-center text-gray-400 bg-white rounded-3xl border border-dashed border-gray-200 flex flex-col items-center">
            <i className="fa-solid fa-flag-checkered text-5xl mb-4 opacity-10"></i>
            <p className="font-bold">No se han registrado partidos todavía.</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 bg-soccer-green text-white flex justify-between items-center">
              <h2 className="text-xl font-bold">{editingId ? 'Editar Análisis' : 'Nuevo Análisis de Partido'}</h2>
              <button onClick={() => setShowModal(false)} className="text-white/60 hover:text-white transition">
                <i className="fa-solid fa-times text-xl"></i>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-5 overflow-y-auto">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Rival</label>
                  <input type="text" required value={formData.opponent} onChange={e => setFormData({...formData, opponent: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-soccer-accent font-medium" placeholder="Nombre del club rival" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Objetivo Metodológico</label>
                  <input type="text" value={formData.objective} onChange={e => setFormData({...formData, objective: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-soccer-accent font-medium" placeholder="Ej: Salida de balón" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-green-600 mb-1">Puntos Positivos</label>
                <textarea value={formData.successes} onChange={e => setFormData({...formData, successes: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none h-24 text-sm font-medium" placeholder="Aspectos tácticos o de actitud que funcionaron..."></textarea>
              </div>

              <div>
                <label className="block text-sm font-bold text-red-600 mb-1">Errores a Corregir</label>
                <textarea value={formData.toCorrect} onChange={e => setFormData({...formData, toCorrect: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none h-24 text-sm font-medium" placeholder="Déficits detectados durante el juego..."></textarea>
              </div>

              <div>
                <label className="block text-sm font-bold text-blue-600 mb-1">Propuesta para la semana (Tarea clave)</label>
                <input type="text" value={formData.weeklyProposal} onChange={e => setFormData({...formData, weeklyProposal: e.target.value})} className="w-full px-4 py-3 bg-blue-50 border border-blue-100 rounded-2xl outline-none text-sm font-bold" placeholder="Ej: Tarea de transiciones defensa-ataque" />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Notas Adicionales</label>
                <textarea value={formData.observations} onChange={e => setFormData({...formData, observations: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none h-20 text-sm font-medium"></textarea>
              </div>

              <div className="pt-6 border-t flex gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-2xl transition">Cerrar</button>
                <button type="submit" className="flex-1 py-3 bg-soccer-green text-white font-bold rounded-2xl hover:bg-soccer-accent transition shadow-md">
                  {editingId ? 'Actualizar Registro' : 'Guardar Análisis'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const MatchMetric = ({ label, value, icon, color = 'text-gray-700' }: { label: string, value?: string, icon: string, color?: string }) => (
  <div className="space-y-2">
    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
      <i className={`fa-solid ${icon}`}></i> {label}
    </h4>
    <p className={`text-sm font-bold leading-relaxed ${color}`}>
      {value || 'Pendiente de evaluación.'}
    </p>
  </div>
);

export default Matches;
