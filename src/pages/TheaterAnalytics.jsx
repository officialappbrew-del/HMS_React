import { useSelector } from 'react-redux';
import { useState } from 'react';

const TheaterAnalytics = () => {
  const {
    utilizationAnalytics,
    surgicalSchedules,
    intraOpRecords,
    postOpCare
  } = useSelector(state => state.theater);

  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800';
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderUtilizationOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium">Total Cases</p>
            <p className="text-3xl font-bold text-blue-600">{utilizationAnalytics.monthlyStats[3]?.totalCases || 0}</p>
            <p className="text-sm text-gray-600">This month</p>
          </div>
          <div className="p-3 bg-blue-100 rounded-full">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium">Utilization Rate</p>
            <p className="text-3xl font-bold text-green-600">{utilizationAnalytics.monthlyStats[3]?.utilizationRate || 0}%</p>
            <p className="text-sm text-gray-600">Average</p>
          </div>
          <div className="p-3 bg-green-100 rounded-full">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium">Avg Turnaround</p>
            <p className="text-3xl font-bold text-orange-600">{utilizationAnalytics.monthlyStats[3]?.avgTurnaround || 0}min</p>
            <p className="text-sm text-gray-600">Between cases</p>
          </div>
          <div className="p-3 bg-orange-100 rounded-full">
            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium">Monthly Cost</p>
            <p className="text-3xl font-bold text-red-600">₦{(utilizationAnalytics.costAnalysis?.totalMonthlyCost / 1000000 || 0).toFixed(1)}M</p>
            <p className="text-sm text-gray-600">Total expenses</p>
          </div>
          <div className="p-3 bg-red-100 rounded-full">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMonthlyTrends = () => (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h3 className="text-xl font-semibold mb-6">Monthly Trends</h3>
      <div className="space-y-4">
        {utilizationAnalytics.monthlyStats.map((month, index) => (
          <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="text-sm font-medium text-gray-900 w-20">
                {month.month}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <div className="text-xs text-gray-600 mb-1">Cases: {month.totalCases}</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(month.totalCases / Math.max(...utilizationAnalytics.monthlyStats.map(m => m.totalCases))) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-gray-600 mb-1">Utilization: {month.utilizationRate}%</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${month.utilizationRate}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Turnaround</div>
              <div className="text-lg font-semibold text-gray-900">{month.avgTurnaround}min</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderRoomUtilization = () => (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h3 className="text-xl font-semibold mb-6">Operating Room Utilization</h3>
      <div className="space-y-4">
        {utilizationAnalytics.roomUtilization.map((room, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-lg font-medium text-gray-900">Room {room.roomId.replace('OR', '')}</h4>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{room.utilizationRate}%</div>
                <div className="text-sm text-gray-600">Utilization</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-3">
              <div className="text-center">
                <div className="text-lg font-semibold text-green-600">{room.totalCases}</div>
                <div className="text-sm text-gray-600">Total Cases</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-orange-600">{room.downtime}</div>
                <div className="text-sm text-gray-600">Downtime (hrs)</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-red-600">
                  {((room.downtime / (room.downtime + (room.totalCases * 2))) * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">Downtime %</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full"
                style={{ width: `${room.utilizationRate}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCancellationAnalysis = () => (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h3 className="text-xl font-semibold mb-6">Cancellation Analysis</h3>
      <div className="space-y-4">
        {utilizationAnalytics.cancellationReasons.map((reason, index) => (
          <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${
                reason.reason === 'Patient not fit' ? 'bg-red-500' :
                reason.reason === 'Equipment failure' ? 'bg-orange-500' :
                reason.reason === 'Staff unavailability' ? 'bg-yellow-500' :
                reason.reason === 'Emergency case' ? 'bg-purple-500' :
                'bg-gray-500'
              }`}></div>
              <span className="text-sm font-medium text-gray-900">{reason.reason}</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">{reason.count} cases</span>
              <div className="w-20 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-red-600 h-2 rounded-full"
                  style={{ width: `${(reason.count / Math.max(...utilizationAnalytics.cancellationReasons.map(r => r.count))) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCostAnalysis = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-6">Cost Breakdown</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Average Cost per Case</span>
            <span className="text-lg font-semibold text-gray-900">
              ₦{utilizationAnalytics.costAnalysis?.averageCostPerCase?.toLocaleString() || 0}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Equipment Downtime Cost</span>
            <span className="text-lg font-semibold text-red-600">
              ₦{utilizationAnalytics.costAnalysis?.equipmentDowntimeCost?.toLocaleString() || 0}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Staffing Cost per Hour</span>
            <span className="text-lg font-semibold text-blue-600">
              ₦{utilizationAnalytics.costAnalysis?.staffingCostPerHour?.toLocaleString() || 0}
            </span>
          </div>
          <div className="flex justify-between items-center border-t pt-2">
            <span className="text-sm font-medium text-gray-900">Total Monthly Cost</span>
            <span className="text-xl font-bold text-gray-900">
              ₦{(utilizationAnalytics.costAnalysis?.totalMonthlyCost / 1000000 || 0).toFixed(1)}M
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-6">Performance Metrics</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">On-Time Starts</span>
            <span className="text-lg font-semibold text-green-600">87%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">First Case On-Time</span>
            <span className="text-lg font-semibold text-green-600">92%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Patient Satisfaction</span>
            <span className="text-lg font-semibold text-blue-600">4.6/5</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Complication Rate</span>
            <span className="text-lg font-semibold text-orange-600">2.1%</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRecentActivity = () => {
    const recentSchedules = surgicalSchedules
      .filter(schedule => new Date(schedule.date) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);

    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-6">Recent Surgical Activity</h3>
        <div className="space-y-4">
          {recentSchedules.map((schedule) => (
            <div key={schedule.scheduleId} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  schedule.status === 'Completed' ? 'bg-green-500' :
                  schedule.status === 'In Progress' ? 'bg-yellow-500' :
                  schedule.status === 'Scheduled' ? 'bg-blue-500' :
                  'bg-red-500'
                }`}></div>
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {schedule.patientName}
                  </div>
                  <div className="text-sm text-gray-600">
                    {schedule.procedure} • {schedule.date}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(schedule.status)}`}>
                  {schedule.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="theater-analytics p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-2">Operating Theater Analytics</h2>
        <p className="text-gray-600">Utilization rates, performance metrics, and cost analysis</p>
      </div>

      {/* Period Selector */}
      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">Time Period:</span>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
        </div>
      </div>

      {/* Overview Cards */}
      {renderUtilizationOverview()}

      {/* Charts and Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {renderMonthlyTrends()}
        {renderRoomUtilization()}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {renderCancellationAnalysis()}
        {renderCostAnalysis()}
      </div>

      {/* Recent Activity */}
      {renderRecentActivity()}
    </div>
  );
};

export default TheaterAnalytics;