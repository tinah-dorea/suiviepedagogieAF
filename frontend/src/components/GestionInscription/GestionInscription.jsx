import React from 'react';
import { Tab } from '@headlessui/react';
import { RiBookLine, RiGraduationCapLine, RiFileTextLine } from 'react-icons/ri';
import Prepa from './Prepa';
import Cours from './Cours';
import Examen from './Examen';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function GestionInscription() {
  const tabs = [
    { name: 'Cours', icon: RiBookLine },
    { name: 'Préparation', icon: RiGraduationCapLine },
    { name: 'Examens', icon: RiFileTextLine },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Gestion des Inscriptions</h2>
        
        <Tab.Group>
          <Tab.List className="flex space-x-1 rounded-xl bg-blue-100 p-1 mb-6">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <Tab
                  key={tab.name}
                  className={({ selected }) =>
                    classNames(
                      'w-full py-3 text-sm font-medium leading-5 rounded-lg',
                      'focus:outline-none',
                      selected
                        ? 'bg-white shadow text-blue-700'
                        : 'text-blue-500 hover:bg-white/[0.12] hover:text-blue-700'
                    )
                  }
                >
                  <div className="flex items-center justify-center space-x-2">
                    <IconComponent className="w-5 h-5" />
                    <span>{tab.name}</span>
                  </div>
                </Tab>
              );
            })}
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel>
              <Cours />
            </Tab.Panel>
            <Tab.Panel>
              <Prepa />
            </Tab.Panel>
            <Tab.Panel>
              <Examen />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
}