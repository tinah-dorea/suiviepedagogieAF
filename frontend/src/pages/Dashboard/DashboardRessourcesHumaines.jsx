import React from 'react';

// Composant de Carte de Statistiques
const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center" style={{ borderLeft: `5px solid ${color}` }}>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-2xl font-bold mt-1" style={{ color: color }}>{value}</p>
    </div>
    <Icon className="h-8 w-8 text-gray-300" />
  </div>
);

// Icônes
const UserIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const RevenueIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;
const ExpenseIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0l-4-4m4 4l-4 4M4 17h8m0 0l-4-4m4 4l-4 4" /></svg>;
const TaskIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2m-2 4h.01M16 12h.01M16 16h.01M10 12h.01M10 16h.01M10 8h.01M9 16h.01M9 12h.01M9 8h.01" /></svg>;

const DashboardRessourcesHumaines = () => {
  const mainColor = '#DC2626';

  return (
    <>
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Revenus" value="Rp 120.000.000" icon={RevenueIcon} color="#10B981" />
        <StatCard title="Dépenses Totales" value="Rp 20.000.000" icon={ExpenseIcon} color={mainColor} />
        <StatCard title="Total Élèves" value="150" icon={UserIcon} color="#3B82F6" />
        <StatCard title="Total Tâches" value="24" icon={TaskIcon} color="#8B5CF6" />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        <div className="lg:col-span-4 bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Distribution <span className="text-3xl font-bold ml-2" style={{ color: mainColor }}>35%</span>
          </h3>
          <div className="flex justify-center items-center mb-6"></div>
          <ul className="text-sm">
            <li className="flex items-center mb-1"><span className="w-3 h-3 rounded-full mr-2 bg-green-400"></span><span className="text-gray-600">Progress Tracking</span></li>
            <li className="flex items-center mb-1"><span className="w-3 h-3 rounded-full mr-2 bg-yellow-400"></span><span className="text-gray-600">User Activity</span></li>
            <li className="flex items-center mb-1"><span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: mainColor }}></span><span className="text-gray-600">Sales Performance</span></li>
            <li className="flex items-center"><span className="w-3 h-3 rounded-full mr-2 bg-purple-500"></span><span className="text-gray-600">Task Completion</span></li>
          </ul>
        </div>
        <div className="lg:col-span-8 bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Statistiques Rapides</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-lg bg-gray-50">
              <p className="text-3xl font-bold" style={{ color: mainColor }}>10</p>
              <p className="text-sm text-gray-600">Total Employés</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50">
              <p className="text-3xl font-bold" style={{ color: mainColor }}>5</p>
              <p className="text-sm text-gray-600">Sessions Actives</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50">
              <p className="text-3xl font-bold" style={{ color: mainColor }}>92%</p>
              <p className="text-sm text-gray-600">Taux de Présence</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4 flex justify-between items-center text-gray-800">
            Today Insight
            <button className="text-sm" style={{ color: mainColor }}>See more</button>
          </h3>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4 flex justify-between items-center text-gray-800">
            Weekly Report
            <button className="text-sm" style={{ color: mainColor }}>See more</button>
          </h3>
        </div>
      </section>
    </>
  );
};

export default DashboardRessourcesHumaines;
