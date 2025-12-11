import React from 'react';
import { Tab } from '@headlessui/react';
import { RiServiceLine, RiBookLine, RiStackLine, RiGroupLine, RiTimeLine, RiCalendarLine, RiBuildingLine } from 'react-icons/ri';
import TypeService from '../../components/GestionCours/TypeService';
import TypeCours from '../../components/GestionCours/TypeCours';
import Niveau from '../../components/GestionCours/Niveau';
import Categorie from '../../components/GestionCours/Categorie';
import Horaire from '../../components/GestionCours/Horaire';
import Session from '../../components/GestionCours/Session';
import Salle from '../../components/GestionCours/Salle';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const GestionCours = () => {
  const tabs = [
    { name: 'Type de service', icon: RiServiceLine },
    { name: 'Type de cours', icon: RiBookLine },
    { name: 'Niveaux', icon: RiStackLine },
    { name: 'Catégorie', icon: RiGroupLine },
    { name: 'Horaire', icon: RiTimeLine },
    { name: 'Session', icon: RiCalendarLine },
    { name: 'Salle', icon: RiBuildingLine },
  ];

  return (
    <div className="px-8 py-6">
      <h1 className="text-2xl font-bold mb-6">Gestion des Cours</h1>
      
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
          {tabs.map((tab) => (
            <Tab
              key={tab.name}
              className={({ selected }) =>
                classNames(
                  'flex items-center space-x-2 w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-white shadow text-blue-700'
                    : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                )
              }
            >
              <tab.icon className="ml-3" />
              <span>{tab.name}</span>
            </Tab>
          ))}
        </Tab.List>
        
        <Tab.Panels className="mt-2">
          <Tab.Panel
            className={classNames(
              'rounded-xl bg-white p-3',
              'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
            )}
          >
            <TypeService />
          </Tab.Panel>
          <Tab.Panel
            className={classNames(
              'rounded-xl bg-white p-3',
              'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
            )}
          >
            <TypeCours />
          </Tab.Panel>
          <Tab.Panel
            className={classNames(
              'rounded-xl bg-white p-3',
              'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
            )}
          >
            <Niveau />
          </Tab.Panel>
          <Tab.Panel
            className={classNames(
              'rounded-xl bg-white p-3',
              'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
            )}
          >
            <Categorie />
          </Tab.Panel>
          <Tab.Panel
            className={classNames(
              'rounded-xl bg-white p-3',
              'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
            )}
          >
            <Horaire />
          </Tab.Panel>
          <Tab.Panel
            className={classNames(
              'rounded-xl bg-white p-3',
              'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
            )}
          >
            <Session />
          </Tab.Panel>
          <Tab.Panel
            className={classNames(
              'rounded-xl bg-white p-3',
              'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
            )}
          >
            <Salle />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default GestionCours;