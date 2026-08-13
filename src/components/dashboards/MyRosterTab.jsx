import { useState, useEffect } from 'react';
import { apiRequest } from '../../utils/api';
import { Calendar, Clock, ChevronRight, Loader2, AlertCircle } from 'lucide-react';

const MyRosterTab = () => {
  const [rosters, setRosters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadMyRosters = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest('/api/v1/ward-rounds/duty-rosters/my-rosters/');
      const results = Array.isArray(response?.results) ? response.results : (Array.isArray(response) ? response : []);
      setRosters(results);
    } catch (err) {
      setError(err.message || 'Unable to load your roster.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMyRosters();
  }, []);

  const dutyTypeColor = (dutyType) => {
    switch (dutyType) {
      case 'Night Duty': return 'bg-purple-100 text-purple-800';
      case 'Emergency': return 'bg-red-100 text-red-800';
      case 'Weekend': return 'bg-orange-100 text-orange-800';
      case 'Clinic': return 'bg-teal-100 text-teal-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  if (loading) {
    return (
      <div className="bg-white border border-[#E8E3DC] rounded-lg p-6 sm:p-8">
        <div className="flex items-center justify-center gap-2 text-sm text-[#5A5A5A]">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading your roster...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-[#E8E3DC] rounded-lg p-6 sm:p-8">
        <div className="flex items-center gap-2 text-sm text-red-600">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      </div>
    );
  }

  const flatAssignments = rosters.flatMap(roster =>
    (roster.assignments || []).map(a => ({
      ...a,
      rosterMonth: roster.month,
      rosterYear: roster.year,
      rosterDepartment: roster.department,
      rosterStatus: roster.status,
    }))
  ).sort((a, b) => {
    const da = a.date ? new Date(a.date) : new Date(0);
    const db = b.date ? new Date(b.date) : new Date(0);
    return da - db;
  });

  return (
    <div className="bg-white border border-[#E8E3DC] rounded-lg overflow-hidden">
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-[#E8E3DC] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-[#008751]" />
          <h3 className="text-sm sm:text-base font-semibold text-[#1A1A1A]">My Duty Roster</h3>
        </div>
        <a
          href="/duty-roster"
          className="text-xs sm:text-sm text-[#008751] hover:text-[#006B40] font-medium flex items-center gap-1"
        >
          View full roster <ChevronRight className="w-3.5 h-3.5" />
        </a>
      </div>
      {flatAssignments.length === 0 ? (
        <div className="px-4 sm:px-6 py-8 text-center">
          <Calendar className="w-10 h-10 text-[#D8D4CD] mx-auto mb-2" />
          <p className="text-sm text-[#5A5A5A]">No roster assignments yet</p>
          <p className="text-xs text-[#B0A89E] mt-1">You will see your duty assignments here once a roster is published.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead className="bg-[#F7F5F2] border-b border-[#E8E3DC]">
              <tr>
                <th className="px-4 py-2.5 text-left text-[10px] sm:text-xs font-medium text-[#5A5A5A] uppercase tracking-wider">Date</th>
                <th className="px-4 py-2.5 text-left text-[10px] sm:text-xs font-medium text-[#5A5A5A] uppercase tracking-wider">Department</th>
                <th className="px-4 py-2.5 text-left text-[10px] sm:text-xs font-medium text-[#5A5A5A] uppercase tracking-wider">Duty Type</th>
                <th className="px-4 py-2.5 text-left text-[10px] sm:text-xs font-medium text-[#5A5A5A] uppercase tracking-wider">Time</th>
                <th className="px-4 py-2.5 text-left text-[10px] sm:text-xs font-medium text-[#5A5A5A] uppercase tracking-wider">Status</th>
                <th className="px-4 py-2.5 text-left text-[10px] sm:text-xs font-medium text-[#5A5A5A] uppercase tracking-wider">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E3DC]">
              {flatAssignments.map((assignment, idx) => (
                <tr key={`${assignment.rosterMonth}-${assignment.date}-${assignment.dutyType}-${idx}`} className="hover:bg-[#F7F5F2]">
                  <td className="px-4 py-3 text-sm text-[#1A1A1A]">
                    {assignment.date ? new Date(assignment.date).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-sm text-[#5A5A5A]">{assignment.rosterDepartment || 'General'}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium ${dutyTypeColor(assignment.dutyType)}`}>
                      {assignment.dutyType || 'Duty'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#5A5A5A]">
                    {assignment.startTime || '--:--'} – {assignment.endTime || '--:--'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium ${
                      assignment.rosterStatus === 'Published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {assignment.rosterStatus || 'Draft'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#5A5A5A] truncate max-w-[160px]">{assignment.notes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyRosterTab;
