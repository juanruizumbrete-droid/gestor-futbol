
import React from 'react';
import { Team } from '../types';
import { Link } from 'react-router-dom';

const Dashboard: React.FC<{ activeTeam: Team | null }> = ({ activeTeam }) => {
  if (!activeTeam) {
    return (
      <div className="text-center py-20">
        <div className="mb-6">
          <i className="fa-solid fa-users-cog text-6xl text-gray-300"></i>
        </div>
        <h2 className="text-2xl font-bold text-gray-700">Bienvenido al Gestor UEFA C</h2>
        <p className="text-gray-500 mt-2">Para comenzar, crea o selecciona un equipo activo.</p>
        <Link to="/teams" className="mt-6 inline-block bg-soccer-green text-white px-6 py-3 rounded-xl hover:bg-soccer-accent transition">
          Gestionar Equipos
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Panel de Control</h1>
          <p className="text-gray-500">Gestión de {activeTeam.name} - {activeTeam.category}</p>
        </div>
        <div className="text-sm text-gray-400">Temporada: {activeTeam.season}</div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon="fa-user-friends" label="Jugadores" value={activeTeam.players.length} color="blue" />
        <StatCard icon="fa-clipboard-check" label="Entrenamientos" value={activeTeam.trainings.length} color="green" />
        <StatCard icon="fa-futbol" label="Partidos" value={activeTeam.matches.length} color="amber" />
        <StatCard icon="fa-trophy" label="Nivel" value={activeTeam.level} color="indigo" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <i className="fa-solid fa-clock-rotate-left text-soccer-green"></i>
            Último Entrenamiento
          </h3>
          {activeTeam.trainings.length > 0 ? (
            <div className="p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <p className="font-medium text-gray-800">{activeTeam.trainings[activeTeam.trainings.length-1].objective}</p>
              <p className="text-sm text-gray-500">{activeTeam.trainings[activeTeam.trainings.length-1].date}</p>
            </div>
          ) : (
            <p className="text-gray-400 italic">No hay sesiones registradas.</p>
          )}
          <Link to="/training" className="mt-4 inline-block text-soccer-accent text-sm font-medium hover:underline">Planificar nueva sesión →</Link>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <i className="fa-solid fa-flag-checkered text-soccer-green"></i>
            Último Partido
          </h3>
          {activeTeam.matches.length > 0 ? (
            <div className="p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <p className="font-medium text-gray-800">vs {activeTeam.matches[activeTeam.matches.length-1].opponent}</p>
              <p className="text-sm text-gray-500">Obj: {activeTeam.matches[activeTeam.matches.length-1].objective}</p>
            </div>
          ) : (
            <p className="text-gray-400 italic">No hay partidos registrados.</p>
          )}
          <Link to="/matches" className="mt-4 inline-block text-soccer-accent text-sm font-medium hover:underline">Analizar partido →</Link>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }: { icon: string, label: string, value: any, color: string }) => {
  const colors: any = {
    blue: 'text-blue-600 bg-blue-50',
    green: 'text-green-600 bg-green-50',
    amber: 'text-amber-600 bg-amber-50',
    indigo: 'text-indigo-600 bg-indigo-50',
  };
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors[color]}`}>
        <i className={`fa-solid ${icon} text-xl`}></i>
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
};

export default Dashboard;
