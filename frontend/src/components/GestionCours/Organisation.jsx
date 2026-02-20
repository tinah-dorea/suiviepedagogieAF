import React from 'react';
import { Tab } from '@headlessui/react';
import { RiTimeLine, RiGroupLine } from 'react-icons/ri';
import Creneau from './Creneau';
import Groupe from './Groupe';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const Organisation = () => {
  const tabs = [
    { name: 'Créneaux horaires', icon: RiTimeLine },
    { name: 'Groupes', icon: RiGroupLine },
  ];

  return (
    <div className="px-4 sm:px-8 py-4 sm:py-6">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Organisation des Cours</h1>
      
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
        
        <Tab.Panels className="mt-2">
          <Tab.Panel
            className={classNames(
              'rounded-xl bg-white p-3',
              'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
            )}
          >
            <Creneau />
          </Tab.Panel>
          <Tab.Panel
            className={classNames(
              'rounded-xl bg-white p-3',
              'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
            )}
          >
            <Groupe />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default Organisation;