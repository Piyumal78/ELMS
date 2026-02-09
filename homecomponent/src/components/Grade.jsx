import React from 'react';
import { Award, User, Calendar, MessageSquare, AlertCircle, Loader2 } from 'lucide-react';
import { useGetReportReviewBySubmissionIdQuery } from '@/services/api';

const Grade = ({ submissionId }) => {
    // Use RTK Query hook to fetch review data
    const {
        data: review,
        isLoading,
        error
    } = useGetReportReviewBySubmissionIdQuery(submissionId, {
        skip: !submissionId, // Skip query if no submissionId provided
    });

    // Format grade display (e.g., A_PLUS -> A+)
    const formatGrade = (grade) => {
        if (!grade) return 'N/A';
        return grade.replace(/_/g, '');
    };

    // Get grade color based on grade value
    const getGradeColor = (grade) => {
        if (!grade) return 'bg-gray-100 text-gray-600 border-gray-300';

        const gradeValue = grade.toUpperCase();
        if (gradeValue.startsWith('A')) {
            return 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-300';
        } else if (gradeValue.startsWith('B')) {
            return 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border-blue-300';
        } else if (gradeValue.startsWith('C')) {
            return 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-700 border-yellow-300';
        } else if (gradeValue.startsWith('D')) {
            return 'bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 border-orange-300';
        } else {
            return 'bg-gradient-to-r from-red-100 to-rose-100 text-red-700 border-red-300';
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="w-full max-w-3xl mx-auto p-6">
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                    <div className="flex items-center justify-center space-x-3">
                        <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
                        <p className="text-gray-600 font-medium">Loading review...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error || !submissionId) {
        const errorMessage = !submissionId
            ? 'No submission ID provided'
            : error?.status === 404
                ? 'Review not found for this submission'
                : error?.data?.message || 'Failed to fetch review';

        return (
            <div className="w-full max-w-3xl mx-auto p-6">
                <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-red-500">
                    <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                            <AlertCircle className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                Review Not Found
                            </h3>
                            <p className="text-gray-600">{errorMessage}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Success state - Display review
    return (
        <div className="w-full max-w-3xl mx-auto p-6">
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl overflow-hidden border border-gray-200">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                <Award className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-white">Lab Report Review</h2>
                        </div>
                        <div className={`px-6 py-3 rounded-xl font-bold text-2xl border-2 shadow-lg ${getGradeColor(review.grade)}`}>
                            {formatGrade(review.grade)}
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-8 space-y-6">
                    {/* Reviewer Information */}
                    <div className="flex items-center space-x-3 pb-4 border-b border-gray-200">
                        <div className="p-2 bg-indigo-100 rounded-lg">
                            <User className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Reviewed by</p>
                            <p className="text-lg font-semibold text-gray-900">
                                {review.demonstratorName || 'Unknown Reviewer'}
                            </p>
                        </div>
                    </div>

                    {/* Review Date */}
                    {review.reviewedAt && (
                        <div className="flex items-center space-x-3 pb-4 border-b border-gray-200">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <Calendar className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Reviewed on</p>
                                <p className="text-lg font-semibold text-gray-900">
                                    {new Date(review.reviewedAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Comments Section */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-indigo-100">
                        <div className="flex items-start space-x-3">
                            <div className="p-2 bg-white rounded-lg shadow-sm flex-shrink-0">
                                <MessageSquare className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                    Reviewer Comments
                                </h3>
                                {review.comment ? (
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                        {review.comment}
                                    </p>
                                ) : (
                                    <p className="text-gray-500 italic">No comments provided</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Submission ID (for reference) */}
                    <div className="text-center pt-4">
                        <p className="text-sm text-gray-500">
                            Submission ID: <span className="font-mono font-semibold text-gray-700">{review.reportSubmissionId}</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Grade;
