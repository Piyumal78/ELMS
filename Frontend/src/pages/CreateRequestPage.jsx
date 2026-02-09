import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { requestsAPI } from '../utils/api';
import './CreateRequestPage.css'; // Assume basic styling or reuse existing

const CreateRequestPage = () => {
    const [formData, setFormData] = useState({
        studentId: '',
        studentName: '',
        itemName: '',
        quantity: 1,
        purpose: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await requestsAPI.create(formData);
            toast.success('Request submitted successfully!');
            // Clear form
            setFormData({
                studentId: '',
                studentName: '',
                itemName: '',
                quantity: 1,
                purpose: ''
            });
        } catch (error) {
            console.error('Error submitting request:', error);
            // Specific check for backend error message
            const errorMsg = error.response?.data?.message || 'Error submitting request. Please check input.';
            toast.error(errorMsg);
        }
    };

    return (
        <div className="create-request-page">
            <h2>Create New Request</h2>
            <form onSubmit={handleSubmit} className="request-form">
                <div className="form-group">
                    <label>Student ID:</label>
                    <input
                        type="text"
                        name="studentId"
                        value={formData.studentId}
                        onChange={handleChange}
                        required
                        placeholder="e.g. STU001"
                    />
                </div>
                <div className="form-group">
                    <label>Student Name:</label>
                    <input
                        type="text"
                        name="studentName"
                        value={formData.studentName}
                        onChange={handleChange}
                        required
                        placeholder="Full Name"
                    />
                </div>
                <div className="form-group">
                    <label>Item Name:</label>
                    <input
                        type="text"
                        name="itemName"
                        value={formData.itemName}
                        onChange={handleChange}
                        required
                        placeholder="Item to borrow"
                    />
                </div>
                <div className="form-group">
                    <label>Quantity:</label>
                    <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        min="1"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Purpose:</label>
                    <textarea
                        name="purpose"
                        value={formData.purpose}
                        onChange={handleChange}
                        required
                        placeholder="Reason for borrowing..."
                    />
                </div>
                <button type="submit" className="btn-submit">Submit Request</button>
            </form>
        </div>
    );
};

export default CreateRequestPage;
