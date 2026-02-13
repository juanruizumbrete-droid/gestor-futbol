
import React from 'react';
import { Team, PlayerRating } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

const Progress: React.FC<{ activeTeam: Team | null }> = ({ activeTeam }) => {
  if (!activeTeam) return <div className="text-center p-12 text-gray-400">Selecciona un equipo primero.</div>;

  const getStats = () => {
    const total = activeTeam.players.length;
    if (total === 0) return [];
    
    const countRating = (key: keyof Pick<import('../types').Player, 'control' | 'passing' | 'participation' | 'attitude'>, rating: PlayerRating) => 
      activeTeam.players.filter(p => p[key] === rating).length;

    return [
      { name: 'Control', mejora: countRating('control', 'mejora'), igual: countRating('control', 'igual'), reforzar: countRating('control', 'reforzar') },
      { name: 'Pase', mejora: countRating('passing', 'mejora'), igual: countRating('passing', 'igual'), reforzar: countRating('passing', 'reforzar') },
      { name: 'Part.', mejora: countRating('participation', 'mejora'), igual: countRating('participation', 'igual'), reforzar: countRating('participation', 'reforzar') },
      { name: 'Actitud', mejora: countRating('attitude', 'mejora'), igual: countRating('attitude', 'igual'), reforzar: countRating('attitude', 'reforzar') },
    ];
  };

  const data = getStats();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-gray-800">Progreso del Equipo</h1>
        <p className="text-gray-500">Métricas metodológicas acumuladas</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <i className="fa-solid fa-chart-column text-soccer-green"></i>
            Estado de Habilidades Técnicas
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                />
                <Bar dataKey="mejora" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
                <Bar dataKey="igual" stackId="a" fill="#3b82f6" />
                <Bar dataKey="reforzar" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex justify-center gap-6 text-xs font-bold uppercase tracking-wider">
            <span className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-[#10b981]"></div> Mejora</span>
            <span className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-[#3b82f6]"></div> Igual</span>
            <span className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-[#ef4444]"></div> Reforzar</span>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Resumen de Actividad</h3>
            <p className="text-sm text-gray-400 mb-6">Frecuencia de entrenamiento y carga competitiva</p>
          </div>
          
          <div className="space-y-6">
            <ActivityRow label="Entrenamientos realizados" value={activeTeam.trainings.length} total={32} color="bg-green-500" />
            <ActivityRow label="Partidos analizados" value={activeTeam.matches.length} total={12} color="bg-blue-500" />
            <ActivityRow label="Jugadores evaluados" value={activeTeam.players.length} total={activeTeam.players.length} color="bg-purple-500" />
          </div>

          <div className="mt-8 p-4 bg-gray-50 rounded-2xl text-xs text-gray-500 italic border border-gray-100">
            "El progreso en estas edades no se mide en victorias, sino en la adquisición de conceptos técnicos y valores de grupo." - Metodología CEDIFA
          </div>
        </div>
      </div>
    </div>
  );
};

const ActivityRow = ({ label, value, total, color }: { label: string, value: number, total: number, color: string }) => {
  const percentage = Math.min((value / (total || 1)) * 100, 100);
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600 font-medium">{label}</span>
        <span className="font-bold text-gray-800">{value}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} transition-all duration-1000`} style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
};

export default Progress;
