import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { demoAPI } from '../../utils/demoapi';
import './DemoReportReviews.css';

const DemoReportReviews = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(false);

    // Modal state
    const [selectedReport, setSelectedReport] = useState(null);
    const [reviewComment, setReviewComment] = useState('');
    const [reviewStatus, setReviewStatus] = useState('APPROVED');

    const demonstratorMenu = [
        { path: '/demonstrator/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/demonstrator/sessions', label: 'My Sessions', icon: '📅' },
        { path: '/demonstrator/reports', label: 'Report Reviews', icon: '📝' },
    ];

    useEffect(() => {
        loadReports();
    }, []);

    const loadReports = async () => {
        setLoading(true);
        try {
            const response = await demoAPI.getPendingReports();
            setReports(response.data);
        } catch (error) {
            console.error("Failed to load reports", error);
        } finally {
            setLoading(false);
        }
    };

    const openReviewModal = (report) => {
        setSelectedReport(report);
        setReviewComment('');
        setReviewStatus('APPROVED');
    };

    const closeReviewModal = () => {
        setSelectedReport(null);
    };

    const submitReview = async () => {
        if (!selectedReport) return;

        try {
            const payload = {
                reportId: selectedReport.id,
                status: reviewStatus,
                comment: reviewComment,
                reviewerId: 1 // Example: should come from auth
            };

            await demoAPI.reviewReport(payload);
            alert("Review submitted successfully!");
            closeReviewModal();
            loadReports(); // Refresh list
        } catch (error) {
            console.error("Review submission failed", error);
            if (error.response && error.response.status === 403) {
                alert("Permission Denied.");
            } else {
                alert("Failed to submit review.");
            }
        }
    };

    return (
        <Layout menuItems={demonstratorMenu}>
            <div className="report-reviews">
                <h2>Student Report Reviews</h2>
                <div className="reports-grid">
                    {loading ? <p>Loading reports...</p> : (
                        reports.length > 0 ? reports.map(report => (
                            <div key={report.id} className="report-card">
                                <div className="report-header">
                                    <span className="student-id">{report.studentId}</span>
                                    <span className={`status-badge ${report.status.toLowerCase()}`}>{report.status}</span>
                                </div>
                                <h3>{report.studentName}</h3>
                                <p className="experiment-title">{report.experiment}</p>
                                <p className="submission-date">📅 {report.date}</p>
                                <button
                                    className="btn-review"
                                    onClick={() => openReviewModal(report)}
                                >
                                    Review Submission
                                </button>
                            </div>
                        )) : <p>No pending reports.</p>
                    )}
                </div>

                {/* Review Modal */}
                {selectedReport && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h3>Review Report: {selectedReport.studentName}</h3>
                            <div className="modal-body">
                                <label>Status:</label>
                                <select
                                    value={reviewStatus}
                                    onChange={(e) => setReviewStatus(e.target.value)}
                                >
                                    <option value="APPROVED">Approve</option>
                                    <option value="REJECTED">Reject</option>
                                </select>

                                <label>Comments:</label>
                                <textarea
                                    rows="4"
                                    placeholder="Enter feedback for the student..."
                                    value={reviewComment}
                                    onChange={(e) => setReviewComment(e.target.value)}
                                />
                            </div>
                            <div className="modal-actions">
                                <button className="btn-cancel" onClick={closeReviewModal}>Cancel</button>
                                <button className="btn-save" onClick={submitReview}>Submit Review</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default DemoReportReviews;
