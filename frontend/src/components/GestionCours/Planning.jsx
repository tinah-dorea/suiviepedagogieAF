import React, { useState, useEffect } from 'react';
import creneauService from '../../services/creneauService';
import groupeService from '../../services/groupeService';

const Planning = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [creneaux, setCreneaux] = useState([]);
  const [groupes, setGroupes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get user info to determine if they are a teacher
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isTeacher = user.service === 'professeurs';

  useEffect(() => {
    const fetchData = async () => {
      try {
        let creneauxData;
        
        if (isTeacher) {
          // If user is a teacher, get only their schedule
          creneauxData = await creneauService.getByProfesseur();
        } else {
          // Otherwise, get all schedules
          creneauxData = await creneauService.getAll();
        }
        
        setCreneaux(creneauxData);
        
        // Also fetch group information to display course details
        const groupesData = await groupeService.getAll();
        setGroupes(groupesData);
      } catch (err) {
        setError(err.message);
        console.error("Erreur lors de la récupération des données:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isTeacher, user]);

  // Helper function to get formatted dates for the current week (Monday to Saturday)
  const getWeekDates = (date) => {
    const startDate = new Date(date);
    // Find the Monday of the current week
    const day = startDate.getDay();
    const diff = startDate.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is Sunday
    const monday = new Date(startDate.setDate(diff));

    const week = [];
    for (let i = 0; i < 6; i++) { // Change from 7 days to 6 days (Monday to Saturday)
      const currentDay = new Date(monday);
      currentDay.setDate(monday.getDate() + i);
      week.push(currentDay);
    }
    return week;
  };

  const weekDates = getWeekDates(currentWeek);

  // Format date as DD/MM/YYYY
  const formatDate = (date) => {
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  // Format day name
  const formatDayName = (date) => {
    return date.toLocaleDateString('fr-FR', { weekday: 'short' });
  };

  // Get the day of week number (0 = Sunday, 1 = Monday, etc.)
  const getDayOfWeekNumber = (date) => {
    const day = date.getDay();
    return day === 0 ? 6 : day - 1; // Convert to 0=Monday, 6=Sunday
  };

  // Time slots (from 7:00 to 20:00 in 1-hour intervals)
  const timeSlots = [];
  for (let hour = 7; hour <= 20; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
  }

  // Function to get creneau for a specific day and time
  const getCreneauxForTimeSlot = (dayIndex, timeSlot) => {
    return creneaux.filter(creneau => {
      // Extract the hour from creneau's heure_debut
      const creneauHour = parseInt(creneau.heure_debut.split(':')[0]);
      const creneauDay = getDayOfWeekNumber(new Date(creneau.jour_semaine)); // This returns 0=Monday to 6=Sunday
      
      // The dayIndex parameter corresponds to our weekDates array:
      // dayIndex 0 = Monday (which is day 0 in our system)
      // dayIndex 1 = Tuesday (which is day 1 in our system)
      // ...
      // dayIndex 5 = Saturday (which is day 5 in our system)
      
      // So we can directly compare dayIndex with creneauDay (except for Sunday which is 6)
      // But since we only have indices 0-5 (Mon-Sat), we don't need to worry about Sunday (6)
      return creneauDay === dayIndex && creneauHour === parseInt(timeSlot.split(':')[0]);
    });
  };

  // Function to get group info by creneau
  const getGroupeInfo = (creneau) => {
    const groupe = groupes.find(g => g.id_creneau === creneau.id);
    return groupe;
  };

  // Function to navigate to previous week
  const prevWeek = () => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentWeek(newDate);
  };

  // Function to navigate to next week
  const nextWeek = () => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentWeek(newDate);
  };

  // Function to navigate to current week
  const goToCurrentWeek = () => {
    setCurrentWeek(new Date());
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg text-gray-600">Chargement du planning...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Erreur! </strong>
        <span className="block sm:inline">Impossible de charger le planning: {error}</span>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h3 className="text-lg font-semibold mb-2 sm:mb-0">Emploi du Temps</h3>
        <div className="flex space-x-2">
          <button 
            onClick={prevWeek}
            className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300 text-sm"
          >
            &lt; Semaine
          </button>
          <button 
            onClick={goToCurrentWeek}
            className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300 text-sm"
          >
            Aujourd'hui
          </button>
          <button 
            onClick={nextWeek}
            className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300 text-sm"
          >
            Semaine &gt;
          </button>
        </div>
      </div>

      <div className="mb-4 text-center">
        <h4 className="text-md font-medium">
          Semaine du {formatDate(weekDates[0])} au {formatDate(weekDates[5])}
        </h4>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2 w-24"></th>
              {weekDates.map((date, index) => (
                <th key={index} className="border border-gray-300 p-2 min-w-[120px]">
                  <div className="font-medium">{formatDayName(date)}</div>
                  <div className="text-sm">{formatDate(date)}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((timeSlot, hourIndex) => (
              <tr key={hourIndex}>
                <td className="border border-gray-300 p-2 text-center font-medium bg-gray-50">
                  {timeSlot}
                </td>
                {weekDates.map((date, dayIndex) => {
                  const dayCreneaux = getCreneauxForTimeSlot(dayIndex, timeSlot);
                  return (
                    <td key={dayIndex} className="border border-gray-300 p-1 align-top h-20">
                      <div className="space-y-1">
                        {dayCreneaux.map(creneau => {
                          const groupe = getGroupeInfo(creneau);
                          return (
                            <div 
                              key={creneau.id} 
                              className="p-2 rounded text-xs text-white"
                              style={{ backgroundColor: '#7B011E' }} // Primary color
                            >
                              <div className="font-medium truncate">
                                {groupe?.nom_type_cours || 'Cours'}
                              </div>
                              <div className="truncate">
                                {groupe?.nom_salle || 'Salle non définie'}
                              </div>
                              <div className="text-xs opacity-80 truncate">
                                {groupe?.nom_prof || 'Prof. non assigné'}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        <h4 className="text-md font-semibold mb-3">Légende</h4>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded mr-2" style={{ backgroundColor: '#7B011E' }}></div>
            <span className="text-sm">Cours en salle</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Planning;