import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import './DemonstratorDashboard.css';

const DemonstratorDashboard = () => {
    // Custom menu items for Demonstrator
    const demonstratorMenu = [
        { path: '/demonstrator/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/demonstrator/sessions', label: 'My Sessions', icon: '📅' },
        { path: '/demonstrator/reports', label: 'Report Reviews', icon: '📝' },
        // Added Profile as a placeholder for completeness, though not requested
        { path: '/demonstrator/profile', label: 'My Profile', icon: '👤' }
    ];

    return (
        <Layout menuItems={demonstratorMenu}>
            <div className="demo-dashboard">
                <header className="demo-header">
                    <h1>🎓 Welcome, Demonstrator</h1>
                    <p>Manage your lab sessions and student assessments efficiently.</p>
                </header>

                <div className="demo-stats-grid">
                    <div className="demo-stat-card card-blue">
                        <h3>Active Sessions</h3>
                        <div className="stat-value">3</div>
                        <span className="stat-label">Ongoing this semester</span>
                    </div>
                    <div className="demo-stat-card card-yellow">
                        <h3>Pending Reports</h3>
                        <div className="stat-value">5</div>
                        <span className="stat-label">Need review</span>
                    </div>
                    <div className="demo-stat-card card-green">
                        <h3>My Courses</h3>
                        <div className="stat-value">2</div>
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
