import { useMemo } from "react";
import { Award, TrendingUp, ChevronLeft,AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import StudentNavbar from "./StudentNavbar";
import { useGetCurrentUserProfileQuery, useGetReviewsByStudentIdQuery } from "@/services/api";
import { useSelector } from "react-redux";

const Grades = () => {
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth?.user);

    // Fetch user profile first
    const { data: profile, isLoading: profileLoading, error: profileError } = useGetCurrentUserProfileQuery(
        user?.registrationNumber || user?.username,
        { skip: !user?.registrationNumber && !user?.username }
    );
    
    console.log("User Data:", user);
    console.log("Profile Data:", profile);

    // Use profile.userId instead of user.id for API calls
    const userId = profile?.userId || user?.id;

    // Fetch reviews from backend
    const { data: reviewsData, isLoading, error } = useGetReviewsByStudentIdQuery(userId, {
        skip: !userId,
    });
    
    console.log("User Data:", user);
    console.log("Reviews Data:", reviewsData);

    // Transform reviews data for display
    const gradesData = useMemo(() => {
        if (!reviewsData || !Array.isArray(reviewsData)) return [];

        return reviewsData.map((review) => ({
            id: review.labReportReviewId,
            submissionId: review.reportSubmissionId,
            grade: review.grade,
            comment: review.comment,
            demonstratorName: review.demonstratorName,
            reviewedAt: review.reviewedAt ? new Date(review.reviewedAt).toISOString().split('T')[0] : null,
        }));
    }, [reviewsData]);

    // Calculate statistics
    const totalSubmissions = gradesData.length;

    // Calculate average grade (simplified)
    const gradePoints = {
        "A_PLUS": 4.0, "A": 4.0, "A_MINUS": 3.7,
        "B_PLUS": 3.3, "B": 3.0, "B_MINUS": 2.7,
        "C_PLUS": 2.3, "C": 2.0, "C_MINUS": 1.7,
        "D_PLUS": 1.3, "D": 1.0, "E": 0.0
    };

    const avgGPA = gradesData.length > 0
        ? (gradesData.reduce((sum, item) => sum + (gradePoints[item.grade] || 0), 0) / gradesData.length).toFixed(2)
        : "N/A";

    // Format grade display
    const formatGrade = (grade) => {
        if (!grade) return "Pending";
        return grade.replace(/_/g, "");
    };

    // Get grade color
    const getGradeColor = (grade) => {
        if (!grade) return "bg-gray-100 text-gray-600 border-gray-300";
        const value = gradePoints[grade] || 0;
        if (value >= 3.7) return "bg-green-100 text-green-700 border-green-300";
        if (value >= 3.0) return "bg-blue-100 text-blue-700 border-blue-300";
        if (value >= 2.0) return "bg-yellow-100 text-yellow-700 border-yellow-300";
        return "bg-red-100 text-red-700 border-red-300";
    };

    // Format date nicely
    const formatDateTime = (dateString) => {
        if (!dateString) return "N/A";
        try {
            const date = new Date(dateString);
            return date.toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            return dateString;
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
                <StudentNavbar />
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading your grades...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Error state or no reviews - show user-friendly message
    if (error || (reviewsData && reviewsData.length === 0)) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
                <StudentNavbar />
                <div className="max-w-7xl mx-auto px-6 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-indigo-100 rounded-lg">
                                <Award className="w-6 h-6 text-indigo-600" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">My Grades</h1>
                                <p className="text-gray-600">View your lab reviews and feedback</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-12 text-center border border-indigo-100">
                        <div className="max-w-md mx-auto">
                            <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-md">
                                <Award className="w-10 h-10 text-indigo-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">No Grades Available Yet</h3>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                You haven't received any grades for your lab submissions yet. Once your demonstrator 
                                reviews your work, your grades and feedback will appear here.
                            </p>
                            <div className="bg-white rounded-lg p-4 border border-indigo-200 mb-6">
                                <p className="text-sm text-gray-700">
                                    <span className="font-semibold text-indigo-600">💡 Tip:</span> Make sure you've submitted 
                                    your lab reports. Grades typically appear within a few days after submission.
                                </p>
                            </div>
                            <Button
                                onClick={() => navigate('/labs')}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg shadow-md transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4 mr-2" />
                                Back to Labs
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <StudentNavbar />
            <div className="max-w-7xl mx-auto px-6 py-8">

                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-indigo-100 rounded-lg">
                            <Award className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">My Grades</h1>
                            <p className="text-gray-600">View your lab reviews and feedback</p>
                        </div>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-indigo-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 font-medium">Total Reviews</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{totalSubmissions}</p>
                            </div>
                            <div className="p-3 bg-indigo-100 rounded-lg">
                                <Award className="w-6 h-6 text-indigo-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 font-medium">Average GPA</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{avgGPA}</p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-lg">
                                <TrendingUp className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-6">
                    {gradesData.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow p-6"
                        >
                            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-5 border-l-4 border-purple-400 shadow-sm">
                                <div className="flex items-start justify-between gap-4 mb-4">
                                    <div className="flex items-center gap-2">
                                        <Award className="w-5 h-5 text-purple-600" />
                                        <h4 className="font-semibold text-gray-800">Demonstrator Review</h4>
                                    </div>
                                    <span className={`px-4 py-1.5 rounded-full text-sm font-bold border-2 shadow-sm ${getGradeColor(item.grade)}`}>
                                        {formatGrade(item.grade)}
                                    </span>
                                </div>
                                <div className="bg-white/60 rounded-lg p-4 border border-purple-100">
                                    <p className="text-gray-700 leading-relaxed text-sm">
                                        {item.comment}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Grades;
