
import React from 'react';
import { AppState } from '../types';
// Fix: Use correct exported names from storage.ts
import { restoreTrashItem, permanentDelete, clearTrash, deletePlayer, deleteTraining, deleteMatch, deleteTeam } from '../storage';

const Trash: React.FC<{ state: AppState }> = ({ state }) => {
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    const type = e.dataTransfer.getData('type') as any;

    if (!id || !type) return;

    if (confirm(`¿Mover este elemento a la papelera?`)) {
      // Fix: Manually locate the team owning the item to provide required teamId
      if (type === 'player') {
        const team = state.teams.find(t => t.players.some(p => p.id === id));
        if (team) deletePlayer(team.id, id);
      }
      if (type === 'training') {
        const team = state.teams.find(t => t.trainings.some(tr => tr.id === id));
        if (team) deleteTraining(team.id, id);
      }
      if (type === 'match') {
        const team = state.teams.find(t => t.matches.some(m => m.id === id));
        if (team) deleteMatch(team.id, id);
      }
      if (type === 'team') deleteTeam(id);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'team': return 'fa-users-cog text-blue-500';
      case 'player': return 'fa-user text-green-500';
      case 'training': return 'fa-clipboard-list text-amber-500';
      case 'match': return 'fa-futbol text-indigo-500';
      default: return 'fa-file text-gray-500';
    }
  };

  return (
    <div className="space-y-6" onDragOver={onDragOver} onDrop={onDrop}>
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Papelera</h1>
          <p className="text-gray-500">Gestiona y restaura elementos eliminados</p>
        </div>
        {state.trash.length > 0 && (
          <button 
            // Fix: Corrected clearTrash function name
            onClick={() => confirm('¿Vaciar papelera permanentemente?') && clearTrash()}
            className="text-red-500 bg-red-50 px-5 py-2.5 rounded-xl hover:bg-red-100 transition font-bold text-sm"
          >
            Vaciar Papelera
          </button>
        )}
      </header>

      <div className="bg-white rounded-3xl border-2 border-dashed border-gray-100 min-h-[500px] p-8">
        {state.trash.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-30 py-20">
            <i className="fa-solid fa-trash-arrow-up text-8xl"></i>
            <p className="text-xl font-bold">La papelera está vacía</p>
            <p className="max-w-xs text-sm">Puedes arrastrar elementos aquí para eliminarlos temporalmente.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {state.trash.map(item => (
              <div key={item.id} className="bg-gray-50 p-5 rounded-2xl border border-gray-200 flex flex-col justify-between group">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <i className={`fa-solid ${getTypeIcon(item.type)} text-xl`}></i>
                      <span className="text-[10px] uppercase font-black text-gray-400 tracking-widest">{item.type}</span>
                    </div>
                    <span className="text-[10px] text-gray-400">{new Date(item.deletedAt).toLocaleDateString()}</span>
                  </div>
                  <h4 className="font-bold text-gray-800 mb-1">
                    {item.type === 'team' ? item.data.name : 
                     item.type === 'player' ? item.data.name : 
                     item.type === 'training' ? item.data.objective : 
                     item.type === 'match' ? `vs ${item.data.opponent}` : 'Elemento'}
                  </h4>
                  <p className="text-xs text-gray-400 mb-6 truncate italic">
                    {item.type === 'player' ? item.data.position : 
                     item.type === 'team' ? item.data.category : 
                     item.type === 'training' ? item.data.category : 
                     item.type === 'match' ? item.data.date : ''}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-200/50">
                  <button 
                    // Fix: Corrected restoreTrashItem function name
                    onClick={() => restoreTrashItem(item.id)}
                    className="py-2 bg-soccer-green text-white text-xs font-bold rounded-lg hover:bg-soccer-accent transition"
                  >
                    Restaurar
                  </button>
                  <button 
                    onClick={() => permanentDelete(item.id)}
                    className="py-2 bg-white text-red-500 border border-red-100 text-xs font-bold rounded-lg hover:bg-red-50 transition"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3 items-center">
        <i className="fa-solid fa-circle-info text-amber-500 text-xl"></i>
        <p className="text-xs text-amber-800">
          <strong>Truco de productividad:</strong> Arrastra cualquier tarjeta de jugador, entrenamiento o partido directamente a esta pantalla para eliminarla rápidamente.
        </p>
      </div>
    </div>
  );
};

export default Trash;
