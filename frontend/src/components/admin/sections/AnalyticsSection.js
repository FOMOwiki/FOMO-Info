import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../ui/Card';
import Button from '../ui/Button';

const API = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

const AnalyticsSection = ({ showNotification }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState(30);

  const fetchStats = async (days) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/api/analytics/stats?period=${days}`);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      showNotification('Failed to load analytics data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { // eslint-disable-line react-hooks/exhaustive-deps
    fetchStats(period);
  }, [period]);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const handleClearData = async () => {
    if (window.confirm('Are you sure you want to clear all analytics data?')) {
      try {
        await axios.delete(`${API}/api/analytics/clear`);
        fetchStats(period);
        showNotification('Analytics data cleared successfully');
      } catch (error) {
        showNotification('Failed to clear analytics data', 'error');
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block w-12 h-12 border-4 border-gray-200 border-t-emerald-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-500">Loading analytics...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12 text-gray-500">
        No analytics data available
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Period Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">📊 Site Analytics</h2>
        <div className="flex space-x-2">
          {[7, 30, 90].map(days => (
            <button
              key={days}
              onClick={() => setPeriod(days)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                period === days
                  ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-500'
                  : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-gray-300'
              }`}
            >
              {days} days
            </button>
          ))}
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon="👥"
          label="Page Views"
          value={stats.page_views}
          subtext={`${stats.unique_sessions} unique sessions`}
          color="emerald"
        />
        <StatCard
          icon="🖱️"
          label="Button Clicks"
          value={stats.button_clicks}
          subtext="Total interactions"
          color="purple"
        />
        <StatCard
          icon="📈"
          label="Conversion Rate"
          value={`${stats.conversion_rate}%`}
          subtext={`${stats.conversions} registrations`}
          color="green"
        />
        <StatCard
          icon="⏱️"
          label="Avg. Session Time"
          value={formatDuration(stats.avg_session_duration)}
          subtext="Per session"
          color="amber"
        />
      </div>

      {/* Visitors & Devices Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* New vs Returning Visitors */}
        <Card title="New vs Returning Visitors">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-center">
              <div className="text-gray-500 text-sm mb-2">New Visitors</div>
              <div className="text-emerald-600 text-3xl font-bold">{stats.new_visitors}</div>
              <div className="text-emerald-500 text-sm">{stats.new_visitors_percent}%</div>
            </div>
            <div className="bg-pink-50 border border-pink-200 rounded-lg p-4 text-center">
              <div className="text-gray-500 text-sm mb-2">Returning Visitors</div>
              <div className="text-pink-600 text-3xl font-bold">{stats.returning_visitors}</div>
              <div className="text-pink-500 text-sm">{stats.returning_visitors_percent}%</div>
            </div>
          </div>
        </Card>

        {/* Device Types */}
        <Card title="Device Types">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4 text-center">
              <div className="text-gray-500 text-sm mb-2">🖥️ Desktop</div>
              <div className="text-cyan-600 text-3xl font-bold">{stats.desktop_visitors}</div>
              <div className="text-cyan-500 text-sm">{stats.desktop_percent}%</div>
            </div>
            <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4 text-center">
              <div className="text-gray-500 text-sm mb-2">📱 Mobile</div>
              <div className="text-cyan-600 text-3xl font-bold">{stats.mobile_visitors}</div>
              <div className="text-cyan-500 text-sm">{stats.mobile_percent}%</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Geography Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Countries */}
        <Card title="🌍 Top Countries">
          <div className="space-y-3">
            {stats.top_countries?.slice(0, 5).map((country, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <span className="text-gray-700">{country.name}</span>
                <span className="text-emerald-600 font-bold">{country.count}</span>
              </div>
            ))}
            {(!stats.top_countries || stats.top_countries.length === 0) && (
              <p className="text-gray-400 text-center py-4">No country data available</p>
            )}
          </div>
        </Card>

        {/* Top Cities */}
        <Card title="🏙️ Top Cities">
          <div className="space-y-3">
            {stats.top_cities?.slice(0, 5).map((city, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <span className="text-gray-700">{city.name}</span>
                <span className="text-pink-600 font-bold">{city.count}</span>
              </div>
            ))}
            {(!stats.top_cities || stats.top_cities.length === 0) && (
              <p className="text-gray-400 text-center py-4">No city data available</p>
            )}
          </div>
        </Card>
      </div>

      {/* Traffic Sources */}
      <Card title="Traffic Sources">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">🔗</div>
            <div className="text-gray-500 text-sm mb-1">Direct</div>
            <div className="text-emerald-600 text-2xl font-bold">{stats.direct_traffic}</div>
            <div className="text-emerald-500 text-sm">{stats.direct_percent}% of traffic</div>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">🌐</div>
            <div className="text-gray-500 text-sm mb-1">Referral</div>
            <div className="text-amber-600 text-2xl font-bold">{stats.referral_traffic}</div>
            <div className="text-amber-500 text-sm">{stats.referral_percent}% of traffic</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">🔍</div>
            <div className="text-gray-500 text-sm mb-1">Search</div>
            <div className="text-green-600 text-2xl font-bold">{stats.search_traffic}</div>
            <div className="text-green-500 text-sm">{stats.search_percent}% of traffic</div>
          </div>
        </div>

        {/* Detailed Sources */}
        {stats.detailed_sources && stats.detailed_sources.length > 0 && (
          <div>
            <h4 className="text-amber-600 font-semibold mb-3">📊 Detailed Sources</h4>
            <div className="space-y-3">
              {stats.detailed_sources.map((source, idx) => (
                <div key={idx} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700 font-medium">{source.source}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-amber-600 font-bold">{source.count}</span>
                      <span className="text-amber-500 text-sm">({source.percent}%)</span>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-300"
                      style={{ width: `${source.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Clear Data Button */}
      <div className="text-center pt-4 border-t border-gray-200">
        <Button variant="danger" onClick={handleClearData}>
          🗑️ Clear All Analytics Data
        </Button>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ icon, label, value, subtext, color }) => {
  const colorClasses = {
    emerald: 'border-emerald-500 text-emerald-600',
    purple: 'border-purple-500 text-purple-600',
    green: 'border-green-500 text-green-600',
    amber: 'border-amber-500 text-amber-600',
  };

  return (
    <div className={`bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-5 border-2 ${colorClasses[color].split(' ')[0]}`}>
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-gray-400 text-sm mb-2">{label}</div>
      <div className={`text-3xl font-bold mb-1 ${colorClasses[color].split(' ')[1]}`}>{value}</div>
      <div className="text-gray-500 text-sm">{subtext}</div>
    </div>
  );
};

export default AnalyticsSection;
