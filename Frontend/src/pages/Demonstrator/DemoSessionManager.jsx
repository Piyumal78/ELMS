import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { demoAPI } from '../../utils/demoapi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DemoSessionManager = () => {
    // Form State
    const [formData, setFormData] = useState({
        date: '',
        startTime: '',
        endTime: '',
        title: '',
        experimentNumber: '',
        courseCode: ''
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);

    // List State
    const [sessions, setSessions] = useState([]);

    const demonstratorMenu = [
        { path: '/demonstrator/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/demonstrator/sessions', label: 'My Sessions', icon: '📅' },
        { path: '/demonstrator/reports', label: 'Report Reviews', icon: '📝' },
    ];

    useEffect(() => {
        // Fetch sessions on load
        fetchSessions();
    }, [formData.courseCode]); // Re-fetch when course code changes

    const fetchSessions = async () => {
        // Only fetch if a course code is provided
        if (!formData.courseCode || formData.courseCode.trim() === '') {
            setSessions([]);
            return; // Don't make API call without a valid course code
        }

        try {
            const response = await demoAPI.getSessionsByCourse(formData.courseCode);
            if (response.data) setSessions(response.data);
            else setSessions([]);
        } catch (error) {
            console.error("Error fetching sessions", error);
            setSessions([]);
            // Show toast only for non-404 errors
            if (error.response?.status === 404 || error.response?.status === 400) {
                toast.info(`No course found with code: ${formData.courseCode}`);
            } else {
                toast.error("Failed to fetch sessions. Please try again.");
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Get userId from localStorage
            const userStr = localStorage.getItem('user');
            if (!userStr) {
                toast.error("User not found. Please log in.");
                setLoading(false);
                return;
            }

            const user = JSON.parse(userStr);
            const userId = user?.id;

            if (!userId) {
                toast.error("User ID not found. Please log in.");
                setLoading(false);
                return;
            }

            // Client-side validation
            if (!formData.courseCode || formData.courseCode.trim() === '') {
                toast.error("Course code is required");
                setLoading(false);
                return;
            }

            if (!formData.date || !formData.startTime || !formData.endTime) {
                toast.error("Date and time fields are required");
                setLoading(false);
                return;
            }

            // Step 1: Create Session
            const sessionPayload = {
                date: formData.date,
                startTime: formData.startTime,
                endTime: formData.endTime,
                title: formData.title,
                experimentNumber: parseInt(formData.experimentNumber),
                courseCode: formData.courseCode,
                userId: userId
            };

            const sessionResponse = await demoAPI.createSession(sessionPayload);
            const sessionId = sessionResponse.data.sessionId || sessionResponse.data.id;

            // Step 2: Upload Manual (if selected)
            if (selectedFile) {
                try {
                    const manualFormData = new FormData();
                    manualFormData.append('file', selectedFile);
                    await demoAPI.uploadLabManual(sessionId, manualFormData);
                    toast.success("Session Created & Manual Uploaded!");
                } catch (uploadError) {
                    console.error("Manual upload failed", uploadError);
                    toast.warning("Session created but manual upload failed. You can upload it later.");
                }
            } else {
                toast.success("Session Created Successfully!");
            }

            // Reset Form
            setFormData({
                date: '',
                startTime: '',
                endTime: '',
                title: '',
                experimentNumber: '',
                courseCode: ''
            });
            setSelectedFile(null);

            // Refresh List
            fetchSessions();

        } catch (error) {
            console.error("Operation failed", error);

            // Display specific error messages from backend
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else if (error.response?.status === 400) {
                toast.error("Invalid data. Please check all fields and try again.");
            } else if (error.response?.status === 404) {
                toast.error("Course not found. Please check the course code.");
            } else if (error.response?.status === 409) {
                toast.error("A session already exists at this time or with this experiment number.");
            } else {
                toast.error("Failed to create session. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout menuItems={demonstratorMenu} title="🎓 Demonstrator">
            <ToastContainer />
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Session Manager</h2>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left Side: Create Session Form */}
                    <div className="w-full lg:w-1/3 bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold mb-4 text-blue-600">Create New Session</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Title</label>
                                <input
                                    type="text" name="title" required
                                    value={formData.title} onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded p-2"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Date</label>
                                    <input
                                        type="date" name="date" required
                                        value={formData.date} onChange={handleInputChange}
                                        className="mt-1 block w-full border border-gray-300 rounded p-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Course Code</label>
                                    <input
                                        type="text" name="courseCode" required
                                        value={formData.courseCode} onChange={handleInputChange}
                                        placeholder="e.g. EE101"
                                        className="mt-1 block w-full border border-gray-300 rounded p-2"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Start Time</label>
                                    <input
                                        type="time" name="startTime" required
                                        value={formData.startTime} onChange={handleInputChange}
                                        className="mt-1 block w-full border border-gray-300 rounded p-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">End Time</label>
                                    <input
                                        type="time" name="endTime" required
                                        value={formData.endTime} onChange={handleInputChange}
                                        className="mt-1 block w-full border border-gray-300 rounded p-2"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Experiment Number</label>
                                <input
                                    type="number" name="experimentNumber" required
                                    value={formData.experimentNumber} onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded p-2"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Lab Manual (PDF)</label>
                                <input
                                    type="file" accept=".pdf"
                                    onChange={handleFileChange}
                                    className="mt-1 block w-full border border-gray-300 rounded p-2"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-2 px-4 text-white font-bold rounded hover:bg-blue-700 transition ${loading ? 'bg-blue-300' : 'bg-blue-600'}`}
                            >
                                {loading ? 'Processing...' : 'Create Session'}
                            </button>
                        </form>
                    </div>

                    {/* Right Side: Session List */}
                    <div className="w-full lg:w-2/3 bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold mb-4 text-gray-700">Created Sessions</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full leading-normal">
                                <thead>
                                    <tr>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Title
                                        </th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Time
                                        </th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Exp No
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sessions.length > 0 ? sessions.map(session => (
                                        <tr key={session.id}>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <p className="text-gray-900 whitespace-no-wrap">{session.title || session.name}</p>
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <p className="text-gray-900 whitespace-no-wrap">{session.date}</p>
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <p className="text-gray-900 whitespace-no-wrap">{session.startTime} - {session.endTime}</p>
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <p className="text-gray-900 whitespace-no-wrap">{session.experimentNumber}</p>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="4" className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                                                No sessions found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default DemoSessionManager;
