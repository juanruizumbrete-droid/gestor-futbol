
import React, { useState } from 'react';
import { Team, SeasonPhase } from '../types';
import { updateSeasonPhase } from '../storage';
import { generateSeasonObjectives } from '../geminiService';

const Season: React.FC<{ activeTeam: Team | null }> = ({ activeTeam }) => {
  const [editingPhaseId, setEditingPhaseId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<SeasonPhase>>({});
  const [generatingField, setGeneratingField] = useState<string | null>(null);

  if (!activeTeam) return (
    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
      <p className="text-gray-400 font-bold">Selecciona un equipo para planificar la temporada.</p>
    </div>
  );

  const startEdit = (phase: SeasonPhase) => {
    setEditingPhaseId(phase.id);
    setFormData(phase);
  };

  const handleSave = () => {
    if (editingPhaseId) {
      updateSeasonPhase(activeTeam.id, editingPhaseId, formData);
      setEditingPhaseId(null);
    }
  };

  const handleAIGenerate = async (phaseLabel: string, type: 'técnicos' | 'tácticos' | 'formativos', field: keyof SeasonPhase) => {
    setGeneratingField(`${editingPhaseId}-${field}`);
    try {
      const suggestion = await generateSeasonObjectives({
        category: activeTeam.category,
        level: activeTeam.level,
        phase: phaseLabel,
        type: type
      });
      setFormData(prev => ({ ...prev, [field]: suggestion }));
    } catch (error) {
      alert("Error al conectar con la IA metodológica.");
    } finally {
      setGeneratingField(null);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Metodología de Temporada</h1>
          <p className="text-gray-500 font-medium">Planificación cíclica CEDIFA para {activeTeam.name}</p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-8">
        {activeTeam.seasonPhases.map((phase) => (
          <div key={phase.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 bg-gray-50 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold text-soccer-green flex items-center gap-3">
                <i className="fa-solid fa-layer-group"></i>
                {phase.label}
              </h2>
              {editingPhaseId === phase.id ? (
                <div className="flex gap-2">
                  <button 
                    onClick={() => setEditingPhaseId(null)}
                    className="text-gray-500 px-4 py-1.5 rounded-xl font-bold hover:bg-gray-200 transition"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={handleSave}
                    className="bg-soccer-green text-white px-5 py-1.5 rounded-xl font-bold hover:bg-soccer-accent transition flex items-center gap-2 shadow-md"
                  >
                    <i className="fa-solid fa-save"></i> Guardar Fase
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => startEdit(phase)}
                  className="text-soccer-accent hover:bg-green-50 px-4 py-1.5 rounded-xl font-bold transition flex items-center gap-2 border border-soccer-accent/20"
                >
                  <i className="fa-solid fa-pen-to-square"></i> Editar Objetivos
                </button>
              )}
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <PhaseSection 
                icon="fa-microchip" 
                title="Técnicos" 
                editing={editingPhaseId === phase.id}
                value={editingPhaseId === phase.id ? formData.techObjectives : phase.techObjectives}
                onChange={(v) => setFormData({...formData, techObjectives: v})}
                onAI={() => handleAIGenerate(phase.label, 'técnicos', 'techObjectives')}
                loading={generatingField === `${phase.id}-techObjectives`}
              />
              <PhaseSection 
                icon="fa-chess-board" 
                title="Tácticos" 
                editing={editingPhaseId === phase.id}
                value={editingPhaseId === phase.id ? formData.tactObjectives : phase.tactObjectives}
                onChange={(v) => setFormData({...formData, tactObjectives: v})}
                onAI={() => handleAIGenerate(phase.label, 'tácticos', 'tactObjectives')}
                loading={generatingField === `${phase.id}-tactObjectives`}
              />
              <PhaseSection 
                icon="fa-seedling" 
                title="Formativos" 
                editing={editingPhaseId === phase.id}
                value={editingPhaseId === phase.id ? formData.formativeObjectives : phase.formativeObjectives}
                onChange={(v) => setFormData({...formData, formativeObjectives: v})}
                onAI={() => handleAIGenerate(phase.label, 'formativos', 'formativeObjectives')}
                loading={generatingField === `${phase.id}-formativeObjectives`}
              />
              <PhaseSection 
                icon="fa-magnifying-glass" 
                title="Observaciones" 
                editing={editingPhaseId === phase.id}
                value={editingPhaseId === phase.id ? formData.observations : phase.observations}
                onChange={(v) => setFormData({...formData, observations: v})}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PhaseSection = ({ icon, title, value, editing, onChange, onAI, loading }: { 
  icon: string, 
  title: string, 
  value?: string, 
  editing: boolean,
  onChange: (v: string) => void,
  onAI?: () => void,
  loading?: boolean
}) => (
  <div className="space-y-3">
    <div className="flex justify-between items-center">
      <h4 className="font-bold text-gray-700 flex items-center gap-2 text-sm uppercase tracking-wider">
        <i className={`fa-solid ${icon} text-soccer-accent`}></i>
        {title}
      </h4>
      {editing && onAI && (
        <button 
          type="button"
          onClick={onAI}
          disabled={loading}
          title="Generar sugerencia con IA"
          className="text-soccer-accent hover:bg-soccer-accent hover:text-white p-1.5 rounded-lg transition-all"
        >
          {loading ? (
            <i className="fa-solid fa-spinner fa-spin text-xs"></i>
          ) : (
            <i className="fa-solid fa-wand-magic-sparkles text-xs"></i>
          )}
        </button>
      )}
    </div>
    {editing ? (
      <textarea 
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-32 p-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-soccer-accent text-sm font-medium resize-none shadow-inner"
        placeholder={`Define objetivos ${title.toLowerCase()}...`}
      />
    ) : (
      <div className="text-sm text-gray-500 leading-relaxed min-h-[80px] bg-gray-50/50 p-4 rounded-2xl border border-dashed border-gray-200 whitespace-pre-wrap font-medium">
        {value || `No hay objetivos ${title.toLowerCase()} definidos.`}
      </div>
    )}
  </div>
);

export default Season;
