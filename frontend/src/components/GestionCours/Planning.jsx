import React, { useState } from 'react';

const Planning = () => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);
  
  const [selectedYear, setSelectedYear] = useState(currentYear);
  
  // Generate calendar data for the selected year
  const generateCalendar = (year) => {
    const months = [];
    for (let month = 0; month < 12; month++) {
      const date = new Date(year, month, 1);
      const monthName = date.toLocaleString('fr-FR', { month: 'long' });
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sunday, 1 = Monday, etc.
      
      // Adjust first day to start on Monday (0 = Monday, 6 = Sunday)
      const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
      
      months.push({
        name: monthName.charAt(0).toUpperCase() + monthName.slice(1),
        daysInMonth,
        firstDay: adjustedFirstDay,
        monthIndex: month
      });
    }
    return months;
  };
  
  const monthsData = generateCalendar(selectedYear);

  // Function to render calendar days
  const renderCalendarDays = (month) => {
    const days = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < month.firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }
    
    // Cells for actual days of the month
    for (let day = 1; day <= month.daysInMonth; day++) {
      days.push(
        <div 
          key={`${month.monthIndex}-${day}`} 
          className="p-2 text-center border border-gray-200 text-sm"
        >
          {day}
        </div>
      );
    }
    
    return days;
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Planning Annuel</h3>
      
      {/* Year Selector */}
      <div className="mb-6">
        <label htmlFor="year-select" className="block text-sm font-medium text-gray-700 mb-2">
          Sélectionner une année
        </label>
        <select
          id="year-select"
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      
      {/* Calendar Display */}
      <div className="overflow-x-auto">
        <div className="min-w-full">
          {monthsData.map((month, index) => (
            <div key={index} className="mb-8">
              <h4 className="text-md font-semibold mb-2 text-center">{month.name} {selectedYear}</h4>
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
                  <div key={day} className="p-2 text-center font-medium text-xs text-gray-500">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {renderCalendarDays(month)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Planning;