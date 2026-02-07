import React, { useState } from 'react';
import axios from 'axios';
import './Reports.css';

const Reports = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const downloadReport = async (type, format) => {
        setLoading(true);
        setError(null);
        try {
            const endpoint = `/api/reports/${type}/${format}`;
            const response = await axios.get(`http://localhost:8080/elms${endpoint}`, {
                responseType: 'blob', // Important!
            });

            // Create blob link to download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;

            // Extract filename if possible, or give default
            let filename = `report-${type}.${format === 'excel' ? 'xlsx' : 'pdf'}`;
            // If backend sends Content-Disposition, we could parse it, but simple default is fine.

            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error("Download failed:", err);
            setError("Failed to download report. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reports-container">
            <h2>📊 Lab Reports</h2>
            {error && <div className="error-message">{error}</div>}

            <div className="reports-grid">
                {/* Monthly Usage */}
                <div className="report-card">
                    <h3>Monthly Usage</h3>
                    <p>Summary of equipment issued this month.</p>
                    <button
                        className="btn-download pdf"
                        onClick={() => downloadReport('usage', 'pdf')}
                        disabled={loading}
                    >
                        {loading ? 'Downloading...' : '📄 Download PDF'}
                    </button>
                </div>

                {/* Low Stock */}
                <div className="report-card">
                    <h3>Low Stock</h3>
                    <p>Items running low on quantity.</p>
                    <button
                        className="btn-download excel"
                        onClick={() => downloadReport('low-stock', 'excel')}
                        disabled={loading}
                    >
                        {loading ? 'Downloading...' : '📊 Download Excel'}
                    </button>
                </div>

                {/* Damaged Items */}
                <div className="report-card">
                    <h3>Damaged Items</h3>
                    <p>Inventory marked as Damaged or Maintenance.</p>
                    <button
                        className="btn-download pdf"
                        onClick={() => downloadReport('damaged', 'pdf')}
                        disabled={loading}
                    >
                        {loading ? 'Downloading...' : '📄 Download PDF'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Reports;
