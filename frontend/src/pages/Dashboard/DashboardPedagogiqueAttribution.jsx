import React, { useState, useEffect } from 'react';
import inscriptionService from '../../services/inscriptionService';
import sessionService from '../../services/sessionService';
import typeCoursService from '../../services/typeCoursService';
import niveauService from '../../services/niveauService';
import salleService from '../../services/salleService';
import professeurService from '../../services/professeurService';
import creneauService from '../../services/creneauService';
import groupeService from '../../services/groupeService';
import affectationSalleService from '../../services/affectationSalleService';

const DashboardPedagogiqueAttribution = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [typeCours, setTypeCours] = useState([]);
  const [niveaux, setNiveaux] = useState([]);
  const [salles, setSalles] = useState([]);
  const [professeurs, setProfesseurs] = useState([]);
  const [creneaux, setCreneaux] = useState([]);
  const [groupes, setGroupes] = useState([]);
  const [affectationsSalle, setAffectationsSalle] = useState([]);
  const [selectedSession, setSelectedSession] = useState('');
  const [selectedTypeCours, setSelectedTypeCours] = useState('');
  const [selectedNiveau, setSelectedNiveau] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignmentType, setAssignmentType] = useState(''); // 'prof' or 'salle'
  const [assignments, setAssignments] = useState({}); // Track assignments for each student

  useEffect(() => {
    fetchData();
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    applyFilters();
  }, [selectedSession, selectedTypeCours, selectedNiveau, students, creneaux, groupes, affectationsSalle]);

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
      
      // Fetch levels
      const niveauData = await niveauService.getAll();
      setNiveaux(niveauData);
      
      // Fetch rooms
      const salleData = await salleService.getAll();
      setSalles(salleData);
      
      // Fetch professors
      const profData = await professeurService.getAll();
      setProfesseurs(profData);
      
      // Fetch creneaux
      const creneauData = await creneauService.getAll();
      setCreneaux(creneauData);
      
      // Fetch groups
      const groupeData = await groupeService.getAll();
      setGroupes(groupeData);
      
      // Fetch room assignments
      const affectationData = await affectationSalleService.getAll();
      setAffectationsSalle(affectationData);
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
    
    if (selectedNiveau) {
      result = result.filter(student => 
        student.niveau_scolaire === selectedNiveau
      );
    }
    
    setFilteredStudents(result);
  };

  // Helper functions to get related data
  const getProfessorByStudent = (student) => {
    if (!student.id_creneau) return null;
    
    // Find the creneau for this student
    const creneau = creneaux.find(c => c.id === student.id_creneau);
    if (!creneau) return null;
    
    // Find the group associated with this creneau
    const groupe = groupes.find(g => g.id_creneau === creneau.id);
    if (!groupe) return null;
    
    // Find the professor for this group
    const prof = professeurs.find(p => p.id === groupe.id_employe_prof);
    return prof;
  };

  const getRoomByStudent = (student) => {
    // First try to get room directly from student's inscription
    if (student.id_salle) {
      const directSalle = salles.find(s => s.id === student.id_salle);
      if (directSalle) {
        return directSalle;
      }
    }
    
    // Then check for any related affectation_salle
    const affectation = affectationsSalle.find(a => a.id_groupe === student.id_groupe);
    if (affectation) {
      const salle = salles.find(s => s.id === affectation.id_salle);
      return salle;
    }
    
    return null;
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

  const handleAssignClick = (type) => {
    if (selectedStudents.length === 0) {
      alert('Veuillez sélectionner au moins un étudiant');
      return;
    }
    setAssignmentType(type);
    setShowAssignModal(true);
  };

  const handleConfirmAssignment = async (selectedId) => {
    try {
      // In a real implementation, we would update the backend
      // For now, just update the local state
      const updates = {};
      
      selectedStudents.forEach(studentId => {
        const student = students.find(s => s.id === studentId);
        if (student) {
          if (assignmentType === 'prof') {
            // Update the creneau -> groupe -> prof relationship
            // This is a simplified approach - in reality you'd need more complex logic
            updates[studentId] = {
              ...assignments[studentId],
              prof: professeurs.find(p => p.id === parseInt(selectedId))
            };
          } else if (assignmentType === 'salle') {
            updates[studentId] = {
              ...assignments[studentId],
              salle: salles.find(s => s.id === parseInt(selectedId))
            };
          }
        }
      });
      
      setAssignments(prev => ({ ...prev, ...updates }));
      setShowAssignModal(false);
      setSelectedStudents([]);
    } catch (error) {
      console.error(`Erreur lors de l'attribution:`, error);
      alert(`Erreur lors de l'attribution: ${error.message}`);
    }
  };

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Attribution Professeur/Salle</h1>
      
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  {session.nom_session || `${session.mois} ${session.annee}`}
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
                  {type.nom_type_cours}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Niveau</label>
            <select
              value={selectedNiveau}
              onChange={(e) => setSelectedNiveau(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tous les niveaux</option>
              {niveaux.map(niveau => (
                <option key={niveau.id} value={niveau.libelle_niveau}>
                  {niveau.libelle_niveau}
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
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Téléphone
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Session
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Niveau
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Professeur assigné
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Salle assignée
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => {
                  const prof = getProfessorByStudent(student);
                  const salle = getRoomByStudent(student);
                  
                  return (
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
                          {student.nom} {student.prenom}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{student.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{student.tel}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {student.session?.nom_session || `${student.session?.mois} ${student.session?.annee}`}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{student.niveau_scolaire}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {prof ? `${prof.nom} ${prof.prenom}` : 'Non assigné'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {salle ? salle.nom_salle : 'Non assignée'}
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
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
            <div className="mt-2 flex space-x-2">
              <button 
                onClick={() => handleAssignClick('prof')}
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
              >
                Attribuer Professeur
              </button>
              <button 
                onClick={() => handleAssignClick('salle')}
                className="bg-green-600 text-white px-4 py-2 rounded-md text-sm"
              >
                Attribuer Salle
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Assignment Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">
              {assignmentType === 'prof' ? 'Attribuer un Professeur' : 'Attribuer une Salle'}
            </h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {assignmentType === 'prof' ? 'Sélectionner un Professeur' : 'Sélectionner une Salle'}
              </label>
              <select
                id="assignment-select"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Sélectionnez un élément</option>
                {(assignmentType === 'prof' ? professeurs : salles).map(item => (
                  <option key={item.id} value={item.id}>
                    {item.nom} {item.prenom || ''} {item.numero_salle ? `- Salle ${item.numero_salle}` : ''}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowAssignModal(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  const selectedId = document.getElementById('assignment-select').value;
                  if (!selectedId) {
                    alert('Veuillez sélectionner un élément');
                    return;
                  }
                  handleConfirmAssignment(selectedId);
                }}
                className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPedagogiqueAttribution;