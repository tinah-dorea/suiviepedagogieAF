import React, { useState } from 'react';
import { Tab } from '@headlessui/react';
import { RiBookLine, RiGraduationCapLine, RiFileTextLine } from 'react-icons/ri';
import Prepa from './Prepa';
import Cours from './Cours';
import Examen from './Examen';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const GestionInscription = () => {
  const tabs = [
    { name: 'Prépa', icon: RiGraduationCapLine },
    { name: 'Cours', icon: RiBookLine },
    { name: 'Examen', icon: RiFileTextLine },
  ];

  return (
    <div className="px-8 py-6">
      <h1 className="text-2xl font-bold mb-6">Gestion des Inscriptions</h1>

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
            <Prepa />
          </Tab.Panel>
          <Tab.Panel
            className={classNames(
              'rounded-xl bg-white p-3',
              'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
            )}
          >
            <Cours />
          </Tab.Panel>
          <Tab.Panel
            className={classNames(
              'rounded-xl bg-white p-3',
              'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
            )}
          >
            <Examen />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default GestionInscription;
