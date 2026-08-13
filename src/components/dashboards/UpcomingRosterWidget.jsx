import { useState, useEffect } from 'react';
import { apiRequest } from '../../utils/api';
import { Calendar, Clock, ChevronRight, Loader2 } from 'lucide-react';

const UpcomingRosterWidget = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadMyRosters = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest('/api/v1/ward-rounds/duty-rosters/my-rosters/');
      const results = Array.isArray(response?.results) ? response.results : (Array.isArray(response) ? response : []);
      const today = new Date().toISOString().split('T')[0];
      const upcoming = results
        .flatMap(roster => (roster.assignments || []).map(a => ({ ...a, rosterMonth: roster.month, rosterYear: roster.year, rosterDepartment: roster.department, rosterStatus: roster.status })))
        .filter(a => a.date && a.date >= today)
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 5);
      setAssignments(upcoming);
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
      <div className="bg-white border border-[#E8E3DC] rounded-lg p-4 sm:p-6">
        <div className="flex items-center justify-center gap-2 text-sm text-[#5A5A5A]">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading your roster...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-[#E8E3DC] rounded-lg p-4 sm:p-6">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E8E3DC] rounded-lg overflow-hidden">
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-[#E8E3DC] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-[#008751]" />
          <h3 className="text-sm sm:text-base font-semibold text-[#1A1A1A]">My Upcoming Duties</h3>
        </div>
        <a
          href="/duty-roster"
          className="text-xs sm:text-sm text-[#008751] hover:text-[#006B40] font-medium flex items-center gap-1"
        >
          View all <ChevronRight className="w-3.5 h-3.5" />
        </a>
      </div>
      <div className="divide-y divide-[#E8E3DC]">
        {assignments.length === 0 ? (
          <div className="px-4 sm:px-6 py-6 text-center">
            <Calendar className="w-8 h-8 text-[#D8D4CD] mx-auto mb-2" />
            <p className="text-sm text-[#5A5A5A]">No upcoming duties assigned</p>
          </div>
        ) : (
          assignments.map((assignment, idx) => (
            <div key={`${assignment.rosterMonth}-${assignment.date}-${assignment.dutyType}-${idx}`} className="px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-[#F7F5F2] border border-[#E8E3DC] flex flex-col items-center justify-center flex-shrink-0">
                  <span className="text-[10px] sm:text-xs font-medium text-[#5A5A5A] uppercase">
                    {assignment.date ? new Date(assignment.date).toLocaleDateString('en-US', { month: 'short' }) : ''}
                  </span>
                  <span className="text-sm sm:text-base font-bold text-[#1A1A1A] leading-none">
                    {assignment.date ? new Date(assignment.date).getDate() : ''}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#1A1A1A] truncate">
                    {assignment.dutyType || 'Duty'}
                  </p>
                  <p className="text-xs text-[#5A5A5A] truncate">
                    {assignment.rosterDepartment || 'General'} • {assignment.startTime || '--:--'} – {assignment.endTime || '--:--'}
                  </p>
                </div>
              </div>
              <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium flex-shrink-0 ${dutyTypeColor(assignment.dutyType)}`}>
                {assignment.dutyType || 'Duty'}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UpcomingRosterWidget;
