import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";
import { FileUp, Upload, X, FileText, Download, Clock, CheckCircle2, AlertCircle, Home, BookOpen, Loader2 } from "lucide-react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import Navbar from "./Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useGetLabManualBySessionIdQuery, useSubmitReportMutation,useGetCurrentUserProfileQuery } from "@/services/api";
import StudentNavbar from "../Student/StudentNavbar";

const LabSubmission = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { user, token } = useSelector((state) => state.auth);
    const [file, setFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    // Debug: Log user info to console
    console.log('Current User from Auth State:', user);
    console.log('Has Token:', !!token);

    // Fetch lab manual using sessionId
    const { data: labManual, isLoading: labManualLoading } = useGetLabManualBySessionIdQuery(state?.sessionId, {
        skip: !state?.sessionId
    });
    console.log("Lab Manual Data:", labManual);
    const { data: currentUser } = useGetCurrentUserProfileQuery(user?.username, {
        skip: !user?.username
    });
    console.log("Current User Profile:", currentUser);

    // Submit report mutation
    const [submitReport, { isLoading: isSubmitting }] = useSubmitReportMutation();

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
        
        if (droppedFiles.length > 0) {
            const droppedFile = droppedFiles[0];
            // Validate file type and size
            const isValidType = droppedFile.type === 'application/pdf' || 
                               droppedFile.type === 'application/zip' || 
                               droppedFile.type === 'application/x-zip-compressed' ||
                               droppedFile.name.endsWith('.rar');
            const isValidSize = droppedFile.size <= 10 * 1024 * 1024; // 10MB
            
            if (isValidType && isValidSize) {
                setFile(droppedFile);
            } else {
                setSubmitError('Invalid file type or file too large (max 10MB)');
            }
        }
    };

    const handleFileSelect = (e) => {
        const selectedFiles = Array.from(e.target.files);
        
        if (selectedFiles.length > 0) {
            const selectedFile = selectedFiles[0];
            // Validate file
            const isValidSize = selectedFile.size <= 10 * 1024 * 1024;
            
            if (isValidSize) {
                setFile(selectedFile);
                setSubmitError(null);
            } else {
                setSubmitError('File too large (max 10MB)');
            }
        }
    };

    const removeFile = () => {
        setFile(null);
    };

    const handleSubmit = async () => {
        if (!file) {
            setSubmitError('Please select a file to submit');
            return;
        }

        // Check authentication - use currentUser from API which has the id
        if (!currentUser?.userId) {
            console.error('User authentication issue:', { user, token, currentUser });
            setSubmitError('User profile not loaded. Please refresh the page.');
            return;
        }

        try {
            setSubmitError(null);
            
            console.log('Submitting report:', {
                studentId: currentUser.id,
                sessionId: state?.sessionId,
                fileName: file.name
            });
            
            // Create FormData and append file with correct parameter name
            const formData = new FormData();
            formData.append('file', file);

            // Submit to API
            await submitReport({
                studentId: currentUser.userId,
                sessionId: state?.sessionId,
                formData: formData
            }).unwrap();

            // Show success message
            setSubmitSuccess(true);
            setFile(null);
            
            // Hide success message and redirect after 3 seconds
            setTimeout(() => {
                setSubmitSuccess(false);
                navigate(`/lab-details/${state?.courseCode}`);
            }, 3000);
        } catch (error) {
            console.error('Submission failed:', error);
            setSubmitError(error?.data?.message || 'Failed to submit assignment. Please try again.');
        }
    };

    return (
        <div className="bg-slate-100 min-h-screen">
            <StudentNavbar />
            
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Breadcrumb */}
                <Breadcrumb className="mb-6">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/" className="flex items-center gap-1">
                                <Home className="w-4 h-4" />
                                Home
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href={`/lab-details/${state?.courseCode}`} className="flex items-center gap-1">
                                <BookOpen className="w-4 h-4" />
                                {state?.courseCode}
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Experiment {state?.experimentNumber}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <FileUp className="w-8 h-8 text-blue-600" />
                        <h1 className="text-3xl font-bold text-slate-800">
                            {state?.title || "Assignment Submission"}
                        </h1>
                    </div>
                    <p className="text-slate-600">
                        Course: <span className="font-semibold">{state?.courseCode}</span> | 
                        Experiment: <span className="font-semibold">{state?.experimentNumber}</span>
                    </p>
                </div>

                {/* Success Alert */}
                {submitSuccess && (
                    <Alert className="mb-6 bg-green-50 border-green-200">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800">
                            Assignment submitted successfully! Your submission has been recorded.
                        </AlertDescription>
                    </Alert>
                )}
                {/* Error Alert */}
                {submitError && (
                    <Alert className="mb-6 bg-red-50 border-red-200">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-red-800">
                            {submitError}
                        </AlertDescription>
                    </Alert>
                )}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Lab Manual Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-blue-600" />
                                    Lab Manual
                                </CardTitle>
                                <CardDescription>
                                    Download the lab manual to complete your assignment
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {labManualLoading ? (
                                    <div className="text-center py-4 text-slate-500">
                                        Loading lab manual...
                                    </div>
                                ) : labManual?.fileUrl ? (
                                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-100 rounded-lg">
                                                <FileText className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-800">Lab Manual PDF</p>
                                                <p className="text-sm text-slate-500">Click to download or view</p>
                                            </div>
                                        </div>
                                        <Button
                                            onClick={() => window.open(labManual.fileUrl, '_blank')}
                                            className="bg-blue-600 hover:bg-blue-700"
                                        >
                                            <Download className="w-4 h-4 mr-2" />
                                            Download
                                        </Button>
                                    </div>
                                ) : (
                                    <Alert>
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>
                                            No lab manual available for this experiment yet.
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </CardContent>
                        </Card>

                        {/* File Submission Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Upload className="w-5 h-5 text-blue-600" />
                                    Submit Your Work
                                </CardTitle>
                                <CardDescription>
                                    Upload your completed assignment files
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Drag & Drop Area */}
                                <div
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                                        isDragging 
                                            ? 'border-blue-500 bg-blue-50 scale-105' 
                                            : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
                                    }`}
                                >
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="p-4 bg-blue-100 rounded-full">
                                            <Upload className="w-8 h-8 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-lg font-medium text-slate-700">
                                                Drag and drop your files here
                                            </p>
                                            <p className="text-slate-500">or</p>
                                        </div>
                                        <label className="cursor-pointer">
                                            <span className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                                                Browse Files
                                            </span>
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept=".pdf,.zip,.rar"
                                                onChange={handleFileSelect}
                                            />
                                        </label>
                                        <p className="text-xs text-slate-400">
                                            Accepted: PDF, ZIP, RAR • Max size: 10MB per file
                                        </p>
                                    </div>
                                </div>

                                {/* Selected File */}
                                {file && (
                                    <div className="space-y-2">
                                        <h4 className="font-medium text-slate-700">Selected File</h4>
                                        <div className="flex items-center justify-between p-4 bg-white border rounded-lg hover:shadow-sm transition-shadow">
                                            <div className="flex items-center gap-3 flex-1">
                                                <div className="p-2 bg-blue-50 rounded">
                                                    <FileText className="w-5 h-5 text-blue-600" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-slate-800 truncate">
                                                        {file.name}
                                                    </p>
                                                    <p className="text-sm text-slate-500">
                                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={removeFile}
                                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Submit Button */}
                                <div className="flex gap-3 pt-4">
                                    <Button
                                        variant="outline"
                                        onClick={() => navigate(`/lab-details/${state?.courseCode}`)}
                                        className="flex-1"
                                        disabled={isSubmitting}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={!file || isSubmitting}
                                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Submitting...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                                Submit Assignment
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Submission Guidelines */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Submission Guidelines</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <div className="flex gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                    <p>Submit files as a <strong>ZIP or RAR</strong> archive</p>
                                </div>
                                <div className="flex gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                    <p>Include MATLAB scripts (.m files) and plots (.jpeg)</p>
                                </div>
                                <div className="flex gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="mb-1">File naming format:</p>
                                        <code className="block bg-slate-100 px-2 py-1 rounded text-xs">
                                            StudentID_E{state?.experimentNumber?.toString().padStart(2, '0')}.zip
                                        </code>
                                        <p className="text-slate-500 mt-1">
                                            Example: EC_2021_123_E{state?.experimentNumber?.toString().padStart(2, '0')}.zip
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Deadline Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-orange-600" />
                                    Deadline
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Alert className="border-orange-200 bg-orange-50">
                                    <AlertDescription className="text-orange-800">
                                        <p className="font-semibold mb-1">Due Date</p>
                                        <p>Wednesday, 17 December 2025</p>
                                        <p>11:59 PM</p>
                                    </AlertDescription>
                                </Alert>
                            </CardContent>
                        </Card>

                        {/* Submission Status */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Status</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Attempts</span>
                                    <span className="font-semibold">0 / 3</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Status</span>
                                    <span className="text-orange-600 font-semibold">Not Submitted</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Grade</span>
                                    <span className="text-slate-500">Not Graded</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LabSubmission;
