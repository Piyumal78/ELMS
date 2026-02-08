import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { demoAPI } from '../../utils/demoapi';
import './DemoSessionManager.css';

const DemoSessionManager = () => {
    const [sessions, setSessions] = useState([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [newSession, setNewSession] = useState({
        topic: '',
        startTime: '',
        endTime: '',
        link: '',
        courseCode: '',
        lecturerName: '' // Assuming needed or optional
    });

    const demonstratorMenu = [
        { path: '/demonstrator/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/demonstrator/sessions', label: 'My Sessions', icon: '📅' },
        { path: '/demonstrator/reports', label: 'Report Reviews', icon: '📝' },
    ];

    useEffect(() => {
        // Fetch sessions for a default course or allow searching. 
        // For demo purposes, we might need an input for course code or fetch all relevant to the user.
        // Since the prompt asks to list sessions using `api.get('/sessions/courses/{courseCode}')`,
        // I will default to a placeholder course code or fetch it.
        // Let's assume a default course code for the prototype or fetch a specific one.
        fetchSessions('EE101');
    }, []);

    const fetchSessions = async (courseCode) => {
        setLoading(true);
        try {
            const response = await demoAPI.getSessionsByCourse(courseCode);
            setSessions(response.data);
        } catch (error) {
            console.error("Error fetching sessions:", error);
            // Handle 403 gracefully
            if (error.response && error.response.status === 403) {
                alert("You are not authorized to view sessions for this course.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCreateSession = async (e) => {
        e.preventDefault();
        try {
            // Need to format date/time properly for backend if needed.
            // backend expects SessionRequestDto.
            const payload = {
                ...newSession,
                // Add default or derived values
                date: new Date().toISOString().split('T')[0] // simplified for demo
            };
            await demoAPI.createSession(payload);
            setShowCreateForm(false);
            fetchSessions(newSession.courseCode || 'EE101'); // Refresh
            alert("Session Created Successfully!");
        } catch (error) {
            console.error("Create session failed", error);
            if (error.response && error.response.status === 403) {
                alert("Permission Denied: Cannot create session.");
            } else {
                alert("Failed to create session.");
            }
        }
    };

    const handleUploadManual = async (sessionId) => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.pdf,.doc,.docx';
        fileInput.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const formData = new FormData();
            formData.append('file', file);

            try {
                await demoAPI.uploadLabManual(sessionId, formData);
                alert("Lab Manual Uploaded Successfully!");
            } catch (error) {
                console.error("Upload failed", error);
                alert("Failed to upload manual.");
            }
        };
        fileInput.click();
    };

    return (
        <Layout menuItems={demonstratorMenu}>
            <div className="session-manager">
                <div className="sm-header">
                    <h2>Academic Session Management</h2>
                    <button
                        className="btn-create"
                        onClick={() => setShowCreateForm(!showCreateForm)}
                    >
                        {showCreateForm ? 'Cancel' : '+ Create New Session'}
                    </button>
                </div>

                {showCreateForm && (
                    <div className="create-session-form">
                        <h3>New Session Details</h3>
                        <form onSubmit={handleCreateSession}>
                            <div className="form-group">
                                <label>Course Code</label>
                                <input
                                    type="text"
                                    placeholder="e.g. EE101"
                                    value={newSession.courseCode}
                                    onChange={(e) => setNewSession({ ...newSession, courseCode: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Topic</label>
                                <input
                                    type="text"
                                    placeholder="Session Topic"
                                    value={newSession.topic}
                                    onChange={(e) => setNewSession({ ...newSession, topic: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Start Time</label>
                                    <input
                                        type="time"
                                        value={newSession.startTime}
                                        onChange={(e) => setNewSession({ ...newSession, startTime: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>End Time</label>
                                    <input
                                        type="time"
                                        value={newSession.endTime}
                                        onChange={(e) => setNewSession({ ...newSession, endTime: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <button type="submit" className="btn-submit">Create Session</button>
                        </form>
                    </div>
                )}

                <div className="sessions-list-container">
                    {loading ? <p>Loading sessions...</p> : (
                        <table className="sessions-table">
                            <thead>
                                <tr>
                                    <th>Course</th>
                                    <th>Topic</th>
                                    <th>Time</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sessions.length > 0 ? sessions.map(session => (
                                    <tr key={session.id}>
                                        <td>{session.courseCode || 'N/A'}</td>
                                        <td>{session.topic}</td>
                                        <td>{session.startTime} - {session.endTime}</td>
                                        <td>
                                            <button
                                                className="btn-action upload"
                                                onClick={() => handleUploadManual(session.id)}
                                            >
                                                ⬆ Upload Manual
                                            </button>
                                            {/* "View Components" placeholder */}
                                            <button className="btn-action components">
                                                ⚙ Components
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="4">No sessions found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default DemoSessionManager;
