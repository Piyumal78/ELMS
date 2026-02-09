import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { demoAPI } from '../../utils/demoapi';
import './DemoReportReviews.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DemoReportReviews = () => {
    // START: Add session selection logic (assuming we need to select a session first to see submissions)
    // For now, I will assume we might need a dropdown or just list all pending reports if the API supports it.
    // BUT the backend endpoint is /submissions/session/{sessionId}. 
    // So we MUST select a session first.
    // Let's add a Session Selector.

    const [sessions, setSessions] = useState([]);
    const [selectedSessionId, setSelectedSessionId] = useState('');

    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(false);

    // Modal state
    const [selectedReport, setSelectedReport] = useState(null);
    const [reviewComment, setReviewComment] = useState('');
    const [reviewGrade, setReviewGrade] = useState('A');
    const [submitting, setSubmitting] = useState(false);

    const demonstratorMenu = [
        { path: '/demonstrator/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/demonstrator/sessions', label: 'My Sessions', icon: '📅' },
        { path: '/demonstrator/reports', label: 'Report Reviews', icon: '📝' },
    ];

    useEffect(() => {
        // Load sessions to populate dropdown
        // There is no direct "get all sessions for demonstrator" in demoapi yet, but `getSessionsByCourse` exists.
        // Or `DemoSessionManager` fetches sessions. 
        // For this task, I will try to fetch sessions using a known API or simple mock if needed, 
        // but `demoAPI.getSessionsByCourse` needs a course code.
        // START HARDCODING Session Fetch for now or try generic fetch if available?
        // Let's look at `DemoSessionManager.jsx` later to see how it fetches sessions.
        // For now, let's assume valid sessions are populated or we fetch for a specific course (e.g., "EE101").
        // Wait, I should verify how to get sessions.
        fetchSessions();
    }, []);

    const [courseCode, setCourseCode] = useState(''); // Start empty, user must enter/select

    useEffect(() => {
        // Don't auto-fetch on mount if no course code
        if (courseCode && courseCode.trim() !== '') {
            fetchSessions();
        }
    }, []);

    const fetchSessions = async () => {
        // Validate course code before making API call
        if (!courseCode || courseCode.trim() === '') {
            toast.warning('Please enter a course code');
            setSessions([]);
            return;
        }

        try {
            const res = await demoAPI.getSessionsByCourse(courseCode);
            setSessions(res.data || []);
            setSelectedSessionId(''); // Reset selection
        } catch (err) {
            console.error("Error fetching sessions", err);
            setSessions([]);
            // Show user-friendly error message
            if (err.response?.status === 404 || err.response?.status === 400) {
                toast.info(`No course found with code: ${courseCode}`);
            } else {
                toast.error('Failed to fetch sessions. Please try again.');
            }
        }
    };

    useEffect(() => {
        if (selectedSessionId) {
            loadReports(selectedSessionId);
        }
    }, [selectedSessionId]);

    const loadReports = async (sessionId) => {
        setLoading(true);
        try {
            const response = await demoAPI.getSubmissionsBySession(sessionId);
            setReports(response.data);
        } catch (error) {
            console.error("Failed to load reports", error);
            toast.error("Failed to load reports.");
        } finally {
            setLoading(false);
        }
    };

    const openReviewModal = (report) => {
        setSelectedReport(report);
        setReviewComment('');
        setReviewGrade('A');
    };

    const closeReviewModal = () => {
        setSelectedReport(null);
    };

    const submitReview = async () => {
        if (!selectedReport) return;
        setSubmitting(true);

        try {
            // Get demonstrator ID from localStorage
            const userStr = localStorage.getItem('user');
            if (!userStr) {
                toast.error('User not found. Please login again.');
                setSubmitting(false);
                return;
            }

            const user = JSON.parse(userStr);
            const demonstratorId = user?.id;

            if (!demonstratorId) {
                toast.error('Demonstrator ID not found. Please login again.');
                setSubmitting(false);
                return;
            }

            // Validate inputs
            if (!reviewComment || reviewComment.trim() === '') {
                toast.warning('Please provide feedback comments');
                setSubmitting(false);
                return;
            }

            const payload = {
                comments: reviewComment,
                grade: reviewGrade, // Enum value (e.g., A_PLUS, A, B, etc.)
                demonstratorId: demonstratorId,
                reportSubmissionId: selectedReport.id
            };

            await demoAPI.reviewReport(payload);
            toast.success("Review submitted successfully!");
            closeReviewModal();
            loadReports(selectedSessionId); // Refresh list
        } catch (error) {
            console.error("Review submission failed", error);

            // Display specific error messages
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else if (error.response?.status === 400) {
                toast.error("Invalid data. Please check your inputs.");
            } else if (error.response?.status === 404) {
                toast.error("Report or demonstrator not found.");
            } else if (error.response?.status === 409) {
                toast.error("This report has already been reviewed.");
            } else {
                toast.error("Failed to submit review. Please try again.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Layout menuItems={demonstratorMenu} title="🎓 Demonstrator">
            <ToastContainer />
            <div className="report-reviews">
                <h2>Student Report Reviews</h2>

                {/* Course & Session Selector */}
                <div className="mb-6 flex flex-col md:flex-row gap-4 bg-white p-4 rounded shadow-sm">
                    <div className="flex-1">
                        <label className="block text-sm font-bold mb-1">Course Code:</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={courseCode}
                                onChange={(e) => setCourseCode(e.target.value)}
                                className="p-2 border rounded flex-1"
                                placeholder="e.g. EE101"
                            />
                            <button
                                onClick={fetchSessions}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            >
                                Fetch
                            </button>
                        </div>
                    </div>

                    <div className="flex-1">
                        <label className="block text-sm font-bold mb-1">Select Session:</label>
                        <select
                            value={selectedSessionId}
                            onChange={(e) => setSelectedSessionId(e.target.value)}
                            className="w-full p-2 border rounded"
                        >
                            <option value="">-- Select Session --</option>
                            {sessions.map(s => (
                                <option key={s.id} value={s.id}>{s.title || s.experimentNumber} ({s.date})</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="reports-grid">
                    {loading ? <p>Loading reports...</p> : (
                        reports.length > 0 ? reports.map(report => (
                            <div key={report.id} className="report-card">
                                <div className="report-header">
                                    <span className="student-id">{report.studentName} ({report.studentId})</span>
                                    <span className={`status-badge ${report.status ? report.status.toLowerCase() : 'pending'}`}>
                                        {report.status || 'PENDING'}
                                    </span>
                                </div>
                                <div className="mt-2">
                                    <a href={report.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                                        View PDF
                                    </a>
                                </div>
                                <p className="submission-date">Submitted: {new Date(report.submittedAt).toLocaleString()}</p>

                                {report.status === 'GRADED' ? (
                                    <div className="mt-2 text-sm bg-gray-100 p-2 rounded">
                                        <p><strong>Grade:</strong> {report.grade}</p>
                                        <p><strong>Comment:</strong> {report.comments}</p>
                                    </div>
                                ) : (
                                    <button
                                        className="btn-review mt-3"
                                        onClick={() => openReviewModal(report)}
                                    >
                                        Grade Submission
                                    </button>
                                )}
                            </div>
                        )) : <p>No submissions found for this session.</p>
                    )}
                </div>

                {/* Review Modal */}
                {selectedReport && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h3>Grade Report: {selectedReport.studentName}</h3>
                            <div className="modal-body">
                                <label>Grade:</label>
                                <select
                                    value={reviewGrade}
                                    onChange={(e) => setReviewGrade(e.target.value)}
                                >
                                    <option value="A_PLUS">A+</option>
                                    <option value="A">A</option>
                                    <option value="A_MINUS">A-</option>
                                    <option value="B_PLUS">B+</option>
                                    <option value="B">B</option>
                                    <option value="B_MINUS">B-</option>
                                    <option value="C_PLUS">C+</option>
                                    <option value="C">C</option>
                                    <option value="C_MINUS">C-</option>
                                    <option value="D_PLUS">D+</option>
                                    <option value="D">D</option>
                                    <option value="E">E</option>
                                </select>

                                <label>Feedback:</label>
                                <textarea
                                    rows="4"
                                    placeholder="Enter feedback for the student..."
                                    value={reviewComment}
                                    onChange={(e) => setReviewComment(e.target.value)}
                                />
                            </div>
                            <div className="modal-actions">
                                <button className="btn-cancel" onClick={closeReviewModal} disabled={submitting}>Cancel</button>
                                <button className="btn-save" onClick={submitReview} disabled={submitting}>
                                    {submitting ? 'Submitting...' : 'Submit Grade'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default DemoReportReviews;
