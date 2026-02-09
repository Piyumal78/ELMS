import React, { useState, useEffect } from 'react';
import { Upload, FileText, X, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const LabSubmission = (props) => {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');
  
  // Set due date: Friday, 19 September 2025, 3:50 PM
  const dueDate = props.dueDate ? new Date(props.dueDate) : new Date('2025-12-19T15:50:00') ;

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = dueDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        
        setTimeLeft(`${days} days ${hours} hours ${minutes} minutes`);
      } else {
        setTimeLeft('Assignment is overdue');
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles([...files, ...droppedFiles]);
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles([...files, ...selectedFiles]);
  };

  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-slate-800 p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">Experiment 1: Introduction to Microcontrollers</h1>
          <div className="flex items-center gap-4 text-sm text-slate-300">
            <div className="flex items-center gap-1">
              <Clock size={16} />
              <span>Due: Friday, 19 September 2025, 3:50 PM</span>
            </div>
            <div className="flex items-center gap-1">
              <AlertCircle size={16} />
              <span>Status: No Attempt</span>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Submission Status Table */}
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm text-left">
              <tbody>
                <tr className="bg-slate-50 border-b">
                  <th className="px-6 py-3 font-medium text-slate-700 w-1/3">Submission Status</th>
                  <td className="px-6 py-3 text-slate-600">No attempt</td>
                </tr>
                <tr className="bg-white border-b">
                  <th className="px-6 py-3 font-medium text-slate-700">Grading Status</th>
                  <td className="px-6 py-3 text-slate-600">Not graded</td>
                </tr>
                <tr className="bg-slate-50 border-b">
                  <th className="px-6 py-3 font-medium text-slate-700">Time Remaining</th>
                  <td className={`px-6 py-3 font-medium ${timeLeft === 'Assignment is overdue' ? 'text-red-600' : 'text-green-600'}`}>
                    {timeLeft}
                  </td>
                </tr>
                <tr className="bg-white">
                  <th className="px-6 py-3 font-medium text-slate-700">Last Modified</th>
                  <td className="px-6 py-3 text-slate-600">-</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* File Upload Area */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800">File Submission</h3>
            
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-slate-400'
              }`}
            >
              <div className="flex flex-col items-center gap-3">
                <div className="p-3 bg-slate-100 rounded-full">
                  <Upload className="text-slate-600" size={24} />
                </div>
                <div>
                  <p className="text-slate-700 font-medium">Drag and drop your files here</p>
                  <p className="text-slate-500 text-sm">or</p>
                </div>
                <label className="cursor-pointer">
                  <span className="bg-slate-800 text-white px-4 py-2 rounded-md hover:bg-slate-700 transition-colors text-sm font-medium">
                    Browse Files
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    multiple
                    onChange={handleFileSelect}
                  />
                </label>
                <p className="text-xs text-slate-400 mt-2">Accepted file types: PDF, DOCX, ZIP (Max 10MB)</p>
              </div>
            </div>

            {/* Selected Files List */}
            {files.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-slate-700">Selected Files:</h4>
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <div className="flex items-center gap-3">
                      <FileText className="text-blue-500" size={20} />
                      <div>
                        <p className="text-sm font-medium text-slate-700">{file.name}</p>
                        <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-md font-medium transition-colors">
              Cancel
            </button>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition-colors flex items-center gap-2">
              <CheckCircle size={18} />
              Submit Assignment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabSubmission;