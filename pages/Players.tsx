
import React, { useState } from 'react';
import { Team, Player, Position, PlayerRating } from '../types';
import { createPlayer, updatePlayer, deletePlayer } from '../storage';

const Players: React.FC<{ activeTeam: Team | null }> = ({ activeTeam }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Player>>({
    name: '',
    position: 'Mediocentro',
    control: 'igual',
    passing: 'igual',
    participation: 'igual',
    attitude: 'igual',
    comments: ''
  });

  if (!activeTeam) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
        <p className="text-gray-400 font-bold">Selecciona un equipo para ver su plantilla.</p>
      </div>
    );
  }

  const openCreate = () => {
    setEditingId(null);
    setFormData({ name: '', position: 'Mediocentro', control: 'igual', passing: 'igual', participation: 'igual', attitude: 'igual', comments: '' });
    setShowModal(true);
  };

  const openEdit = (player: Player) => {
    setEditingId(player.id);
    setFormData(player);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updatePlayer(activeTeam.id, editingId, formData);
    } else {
      createPlayer(activeTeam.id, {
        name: formData.name || 'Nuevo Jugador',
        position: formData.position as Position,
        control: formData.control as PlayerRating,
        passing: formData.passing as PlayerRating,
        participation: formData.participation as PlayerRating,
        attitude: formData.attitude as PlayerRating,
        comments: formData.comments || ''
      });
    }
    setShowModal(false);
  };

  const onDragStart = (e: React.DragEvent, playerId: string) => {
    e.dataTransfer.setData('text/plain', playerId);
    e.dataTransfer.setData('type', 'player');
  };

  const getRatingColor = (rating: PlayerRating) => {
    if (rating === 'mejora') return 'text-green-600 bg-green-50';
    if (rating === 'reforzar') return 'text-red-600 bg-red-50';
    return 'text-blue-600 bg-blue-50';
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Plantilla</h1>
          <p className="text-gray-500 font-medium">Gestión de jugadores de {activeTeam.name}</p>
        </div>
        <button 
          onClick={openCreate}
          className="bg-soccer-green text-white px-5 py-2.5 rounded-xl hover:bg-soccer-accent transition flex items-center gap-2 shadow-lg"
        >
          <i className="fa-solid fa-user-plus"></i> Añadir Jugador
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {activeTeam.players.map(player => (
          <div 
            key={player.id}
            draggable
            onDragStart={(e) => onDragStart(e, player.id)}
            className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all cursor-grab active:cursor-grabbing group relative"
          >
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition">
              <button 
                onClick={() => openEdit(player)}
                className="text-soccer-accent hover:bg-green-50 p-2 rounded-lg"
              >
                <i className="fa-solid fa-edit text-xs"></i>
              </button>
              <button 
                onClick={() => confirm('¿Mover a papelera?') && deletePlayer(activeTeam.id, player.id)}
                className="text-red-300 hover:text-red-500 p-2 rounded-lg"
              >
                <i className="fa-solid fa-trash-alt text-xs"></i>
              </button>
            </div>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-soccer-green text-white rounded-2xl flex items-center justify-center font-bold text-xl shadow-inner">
                {player.name.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-gray-800 truncate max-w-[150px]">{player.name}</h4>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{player.position}</p>
              </div>
            </div>

            <div className="space-y-2 grid grid-cols-2 gap-2 mb-4">
              <RatingBadge label="Control" value={player.control} color={getRatingColor(player.control)} />
              <RatingBadge label="Pase" value={player.passing} color={getRatingColor(player.passing)} />
              <RatingBadge label="Part." value={player.participation} color={getRatingColor(player.participation)} />
              <RatingBadge label="Actitud" value={player.attitude} color={getRatingColor(player.attitude)} />
            </div>

            {player.comments && (
              <div className="mt-3 text-[11px] text-gray-500 bg-gray-50 p-3 rounded-2xl italic border border-gray-100 line-clamp-2">
                "{player.comments}"
              </div>
            )}
          </div>
        ))}
        {activeTeam.players.length === 0 && (
          <div className="col-span-full py-20 text-center text-gray-400 border-2 border-dashed rounded-3xl flex flex-col items-center">
            <i className="fa-solid fa-person-walking-luggage text-5xl mb-4 opacity-10"></i>
            <p className="font-bold">Aún no hay jugadores registrados</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 bg-soccer-green text-white flex justify-between items-center">
              <h2 className="text-xl font-bold">{editingId ? 'Editar Jugador' : 'Ficha del Jugador'}</h2>
              <button onClick={() => setShowModal(false)} className="text-white/60 hover:text-white transition">
                <i className="fa-solid fa-times text-xl"></i>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
              <div className="grid grid-cols-2 gap-5">
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Nombre Completo</label>
                  <input 
                    type="text" required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-soccer-accent font-medium"
                    placeholder="Ej: Pablo Pérez"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Posición</label>
                  <select 
                    value={formData.position}
                    onChange={e => setFormData({...formData, position: e.target.value as Position})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl outline-none font-medium"
                  >
                    <option>Portero</option>
                    <option>Lateral</option>
                    <option>Defensa Central</option>
                    <option>Mediocentro</option>
                    <option>Extremo</option>
                    <option>Delantero</option>
                  </select>
                </div>
                <div>
                   <label className="block text-sm font-bold text-gray-700 mb-1">Actitud</label>
                   <select 
                    value={formData.attitude}
                    onChange={e => setFormData({...formData, attitude: e.target.value as PlayerRating})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl outline-none font-medium"
                  >
                    <option value="mejora">Buena (Mejora)</option>
                    <option value="igual">Normal</option>
                    <option value="reforzar">Reforzar</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <RatingSelect label="Control" value={formData.control as PlayerRating} onChange={v => setFormData({...formData, control: v})} />
                <RatingSelect label="Pase" value={formData.passing as PlayerRating} onChange={v => setFormData({...formData, passing: v})} />
                <RatingSelect label="Part." value={formData.participation as PlayerRating} onChange={v => setFormData({...formData, participation: v})} />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Observaciones Metodológicas</label>
                <textarea 
                  value={formData.comments}
                  onChange={e => setFormData({...formData, comments: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-soccer-accent min-h-[100px] font-medium text-sm"
                  placeholder="Aspectos a reforzar en la sesión..."
                ></textarea>
              </div>

              <div className="pt-4 border-t flex gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-2xl transition">Cerrar</button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-soccer-green text-white font-bold rounded-2xl hover:bg-soccer-accent transition shadow-md"
                >
                  {editingId ? 'Guardar Cambios' : 'Guardar Jugador'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const RatingBadge = ({ label, value, color }: { label: string, value: string, color: string }) => (
  <div className={`p-2 rounded-xl text-center border border-white shadow-sm ${color}`}>
    <p className="text-[9px] uppercase font-black opacity-60 leading-none mb-1 tracking-tighter">{label}</p>
    <p className="text-[10px] font-bold capitalize">{value}</p>
  </div>
);

const RatingSelect = ({ label, value, onChange }: { label: string, value: PlayerRating, onChange: (v: PlayerRating) => void }) => (
  <div>
    <label className="block text-[10px] font-black text-gray-400 mb-1 uppercase tracking-widest">{label}</label>
    <select 
      value={value}
      onChange={e => onChange(e.target.value as PlayerRating)}
      className="w-full px-2 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none font-bold"
    >
      <option value="mejora">Mejora</option>
      <option value="igual">Igual</option>
      <option value="reforzar">Reforzar</option>
    </select>
  </div>
);

export default Players;
