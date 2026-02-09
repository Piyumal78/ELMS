import React, { useRef, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useGetCurrentUserProfileQuery, useUploadProfilePhotoMutation, useGetAllCourseByStudentIdQuery,useGetProfileImageUrlQuery } from '../services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import { Separator } from '../components/ui/separator';
import { Mail, Phone, MapPin, Calendar, User, GraduationCap, Hash, Shield, Edit, RefreshCw, Sparkles, Camera, Upload, Loader2 } from 'lucide-react';
import StudentNavbar from '@/pages/Student/StudentNavbar';

const Profile = () => {
    // Get current user from Redux store
    const currentUser = useSelector((state) => state.auth.user);
    const navigate = useNavigate();

    // File input ref and upload state
    const fileInputRef = useRef(null);
    const [uploadError, setUploadError] = useState(null);
    const [profileImageUrl, setProfileImageUrl] = useState(null);

    // Fetch user profile details from backend
    const {
        data: profile,
        isLoading,
        isError,
        error,
        refetch
    } = useGetCurrentUserProfileQuery(
        currentUser?.username || currentUser?.registrationNumber,
        {
            skip: !currentUser?.username && !currentUser?.registrationNumber, // Skip if no user logged in
        }
    );

    const { data: courses, isLoading: isCoursesLoading, isError: isCoursesError } = useGetAllCourseByStudentIdQuery(profile?.userId, {
        skip: !profile?.userId
    });
    console.log('Courses enrolled:', courses);

    // Upload profile photo mutation
    const [uploadProfilePhoto, { isLoading: isUploading }] = useUploadProfilePhotoMutation(profile?.userId);
    console.log('Profile component - upload mutation state:', uploadProfilePhoto);

    const { data: profilePhotoUrl } = useGetProfileImageUrlQuery(profile?.userId, { skip: !profile?.userId });
    useEffect(() => {
        if (profilePhotoUrl) {
            setProfileImageUrl(profilePhotoUrl);
        }
    }, [profilePhotoUrl]);

    console.log('Profile component - profile photo URL:', profilePhotoUrl);
    // Debug: Log profile data
    useEffect(() => {
        console.log('=== Profile Component Debug Info ===');
        console.log('Profile data loaded:', profile);
        console.log('Profile ID:', profile?.userId);
        console.log('Current user:', currentUser);
        console.log('Current user ID:', currentUser?.id);
        console.log('Student ID available:', profile?.userId || currentUser?.id || 'NONE');
        console.log('===================================');
    }, [profile, currentUser]);

    // Initialize profile image URL when profile loads
    useEffect(() => {
        if (profile?.fileUrl || profile?.profilePicture) {
            setProfileImageUrl(profile.fileUrl || profile.profilePicture);
        }
    }, [profile?.fileUrl, profile?.profilePicture]);

    // Handle file selection and upload
    const handleFileChange = async (event) => {
        console.log('File input changed');
        const file = event.target.files?.[0];
        console.log('Selected file:', file?.name, file?.type, file?.size);

        if (!file) return;

        // Get student ID from profile or currentUser as fallback
        const studentId = profile?.userId || currentUser?.id;

        // Check if we have a student ID
        // if (!profile?.userId) {
        //     setUploadError('Unable to identify student. Please try logging in again.');
        //     console.error('No student ID available');
        //     return;
        // }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setUploadError('Please select an image file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setUploadError('Image size should be less than 5MB');
            return;
        }

        try {
            setUploadError(null);
            console.log('Uploading profile photo for student ID:', studentId);

            const response = await uploadProfilePhoto({
                studentId: studentId,
                file
            }).unwrap();

            console.log('Upload response:', response);

            // Set the new profile image URL from response
            if (response?.fileUrl) {
                setProfileImageUrl(response.fileUrl);
            }

            // Refetch profile to update other data
            refetch();
        } catch (err) {
            setUploadError(err?.data?.message || 'Failed to upload profile photo');
            console.error('Upload error:', err);
        } finally {
            // Reset file input to allow re-uploading the same file
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    // Trigger file input click
    const handleCameraClick = () => {
        console.log('Camera button clicked');
        console.log('Profile object:', profile);
        console.log('Profile ID:', profile?.userId);
        console.log('Current user ID:', currentUser?.id);
        console.log('File input ref:', fileInputRef.current);

        // Clear previous errors
        setUploadError(null);

        // Check if we have a student ID from either profile or currentUser
        const studentId = profile?.userId || currentUser?.id;

        // if (!studentId) {
        //     setUploadError('Unable to identify student. Please try logging in again.');
        //     console.warn('No student ID available. Profile:', profile, 'User:', currentUser);
        //     return;
        // }

        console.log('Using student ID:', studentId);
        fileInputRef.current?.click();
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
                <div className="container mx-auto max-w-5xl">
                    <Card className="backdrop-blur-sm bg-white/80 border-none shadow-xl">
                        <CardHeader>
                            <div className="flex items-center gap-6">
                                <Skeleton className="h-24 w-24 rounded-full" />
                                <div className="space-y-3 flex-1">
                                    <Skeleton className="h-8 w-64" />
                                    <Skeleton className="h-5 w-48" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    // Error state
    if (isError) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
                <div className="container mx-auto max-w-5xl">
                    <Card className="backdrop-blur-sm bg-white/80 border-red-200 shadow-xl">
                        <CardHeader>
                            <CardTitle className="text-red-600 flex items-center gap-2">
                                <span className="text-3xl">⚠️</span> Error Loading Profile
                            </CardTitle>
                            <CardDescription className="text-base">
                                {error?.data?.message || 'Failed to load profile data. Please try again.'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button onClick={refetch} variant="outline" className="hover:scale-105 transition-transform">
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Try Again
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    // No user logged in
    if (!currentUser) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
                <div className="container mx-auto max-w-5xl">
                    <Card className="backdrop-blur-sm bg-white/80 border-none shadow-xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-6 w-6" />
                                No User Found
                            </CardTitle>
                            <CardDescription className="text-base">
                                Please log in to view your profile.
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </div>
            </div>
        );
    }

    // Get initials for avatar fallback
    const getInitials = (name) => {
        if (!name) return '?';
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const fullName = profile?.firstName && profile?.lastName
        ? `${profile.firstName} ${profile.lastName}`
        : profile?.name || 'Unknown User';

    return (
        <div >
            <StudentNavbar />
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
                <div className="container mx-auto max-w-5xl space-y-6">

                    {/* Profile Header Card with Gradient */}
                    <Card className="relative overflow-hidden border-none shadow-2xl hover:shadow-3xl transition-shadow duration-300">
                        {/* Gradient Background */}
                        <div className="absolute inset-0 bg-slate-900 opacity-90" />

                        <CardHeader className="relative z-10">
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                                {/* Avatar with Ring and Camera Icon */}
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-white rounded-full blur-md opacity-50" />
                                    <Avatar className="h-28 w-28 relative border-4 border-white shadow-xl ring-4 ring-white/20">
                                        <AvatarImage src={profileImageUrl || profile?.fileUrl || profile?.profilePicture} alt={fullName} />
                                        <AvatarFallback className="text-3xl bg-slate-900 text-white font-bold">
                                            {getInitials(fullName)}
                                        </AvatarFallback>
                                    </Avatar>

                                    {/* Hidden File Input */}
                                    <input
                                        ref={fileInputRef}
                                        id="profile-photo-upload"
                                        type="file"
                                        accept="image/*,image/png,image/jpeg,image/jpg,image/gif"
                                        onChange={handleFileChange}
                                        style={{ display: 'none' }}
                                        aria-label="Upload profile photo"
                                    />

                                    {/* Camera Icon Overlay with Loading State */}
                                    <button
                                        type="button"
                                        className={`absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110 border-2 border-white disabled:opacity-50 disabled:cursor-not-allowed ${isUploading ? 'animate-pulse' : ''}`}
                                        onClick={handleCameraClick}
                                        disabled={isUploading}
                                        title={isUploading ? "Uploading..." : "Change profile photo"}
                                    >
                                        {isUploading ? (
                                            <Loader2 className="h-4 w-4 text-white animate-spin" />
                                        ) : (
                                            <Camera className="h-4 w-4 text-white" />
                                        )}
                                    </button>
                                </div>

                                {/* User Info */}
                                <div className="flex-1 text-center md:text-left space-y-3">
                                    <div className="space-y-2">
                                        <CardTitle className="text-4xl font-bold text-white drop-shadow-lg flex items-center justify-center md:justify-start gap-3">
                                            {fullName}
                                            <Sparkles className="h-6 w-6 text-yellow-300 animate-pulse" />
                                        </CardTitle>
                                        <CardDescription className="text-lg text-white/90 font-medium flex items-center justify-center md:justify-start gap-2">
                                            <Mail className="h-4 w-4" />
                                            {profile?.email || currentUser?.email || 'No email provided'}
                                        </CardDescription>
                                    </div>
                                    {profile?.role && (
                                        <Badge variant="outline"
                                            className="bg-green-700 backdrop-blur-sm text-base p-2 border-white/40 text-white hover:bg-white/30 transition-colors">
                                            <Shield className="h-3 w-3 mr-1" />
                                            {profile.role}
                                        </Badge>
                                    )}

                                    {/* Edit Profile Button */}
                                    <div className="mt-3">
                                        <Button
                                            type="button"
                                            onClick={() => navigate('/update-details')}
                                            variant="outline"
                                            className="bg-white/20 hover:bg-white/30 text-white border-white/40"
                                        >
                                            <Edit className="h-4 w-4 mr-2" />
                                            Edit Profile
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Upload Error Message */}
                            {uploadError && (
                                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                                    <p className="text-red-200 text-sm flex items-center gap-2">
                                        <span className="text-lg">⚠️</span>
                                        {uploadError}
                                    </p>
                                </div>
                            )}
                        </CardHeader>
                    </Card>

                    {/* Personal Information Card */}
                    <Card className="backdrop-blur-sm bg-white/80 border-none shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 ">
                        <CardHeader className="bg-slate-900 rounded-t-2xl">
                            <CardTitle className="flex items-center gap-2 text-2xl text-white">
                                <div className="p-2 bg-red-600 rounded-lg">
                                    <User className="h-5 w-5 text-white" />
                                </div>
                                Personal Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6 ">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Registration Number */}
                                {profile?.registrationNumber && (
                                    <div className="group space-y-2 p-4 rounded-lg hover:bg-indigo-50/50 transition-colors">
                                        <div className="flex items-center gap-2 text-black text-sm font-semibold">
                                            <Hash className="h-4 w-4" />
                                            Registration Number
                                        </div>
                                        <p className="font-bold text-lg text-gray-800">{profile.registrationNumber}</p>
                                    </div>
                                )}

                                {/* Student ID */}
                                {profile?.registrationNumber && (
                                    <div className="group space-y-2 p-4 rounded-lg hover:bg-purple-50/50 transition-colors">
                                        <div className="flex items-center gap-2 text-black text-sm font-semibold">
                                            <GraduationCap className="h-4 w-4" />
                                            Student ID
                                        </div>
                                        <p className="font-bold text-lg text-gray-800">{profile.registrationNumber}</p>
                                    </div>
                                )}

                                {/* Email */}
                                {profile?.email && (
                                    <div className="group space-y-2 p-4 rounded-lg hover:bg-pink-50/50 transition-colors">
                                        <div className="flex items-center gap-2 text-black text-sm font-semibold">
                                            <Mail className="h-4 w-4" />
                                            Email Address
                                        </div>
                                        <p className="font-bold text-lg text-gray-800">{profile.email}</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle>Enrolled Courses</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {courses?.courseResponseDtoList?.map((course) => (
                                        <div key={course.courseId} className="p-4 bg-slate-900 rounded-lg border border-slate-200">
                                            <div className="font-bold text-white">{course.courseCode}</div>
                                            <div className="text-gray-400">{course.courseName}</div>
                                        </div>
                                    ))}
                                    {(!courses?.courseResponseDtoList || courses?.courseResponseDtoList.length === 0) && (
                                        <p>No courses found.</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Profile;
