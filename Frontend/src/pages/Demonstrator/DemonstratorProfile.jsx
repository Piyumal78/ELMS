import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './DemonstratorProfile.css';

const DemonstratorProfile = () => {
    const [user, setUser] = useState(null);

    const demonstratorMenu = [
        { path: '/demonstrator/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/demonstrator/sessions', label: 'My Sessions', icon: '📅' },
        { path: '/demonstrator/reports', label: 'Report Reviews', icon: '📝' },
        { path: '/demonstrator/profile', label: 'My Profile', icon: '👤' },
    ];

    useEffect(() => {
        // Fetch user from localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = '/signin';
    };

    if (!user) {
        return (
            <Layout menuItems={demonstratorMenu} title="🎓 Demonstrator">
                <div className="loading-message">Loading Profile...</div>
            </Layout>
        );
    }

    return (
        <Layout menuItems={demonstratorMenu}>
            <ToastContainer />
            <div className="profile-container">
                <h2 className="profile-title">My Profile</h2>

                <div className="profile-card">
                    <div className="profile-header">
                        <div className="profile-avatar">
                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div className="profile-info">
                            <h3>{user.name}</h3>
                            <p className="role">{user.role || 'Demonstrator'}</p>
                            <p className="email">{user.email}</p>
                        </div>
                    </div>

                    <div className="profile-details">
                        <h4 className="details-title">Account Details</h4>
                        <div className="details-grid">
                            <div className="detail-item">
                                <label>User ID</label>
                                <p>{user.id}</p>
                            </div>
                            <div className="detail-item">
                                <label>Username</label>
                                <p>{user.username || user.email}</p>
                            </div>
                            {/* Add more fields as needed */}
                        </div>
                    </div>

                    <div className="profile-actions">
                        <button onClick={handleLogout} className="logout-btn">
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default DemonstratorProfile;
