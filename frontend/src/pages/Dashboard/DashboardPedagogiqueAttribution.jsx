import React, { useState, useEffect } from 'react';
import inscriptionService from '../../services/inscriptionService';
import sessionService from '../../services/sessionService';
import typeCoursService from '../../services/typeCoursService';

const DashboardPedagogiqueAttribution = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [typeCours, setTypeCours] = useState([]);
  const [selectedSession, setSelectedSession] = useState('');
  const [selectedTypeCours, setSelectedTypeCours] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [selectedSession, selectedTypeCours, students]);

  const fetchData = async () => {
    try {
      // Fetch students/registrations
      const studentData = await inscriptionService.getAll();
      setStudents(studentData);
      
      // Fetch sessions
      const sessionData = await sessionService.getAll();
      setSessions(sessionData);
      
      // Fetch course types
      const typeCoursData = await typeCoursService.getAll();
      setTypeCours(typeCoursData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const applyFilters = () => {
    let result = [...students];
    
    if (selectedSession) {
      result = result.filter(student => 
        student.id_session === parseInt(selectedSession)
      );
    }
    
    if (selectedTypeCours) {
      result = result.filter(student => 
        student.session?.id_type_cours === parseInt(selectedTypeCours)
      );
    }
    
    setFilteredStudents(result);
  };

  const handleSelectStudent = (studentId) => {
    setSelectedStudents(prev => {
      if (prev.includes(studentId)) {
        return prev.filter(id => id !== studentId);
      } else {
        return [...prev, studentId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === filteredStudents.length) {
      // Deselect all
      setSelectedStudents([]);
    } else {
      // Select all
      setSelectedStudents(filteredStudents.map(student => student.id));
    }
  };

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Attribution Professeur/Salle</h1>
      
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Session</label>
            <select
              value={selectedSession}
              onChange={(e) => setSelectedSession(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Toutes les sessions</option>
              {sessions.map(session => (
                <option key={session.id} value={session.id}>
                  {session.nom} - {session.annee}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type de Cours</label>
            <select
              value={selectedTypeCours}
              onChange={(e) => setSelectedTypeCours(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tous les types de cours</option>
              {typeCours.map(type => (
                <option key={type.id} value={type.id}>
                  {type.nom}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Students Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input 
                    type="checkbox" 
                    checked={selectedStudents.length > 0 && selectedStudents.length === filteredStudents.length}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom complet
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Session
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type de Cours
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student.id} className={selectedStudents.includes(student.id) ? 'bg-blue-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input 
                        type="checkbox" 
                        checked={selectedStudents.includes(student.id)}
                        onChange={() => handleSelectStudent(student.id)}
                        className="h-4 w-4 text-blue-600 rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {student.etudiant?.nom} {student.etudiant?.prenom}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {student.session?.nom} - {student.session?.annee}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {student.session?.type_cours?.nom}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">
                        Attribuer Prof
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        Attribuer Salle
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                    Aucun étudiant trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {selectedStudents.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <p className="text-sm text-gray-700">
              {selectedStudents.length} étudiant(s) sélectionné(s)
            </p>
            <div className="mt-2">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm mr-2">
                Attribuer Professeur
              </button>
              <button className="bg-green-600 text-white px-4 py-2 rounded-md text-sm">
                Attribuer Salle
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPedagogiqueAttribution;