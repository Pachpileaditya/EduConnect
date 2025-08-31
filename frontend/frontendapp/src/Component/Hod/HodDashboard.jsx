import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Users, 
  Award, 
  TrendingUp, 
  BookOpen, 
  LogOut, 
  User,
  BarChart3,
  Activity,
  Target
} from 'lucide-react';

const HodDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Get HOD ID from localStorage
  const hodId = localStorage.getItem('userId');

  const COLORS = ['#00f2ff', '#bb86fc', '#03dac6', '#ff6b6b', '#4ecdc4'];

  useEffect(() => {
    if (!hodId) {
      navigate('/login');
      return;
    }
    fetchDashboardData();
  }, [hodId, navigate]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:8080/api/hod/dashboard-stats/${hodId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-cyan-400 text-lg">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg">Failed to load dashboard data</p>
        </div>
      </div>
    );
  }

  const { hodProfile, totalTeachers, totalPoints, averagePoints, topTeachers } = dashboardData;

  // Prepare chart data
  const performanceData = topTeachers.map(teacher => ({
    name: teacher.name,
    points: teacher.totalPoints,
    expertise: teacher.expertise
  }));

  const departmentStats = [
    { name: 'Total Teachers', value: totalTeachers, color: '#00f2ff' },
    { name: 'Total Points', value: totalPoints, color: '#bb86fc' },
    { name: 'Avg Points', value: averagePoints, color: '#03dac6' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">HOD Dashboard</h1>
                <p className="text-gray-300">{hodProfile?.department} Department</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-white font-medium">{hodProfile?.name}</p>
                <p className="text-gray-400 text-sm">{hodProfile?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-black/10 backdrop-blur-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'teachers', label: 'Teachers', icon: Users },
              { id: 'performance', label: 'Performance', icon: Activity },
              { id: 'analytics', label: 'Analytics', icon: Target }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-cyan-400 text-cyan-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 p-6 rounded-2xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-cyan-100 text-sm font-medium">Total Teachers</p>
                    <p className="text-white text-3xl font-bold">{totalTeachers}</p>
                  </div>
                  <Users className="w-8 h-8 text-cyan-100" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-2xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Total Points</p>
                    <p className="text-white text-3xl font-bold">{totalPoints}</p>
                  </div>
                  <Award className="w-8 h-8 text-purple-100" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-6 rounded-2xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-teal-100 text-sm font-medium">Average Points</p>
                    <p className="text-white text-3xl font-bold">{averagePoints}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-teal-100" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-pink-500 to-pink-600 p-6 rounded-2xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-pink-100 text-sm font-medium">Department</p>
                    <p className="text-white text-lg font-bold">{hodProfile?.department}</p>
                  </div>
                  <BookOpen className="w-8 h-8 text-pink-100" />
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Performance Chart */}
              <div className="bg-black/20 backdrop-blur-lg rounded-2xl p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-6">Top Performing Teachers</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="points" fill="#00f2ff" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Department Stats */}
              <div className="bg-black/20 backdrop-blur-lg rounded-2xl p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-6">Department Statistics</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={departmentStats}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {departmentStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'teachers' && (
          <div className="bg-black/20 backdrop-blur-lg rounded-2xl p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-6">All Teachers</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-gray-300 font-medium py-3 px-4">Name</th>
                    <th className="text-gray-300 font-medium py-3 px-4">Email</th>
                    <th className="text-gray-300 font-medium py-3 px-4">Expertise</th>
                    <th className="text-gray-300 font-medium py-3 px-4">Points</th>
                    <th className="text-gray-300 font-medium py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {topTeachers.map((teacher, index) => (
                    <tr key={teacher.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                      <td className="text-white py-3 px-4">{teacher.name}</td>
                      <td className="text-gray-300 py-3 px-4">{teacher.email}</td>
                      <td className="text-gray-300 py-3 px-4">{teacher.expertise}</td>
                      <td className="text-cyan-400 font-bold py-3 px-4">{teacher.totalPoints}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          teacher.totalPoints > 50 
                            ? 'bg-green-500/20 text-green-400' 
                            : teacher.totalPoints > 20 
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {teacher.totalPoints > 50 ? 'Excellent' : teacher.totalPoints > 20 ? 'Good' : 'Needs Improvement'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="space-y-6">
            <div className="bg-black/20 backdrop-blur-lg rounded-2xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-6">Performance Analytics</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="points" fill="#00f2ff" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-black/20 backdrop-blur-lg rounded-2xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">Department Insights</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Total Teachers</span>
                  <span className="text-white font-bold">{totalTeachers}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Average Performance</span>
                  <span className="text-cyan-400 font-bold">{averagePoints} pts</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Top Performer</span>
                  <span className="text-purple-400 font-bold">
                    {topTeachers[0]?.name || 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-black/20 backdrop-blur-lg rounded-2xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-2 px-4 rounded-lg transition-colors">
                  Generate Report
                </button>
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors">
                  Send Notifications
                </button>
                <button className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-lg transition-colors">
                  View Analytics
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default HodDashboard;



