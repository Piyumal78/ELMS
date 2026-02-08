import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import { demoAPI } from '../../utils/demoapi';
import './DemonstratorDashboard.css';

const DemonstratorDashboard = () => {
    const [stats, setStats] = useState({
        activeSessions: 0,
        pendingReports: 0,
        myCourses: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Custom menu items for Demonstrator
    const demonstratorMenu = [
        { path: '/demonstrator/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/demonstrator/sessions', label: 'My Sessions', icon: '📅' },
        { path: '/demonstrator/reports', label: 'Report Reviews', icon: '📝' },
        // Added Profile as a placeholder for completeness, though not requested
        { path: '/demonstrator/profile', label: 'My Profile', icon: '👤' }
    ];

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                // Get user object from localStorage and extract ID
                const userStr = localStorage.getItem('user');

                if (!userStr) {
                    setError('User not found. Please login again.');
                    setLoading(false);
                    return;
                }

                const user = JSON.parse(userStr);
                const userId = user.id;

                if (!userId) {
                    setError('User ID not found. Please login again.');
                    setLoading(false);
                    return;
                }

                const response = await demoAPI.getDemonstratorStats(userId);
                setStats(response.data);
                setError(null);
            } catch (err) {
                console.error('Error fetching demonstrator stats:', err);
                setError('Failed to load statistics. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <Layout menuItems={demonstratorMenu} title="🎓 Demonstrator">
            <div className="demo-dashboard">
                <header className="demo-header">
                    <h1>🎓 Demonstrator</h1>
                    <p>Manage your lab sessions and student assessments efficiently.</p>
                </header>

                {error && (
                    <div style={{
                        padding: '1rem',
                        marginBottom: '1rem',
                        backgroundColor: '#fee',
                        color: '#c33',
                        borderRadius: '8px',
                        border: '1px solid #fcc'
                    }}>
                        {error}
                    </div>
                )}

                <div className="demo-stats-grid">
                    <div className="demo-stat-card card-blue">
                        <h3>Active Sessions</h3>
                        <div className="stat-value">
                            {loading ? '...' : stats.activeSessions}
                        </div>
                        <span className="stat-label">Ongoing this semester</span>
                    </div>
                    <div className="demo-stat-card card-yellow">
                        <h3>Pending Reports</h3>
                        <div className="stat-value">
                            {loading ? '...' : stats.pendingReports}
                        </div>
                        <span className="stat-label">Need review</span>
                    </div>
                    <div className="demo-stat-card card-green">
                        <h3>My Courses</h3>
                        <div className="stat-value">
                            {loading ? '...' : stats.myCourses}
                        </div>
                        <span className="stat-label">Assigned</span>
                    </div>
                </div>

                <div className="demo-actions-section">
                    <h2>Quick Actions</h2>
                    <div className="demo-action-buttons">
                        <Link to="/demonstrator/sessions" className="demo-btn primary">
                            📅 Manage Sessions
                        </Link>
                        <Link to="/demonstrator/reports" className="demo-btn secondary">
                            📝 Review Reports
                        </Link>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default DemonstratorDashboard;
