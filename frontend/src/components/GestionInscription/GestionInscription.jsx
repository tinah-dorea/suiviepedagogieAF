import React from 'react';
import { Tab } from '@headlessui/react';
import { RiListCheck3, RiUser3Line, RiCheckLine } from 'react-icons/ri';
import ListeInscriptions from './ListeInscriptions';
import Apprenant from './Apprenant';
import Inscription from './Inscription';

// Modern Pastel Palette
const COLORS = {
  bg: '#F8F9FA',
  card: '#FFFFFF',
  primary: '#6B9080',
  secondary: '#A4C3B2',
  accent: '#EAF4F4',
  text: '#2D3436',
  textLight: '#636E72',
  gradient: 'linear-gradient(135deg, #6B9080 0%, #A4C3B2 100%)',
};

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function GestionInscription() {
  const tabs = [
    { name: 'Liste des inscriptions', icon: RiListCheck3 },
    { name: 'Apprenants', icon: RiUser3Line },
    { name: 'Inscriptions', icon: RiCheckLine },
  ];

  return (
    <div className="p-6 min-h-screen" style={{ backgroundColor: COLORS.bg }}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: COLORS.gradient }}>
            <RiListCheck3 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: COLORS.text }}>Gestion des Inscriptions</h1>
            <p className="text-sm" style={{ color: COLORS.textLight }}>Gérez les inscriptions et les apprenants</p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl shadow-sm border p-6" style={{ backgroundColor: COLORS.card, borderColor: COLORS.border }}>
        <Tab.Group>
          <Tab.List className="flex gap-2 rounded-xl p-1 mb-6" style={{ backgroundColor: COLORS.accent }}>
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <Tab
                  key={tab.name}
                  className={({ selected }) =>
                    classNames(
                      'flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-semibold rounded-lg transition-all duration-200',
                      selected
                        ? 'bg-white shadow-md'
                        : 'hover:bg-white/50 text-gray-500',
                      selected ? 'text-green-700' : ''
                    )
                  }
                >
                  <IconComponent className="w-5 h-5" />
                  <span className="hidden sm:inline">{tab.name}</span>
                </Tab>
              );
            })}
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel>
              <ListeInscriptions />
            </Tab.Panel>
            <Tab.Panel>
              <Apprenant />
            </Tab.Panel>
            <Tab.Panel>
              <Inscription />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
}