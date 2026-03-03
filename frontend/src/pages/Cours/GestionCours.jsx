import React from 'react';
import { Tab } from '@headlessui/react';
import { RiServiceLine, RiBookLine, RiStackLine, RiGroupLine, RiBuildingLine, RiHeartLine } from 'react-icons/ri';
import TypeService from '../../components/GestionCours/TypeService';
import TypeCours from '../../components/GestionCours/TypeCours';
import Niveau from '../../components/GestionCours/Niveau';
import Categorie from '../../components/GestionCours/Categorie';
import Salle from '../../components/GestionCours/Salle';
import Motivation from '../../components/GestionCours/Motivation';
import Groupe from '../../components/GestionCours/Groupe';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const GestionCours = () => {
  const tabs = [
    { name: 'Type de service', icon: RiServiceLine },
    { name: 'Type de cours', icon: RiBookLine },
    { name: 'Niveaux', icon: RiStackLine },
    { name: 'Catégorie', icon: RiGroupLine },
    { name: 'Motivation', icon: RiHeartLine },
    { name: 'Salle', icon: RiBuildingLine },
    { name: 'Groupes', icon: RiGroupLine },
  ];

  return (
    <div className="px-4 sm:px-8 py-4 sm:py-6">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Gestion des Cours</h1>
      
      <Tab.Group>
        <Tab.List className="flex flex-wrap space-x-1 rounded-xl bg-blue-900/20 p-1 overflow-x-auto">
          {tabs.map((tab) => (
            <Tab
              key={tab.name}
              className={({ selected }) =>
                classNames(
                  'flex items-center space-x-2 w-full min-w-[120px] rounded-lg py-2.5 text-sm font-medium leading-5 whitespace-nowrap',
                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-white shadow text-blue-700'
                    : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                )
              }
            >
              <tab.icon className="ml-3 flex-shrink-0" />
              <span className="truncate">{tab.name}</span>
            </Tab>
          ))}
        </Tab.List>
        
        <Tab.Panels className="mt-4 sm:mt-6">
          <Tab.Panel><TypeService /></Tab.Panel>
          <Tab.Panel><TypeCours /></Tab.Panel>
          <Tab.Panel><Niveau /></Tab.Panel>
          <Tab.Panel><Categorie /></Tab.Panel>
          <Tab.Panel><Motivation /></Tab.Panel>
          <Tab.Panel><Salle /></Tab.Panel>
          <Tab.Panel><Groupe /></Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default GestionCours;
