
import React, { useState } from 'react';
import { Team, TrainingSession, Category, Level } from '../types';
import { generateTrainingSession } from '../geminiService';
import { createTraining, deleteTraining } from '../storage';

const TrainingGenerator: React.FC<{ activeTeam: Team | null }> = ({ activeTeam }) => {
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<Partial<TrainingSession> | null>(null);
  const [formData, setFormData] = useState({
    objective: '',
    duration: '90 min',
    material: 'Balones, conos, petos, porterías pequeñas',
    playerCount: activeTeam?.players.length || 12
  });

  if (!activeTeam) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
        <p className="text-gray-400 font-bold">Selecciona un equipo para generar entrenamientos.</p>
      </div>
    );
  }

  const handleGenerate = async () => {
    if (!formData.objective) return alert('Define un objetivo para la sesión.');
    setLoading(true);
    try {
      const content = await generateTrainingSession({
        category: activeTeam.category,
        age: activeTeam.age,
        level: activeTeam.level,
        playerCount: formData.playerCount,
        objective: formData.objective,
        duration: formData.duration,
        material: formData.material
      });

      setSession({
        id: crypto.randomUUID(),
        date: new Date().toLocaleDateString('es-ES'),
        category: activeTeam.category,
        age: activeTeam.age,
        level: activeTeam.level,
        playerCount: formData.playerCount,
        objective: formData.objective,
        duration: formData.duration,
        material: formData.material,
        content: content as TrainingSession['content']
      });
    } catch (error) {
      console.error(error);
      alert('Error al generar la sesión. Revisa tu conexión.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (session && activeTeam) {
      createTraining(activeTeam.id, session as TrainingSession);
      alert('Entrenamiento guardado en la biblioteca.');
      setSession(null);
      setFormData({ ...formData, objective: '' });
    }
  };

  const handleViewDetails = (tr: TrainingSession) => {
    setSession(tr);
    // Hacer scroll hacia arriba para ver la sesión
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.setData('type', 'training');
  };

  const isAlreadySaved = activeTeam.trainings.some(t => t.id === session?.id);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-gray-800">Generador de Sesiones</h1>
        <p className="text-gray-500">Metodología CEDIFA integrada con IA</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit space-y-4">
          <h2 className="text-lg font-bold text-gray-700 border-b pb-2">Parámetros de Sesión</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Objetivo Metodológico</label>
            <input 
              type="text"
              value={formData.objective}
              onChange={e => setFormData({...formData, objective: e.target.value})}
              placeholder="Ej: Salida de balón desde portero"
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-soccer-accent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Nº Jugadores</label>
              <input 
                type="number"
                value={formData.playerCount}
                onChange={e => setFormData({...formData, playerCount: parseInt(e.target.value) || 0})}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Duración</label>
              <input 
                type="text"
                value={formData.duration}
                onChange={e => setFormData({...formData, duration: e.target.value})}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Material Disponible</label>
            <textarea 
              value={formData.material}
              onChange={e => setFormData({...formData, material: e.target.value})}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none h-24 text-sm"
            ></textarea>
          </div>

          <button 
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-3 bg-soccer-green text-white font-bold rounded-xl hover:bg-soccer-accent transition flex items-center justify-center gap-2 shadow-md"
          >
            {loading ? (
              <><i className="fa-solid fa-spinner fa-spin"></i> Generando sesión...</>
            ) : (
              <><i className="fa-solid fa-wand-magic-sparkles"></i> Diseñar Sesión</>
            )}
          </button>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {session ? (
            <div className="bg-white rounded-2xl shadow-sm border border-soccer-accent overflow-hidden animate-in fade-in slide-in-from-bottom-4">
              <div className="bg-soccer-green p-6 text-white flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">{session.objective}</h3>
                  <p className="text-sm opacity-80">{session.category} • {session.level} • {session.duration}</p>
                </div>
                <div className="flex gap-2">
                  {!isAlreadySaved && (
                    <button 
                      onClick={handleSave}
                      className="bg-white text-soccer-green px-4 py-2 rounded-lg font-bold hover:bg-green-50 transition shadow-sm"
                    >
                      <i className="fa-solid fa-save mr-2"></i> Guardar
                    </button>
                  )}
                  <button 
                    onClick={() => setSession(null)}
                    className="bg-white/10 text-white px-4 py-2 rounded-lg font-bold hover:bg-white/20 transition border border-white/20"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <ContentBlock icon="fa-gamepad" title="1. Juego / Activación" content={session.content?.juego} />
                <ContentBlock icon="fa-arrows-spin" title="2. Circuito Técnico" content={session.content?.circuitoTecnico} />
                <ContentBlock icon="fa-circle-dot" title="3. Posesión" content={session.content?.posesion} />
                <ContentBlock icon="fa-futbol" title="4. Partido Condicionado" content={session.content?.partidoCondicionado} />
                <ContentBlock icon="fa-bolt" title="5. Oleada" content={session.content?.oleada} />
                <div className="md:col-span-2 p-4 bg-amber-50 rounded-xl text-xs text-amber-800 border border-amber-100 flex items-center gap-3">
                  <i className="fa-solid fa-triangle-exclamation text-lg"></i>
                  <p>Recuerda adaptar la intensidad y las pausas de hidratación según el clima y estado físico de los jugadores.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-12 rounded-2xl border border-dashed border-gray-200 text-center flex flex-col items-center justify-center space-y-4 min-h-[400px]">
              <i className="fa-solid fa-clipboard-list text-6xl text-gray-100"></i>
              <p className="text-gray-400 font-medium">Configura los parámetros o selecciona una sesión de la biblioteca.</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-12 space-y-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
          <i className="fa-solid fa-book-bookmark text-soccer-accent"></i>
          Biblioteca de Sesiones
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTeam.trainings.map(tr => (
            <div 
              key={tr.id} 
              draggable 
              onDragStart={(e) => onDragStart(e, tr.id)}
              className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm group hover:border-soccer-green hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-black uppercase tracking-wider">{tr.date}</span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('¿Mover sesión a la papelera?')) deleteTraining(activeTeam.id, tr.id);
                    }}
                    className="text-gray-300 hover:text-red-500 transition opacity-0 group-hover:opacity-100 p-1"
                  >
                    <i className="fa-solid fa-trash-alt text-xs"></i>
                  </button>
                </div>
                <h4 className="font-bold text-gray-800 mb-1 line-clamp-1">{tr.objective}</h4>
                <p className="text-[11px] text-gray-400 mb-4">{tr.playerCount} Jugadores • {tr.duration}</p>
              </div>
              <button 
                onClick={() => handleViewDetails(tr)}
                className="w-full py-2 text-center text-sm font-bold text-soccer-green bg-green-50 rounded-xl hover:bg-soccer-green hover:text-white transition-colors"
              >
                Ver detalles
              </button>
            </div>
          ))}
          {activeTeam.trainings.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-400 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center">
              <i className="fa-solid fa-folder-open text-4xl mb-3 opacity-20"></i>
              <p className="font-bold">Aún no has guardado sesiones en este equipo.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ContentBlock = ({ icon, title, content }: { icon: string, title: string, content?: string }) => (
  <div className="space-y-2">
    <h4 className="font-bold text-soccer-green flex items-center gap-2 text-sm uppercase tracking-widest">
      <i className={`fa-solid ${icon}`}></i>
      {title}
    </h4>
    <div className="bg-gray-50 p-4 rounded-xl text-sm text-gray-700 leading-relaxed min-h-[100px] border border-gray-100 shadow-inner">
      {content || 'Cargando contenido...'}
    </div>
  </div>
);

export default TrainingGenerator;
