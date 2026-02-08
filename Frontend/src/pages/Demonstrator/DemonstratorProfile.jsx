import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
                <div className="p-6">Loading Profile...</div>
            </Layout>
        );
    }

    return (
        <Layout menuItems={demonstratorMenu}>
            <ToastContainer />
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">My Profile</h2>

                <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl">
                    <div className="flex items-center space-x-6 mb-8">
                        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-4xl font-bold">
                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                            <h3 className="text-2xl font-semibold text-gray-800">{user.name}</h3>
                            <p className="text-gray-500">{user.role || 'Demonstrator'}</p>
                            <p className="text-gray-500 text-sm">{user.email}</p>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                        <h4 className="text-lg font-medium text-gray-700 mb-4">Account Details</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-500">User ID</label>
                                <p className="mt-1 text-gray-900">{user.id}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500">Username</label>
                                <p className="mt-1 text-gray-900">{user.username || user.email}</p>
                            </div>
                            {/* Add more fields as needed */}
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded transition"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default DemonstratorProfile;
