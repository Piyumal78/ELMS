import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useGetCurrentUserProfileQuery, useUpdateStudentMutation } from '../../services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Skeleton } from '../../components/ui/skeleton';
import { User, Mail, Lock, Eye, EyeOff, Save, X, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
import StudentNavbar from './StudentNavbar';

const StudentDetailsUpdate = () => {
    const currentUser = useSelector((state) => state.auth.user);
    const navigate = useNavigate();

    // Fetch current user profile
    const {
        data: profile,
        isLoading: isLoadingProfile,
        isError: isProfileError,
        error: profileError,
    } = useGetCurrentUserProfileQuery(
        currentUser?.username || currentUser?.registrationNumber,
        {
            skip: !currentUser?.username && !currentUser?.registrationNumber,
        }
    );

    // Update student mutation
    const [updateStudent, { isLoading: isUpdating, isSuccess, isError: isUpdateError, error: updateError }] = useUpdateStudentMutation();

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        existingPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    // UI state
    const [showExistingPassword, setShowExistingPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');

    // Initialize form with profile data
    useEffect(() => {
        if (profile) {
            setFormData((prev) => ({
                ...prev,
                name: profile.name || '',
                email: profile.email || '',
            }));
        }
    }, [profile]);

    // Clear success message after update
    useEffect(() => {
        if (isSuccess) {
            setSuccessMessage('Profile updated successfully!');
            // Clear passwords
            setFormData((prev) => ({
                ...prev,
                existingPassword: '',
                newPassword: '',
                confirmPassword: '',
            }));
            // Hide success message after 5 seconds
            const timer = setTimeout(() => {
                setSuccessMessage('');
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [isSuccess]);

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Clear validation error for this field
        if (validationErrors[name]) {
            setValidationErrors((prev) => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    // Validate form
    const validateForm = () => {
        const errors = {};

        // Name validation
        if (!formData.name.trim()) {
            errors.name = 'Name is required';
        } else if (formData.name.length < 2 || formData.name.length > 50) {
            errors.name = 'Name must be between 2 and 50 characters';
        } else if (!/^[A-Za-z .]{2,50}$/.test(formData.name)) {
            errors.name = 'Name can only contain letters, spaces, and dots';
        }

        // Email validation
        if (!formData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/.test(formData.email)) {
            errors.email = 'Invalid email format';
        } else if (formData.email.length > 100) {
            errors.email = 'Email cannot exceed 100 characters';
        }

        // Password validation
        if (!formData.existingPassword) {
            errors.existingPassword = 'Existing password is required';
        }

        if (!formData.newPassword) {
            errors.newPassword = 'New password is required';
        } else if (formData.newPassword.length < 6) {
            errors.newPassword = 'New password must be at least 6 characters';
        }

        if (!formData.confirmPassword) {
            errors.confirmPassword = 'Please confirm your new password';
        } else if (formData.newPassword !== formData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');

        if (!validateForm()) {
            return;
        }

        if (!profile?.userId) {
            setValidationErrors({ general: 'Unable to identify student. Please refresh the page.' });
            return;
        }

        try {
            await updateStudent({
                studentId: profile.userId,
                studentData: {
                    name: formData.name.trim(),
                    email: formData.email.trim(),
                    existingPassword: formData.existingPassword,
                    newPassword: formData.newPassword,
                },
            }).unwrap();
        } catch (err) {
            console.error('Update error:', err);
        }
    };

    // Handle cancel
    const handleCancel = () => {
        navigate('/profile');
    };

    // Loading state
    if (isLoadingProfile) {
        return (
            <div>
                <StudentNavbar />
                <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
                    <div className="container mx-auto max-w-2xl">
                        <Card className="backdrop-blur-sm bg-white/80 border-none shadow-xl">
                            <CardHeader>
                                <Skeleton className="h-8 w-64 mb-2" />
                                <Skeleton className="h-5 w-48" />
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Skeleton className="h-12 w-full" />
                                <Skeleton className="h-12 w-full" />
                                <Skeleton className="h-12 w-full" />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (isProfileError) {
        return (
            <div>
                <StudentNavbar />
                <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
                    <div className="container mx-auto max-w-2xl">
                        <Card className="backdrop-blur-sm bg-white/80 border-red-200 shadow-xl">
                            <CardHeader>
                                <CardTitle className="text-red-600 flex items-center gap-2">
                                    <AlertCircle className="h-6 w-6" />
                                    Error Loading Profile
                                </CardTitle>
                                <CardDescription className="text-base">
                                    {profileError?.data?.message || 'Failed to load profile data. Please try again.'}
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <StudentNavbar />
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
                <div className="container mx-auto max-w-2xl space-y-6">
                    {/* Back Button */}
                    <Button
                        variant="outline"
                        onClick={handleCancel}
                        className="flex items-center gap-2 hover:scale-105 transition-transform"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Profile
                    </Button>

                    {/* Update Form Card */}
                    <Card className="backdrop-blur-sm bg-white/80 border-none shadow-2xl">
                        <CardHeader className="bg-slate-900 text-white rounded-t-2xl">
                            <CardTitle className="flex items-center gap-2 text-2xl">
                                <User className="h-6 w-6" />
                                Update Profile Details
                            </CardTitle>
                            <CardDescription className="text-white/90">
                                Update your personal information and password
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="p-6">
                            {/* Success Message */}
                            {successMessage && (
                                <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-3">
                                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                                    <p className="text-green-600 font-medium">{successMessage}</p>
                                </div>
                            )}

                            {/* Update Error Message */}
                            {isUpdateError && (
                                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3">
                                    <AlertCircle className="h-5 w-5 text-red-600" />
                                    <p className="text-red-600 font-medium">
                                        {updateError?.data?.message || 'Failed to update profile. Please try again.'}
                                    </p>
                                </div>
                            )}

                            {/* General Validation Error */}
                            {validationErrors.general && (
                                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3">
                                    <AlertCircle className="h-5 w-5 text-red-600" />
                                    <p className="text-red-600 font-medium">{validationErrors.general}</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Name Field */}
                                <div className="space-y-2">
                                    <label htmlFor="name" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                        <User className="h-4 w-4 text-indigo-600" />
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${
                                            validationErrors.name ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="Enter your full name"
                                    />
                                    {validationErrors.name && (
                                        <p className="text-red-600 text-sm flex items-center gap-1">
                                            <AlertCircle className="h-3 w-3" />
                                            {validationErrors.name}
                                        </p>
                                    )}
                                </div>

                                {/* Email Field */}
                                <div className="space-y-2">
                                    <label htmlFor="email" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                        <Mail className="h-4 w-4 text-purple-600" />
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all ${
                                            validationErrors.email ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="Enter your email"
                                    />
                                    {validationErrors.email && (
                                        <p className="text-red-600 text-sm flex items-center gap-1">
                                            <AlertCircle className="h-3 w-3" />
                                            {validationErrors.email}
                                        </p>
                                    )}
                                </div>

                                {/* Password Section Divider */}
                                <div className="pt-4 border-t-2 border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                        <Lock className="h-5 w-5 text-indigo-600" />
                                        Change Password
                                    </h3>
                                </div>

                                {/* Existing Password Field */}
                                <div className="space-y-2">
                                    <label htmlFor="existingPassword" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                        <Lock className="h-4 w-4 text-gray-600" />
                                        Current Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showExistingPassword ? 'text' : 'password'}
                                            id="existingPassword"
                                            name="existingPassword"
                                            value={formData.existingPassword}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 pr-12 border-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${
                                                validationErrors.existingPassword ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="Enter your current password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowExistingPassword(!showExistingPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                        >
                                            {showExistingPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                    {validationErrors.existingPassword && (
                                        <p className="text-red-600 text-sm flex items-center gap-1">
                                            <AlertCircle className="h-3 w-3" />
                                            {validationErrors.existingPassword}
                                        </p>
                                    )}
                                </div>

                                {/* New Password Field */}
                                <div className="space-y-2">
                                    <label htmlFor="newPassword" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                        <Lock className="h-4 w-4 text-green-600" />
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showNewPassword ? 'text' : 'password'}
                                            id="newPassword"
                                            name="newPassword"
                                            value={formData.newPassword}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 pr-12 border-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all ${
                                                validationErrors.newPassword ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="Enter new password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                        >
                                            {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                    {validationErrors.newPassword && (
                                        <p className="text-red-600 text-sm flex items-center gap-1">
                                            <AlertCircle className="h-3 w-3" />
                                            {validationErrors.newPassword}
                                        </p>
                                    )}
                                </div>

                                {/* Confirm Password Field */}
                                <div className="space-y-2">
                                    <label htmlFor="confirmPassword" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                        <Lock className="h-4 w-4 text-green-600" />
                                        Confirm New Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 pr-12 border-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all ${
                                                validationErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="Confirm new password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                        >
                                            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                    {validationErrors.confirmPassword && (
                                        <p className="text-red-600 text-sm flex items-center gap-1">
                                            <AlertCircle className="h-3 w-3" />
                                            {validationErrors.confirmPassword}
                                        </p>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-4 pt-4">
                                    <Button
                                        type="submit"
                                        disabled={isUpdating}
                                        className="flex-1 bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-lg font-semibold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                    >
                                        {isUpdating ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                                                Updating...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="h-5 w-5 mr-2" />
                                                Save Changes
                                            </>
                                        )}
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={handleCancel}
                                        variant="outline"
                                        className="flex-1 border-2 border-gray-300 hover:bg-gray-100 py-3 rounded-lg font-semibold transition-all hover:scale-105"
                                    >
                                        <X className="h-5 w-5 mr-2" />
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default StudentDetailsUpdate;
