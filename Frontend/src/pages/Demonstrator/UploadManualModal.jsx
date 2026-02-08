import React, { useState } from 'react';
import { demoAPI } from '../../utils/demoapi';

const UploadManualModal = ({ sessionId, onClose }) => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type !== 'application/pdf') {
            alert("Only PDF files are allowed.");
            return;
        }
        setFile(selectedFile);
    };

    const handleUpload = async () => {
        if (!file) return alert("Please select a file first.");

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            await demoAPI.uploadLabManual(sessionId, formData);
            alert("Lab Manual Uploaded Successfully!");
            onClose(); // Close modal on success
        } catch (error) {
            console.error("Upload failed", error);
            alert("Failed to upload manual. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h3 className="text-xl font-bold mb-4 text-gray-800">Upload Lab Manual</h3>

                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Select PDF File</label>
                    <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="w-full border border-gray-300 rounded p-2"
                    />
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                        disabled={uploading}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleUpload}
                        disabled={uploading || !file}
                        className={`px-4 py-2 text-white rounded font-medium ${uploading || !file ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                    >
                        {uploading ? 'Uploading...' : 'Upload'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UploadManualModal;
