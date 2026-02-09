import React from 'react';
import { useSelector } from 'react-redux';
import { useGetCurrentUserProfileQuery } from '../services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import { Separator } from '../components/ui/separator';
import { Mail, Phone, MapPin, Calendar, User, GraduationCap, Hash, Shield, Edit, RefreshCw, Sparkles } from 'lucide-react';

const Profile = () => {
  // Get current user from Redux store
  const currentUser = useSelector((state) => state.auth.user);
  
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      <div className="container mx-auto max-w-5xl space-y-6">
        
        {/* Profile Header Card with Gradient */}
        <Card className="relative overflow-hidden border-none shadow-2xl hover:shadow-3xl transition-shadow duration-300">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-slate-900 opacity-90" />
          
          <CardHeader className="relative z-10">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Avatar with Ring */}
              <div className="relative">
                <div className="absolute inset-0 bg-white rounded-full blur-md opacity-50" />
                <Avatar className="h-28 w-28 relative border-4 border-white shadow-xl ring-4 ring-white/20">
                  <AvatarImage src={profile?.profilePicture} alt={fullName} />
                  <AvatarFallback className="text-3xl bg-slate-900 text-white font-bold">
                    {getInitials(fullName)}
                  </AvatarFallback>
                </Avatar>
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
                    className="bg-green-700 backdrop-blur-sm border-white/40 text-white hover:bg-white/30 transition-colors">
                    <Shield className="h-3 w-3 mr-1" />
                    {profile.role}
                  </Badge>
                )}
              </div>
            </div>
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

              {/* Phone */}
              {profile?.phoneNumber && (
                <div className="group space-y-2 p-4 rounded-lg hover:bg-indigo-50/50 transition-colors">
                  <div className="flex items-center gap-2 text-indigo-600 text-sm font-semibold">
                    <Phone className="h-4 w-4" />
                    Phone Number
                  </div>
                  <p className="font-bold text-lg text-gray-800">{profile.phoneNumber}</p>
                </div>
              )}

              {/* Address */}
              {profile?.address && (
                <div className="group space-y-2 p-4 rounded-lg hover:bg-purple-50/50 transition-colors md:col-span-2">
                  <div className="flex items-center gap-2 text-purple-600 text-sm font-semibold">
                    <MapPin className="h-4 w-4" />
                    Address
                  </div>
                  <p className="font-bold text-lg text-gray-800">{profile.address}</p>
                </div>
              )}

              {/* Date of Birth */}
              {profile?.dateOfBirth && (
                <div className="group space-y-2 p-4 rounded-lg hover:bg-pink-50/50 transition-colors">
                  <div className="flex items-center gap-2 text-pink-600 text-sm font-semibold">
                    <Calendar className="h-4 w-4" />
                    Date of Birth
                  </div>
                  <p className="font-bold text-lg text-gray-800">
                    {new Date(profile.dateOfBirth).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Academic Information Card */}
        {(profile?.department || profile?.batch || profile?.faculty || profile?.degree) && (
          <Card className="backdrop-blur-sm bg-white/80 border-none shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="bg-gradient-to-r from-purple-500/10 to-pink-500/10">
              <CardTitle className="flex items-center gap-2 text-2xl">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                Academic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {profile?.faculty && (
                  <div className="group space-y-2 p-4 rounded-lg hover:bg-purple-50/50 transition-colors">
                    <p className="text-purple-600 text-sm font-semibold">Faculty</p>
                    <p className="font-bold text-lg text-gray-800">{profile.faculty}</p>
                  </div>
                )}

                {profile?.department && (
                  <div className="group space-y-2 p-4 rounded-lg hover:bg-pink-50/50 transition-colors">
                    <p className="text-pink-600 text-sm font-semibold">Department</p>
                    <p className="font-bold text-lg text-gray-800">{profile.department}</p>
                  </div>
                )}

                {profile?.degree && (
                  <div className="group space-y-2 p-4 rounded-lg hover:bg-indigo-50/50 transition-colors">
                    <p className="text-indigo-600 text-sm font-semibold">Degree Program</p>
                    <p className="font-bold text-lg text-gray-800">{profile.degree}</p>
                  </div>
                )}

                {profile?.batch && (
                  <div className="group space-y-2 p-4 rounded-lg hover:bg-purple-50/50 transition-colors">
                    <p className="text-purple-600 text-sm font-semibold">Batch</p>
                    <p className="font-bold text-lg text-gray-800">{profile.batch}</p>
                  </div>
                )}

                {profile?.level && (
                  <div className="group space-y-2 p-4 rounded-lg hover:bg-pink-50/50 transition-colors">
                    <p className="text-pink-600 text-sm font-semibold">Current Level</p>
                    <p className="font-bold text-lg text-gray-800">{profile.level}</p>
                  </div>
                )}

                {profile?.semester && (
                  <div className="group space-y-2 p-4 rounded-lg hover:bg-indigo-50/50 transition-colors">
                    <p className="text-indigo-600 text-sm font-semibold">Current Semester</p>
                    <p className="font-bold text-lg text-gray-800">{profile.semester}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Account Information Card */}
        <Card className="backdrop-blur-sm bg-white/80 border-none shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
            <CardTitle className="text-2xl">Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {profile?.createdAt && (
                <div className="group space-y-2 p-4 rounded-lg hover:bg-indigo-50/50 transition-colors">
                  <p className="text-indigo-600 text-sm font-semibold">Member Since</p>
                  <p className="font-bold text-lg text-gray-800">
                    {new Date(profile.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              )}

              {profile?.updatedAt && (
                <div className="group space-y-2 p-4 rounded-lg hover:bg-purple-50/50 transition-colors">
                  <p className="text-purple-600 text-sm font-semibold">Last Updated</p>
                  <p className="font-bold text-lg text-gray-800">
                    {new Date(profile.updatedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              )}
            </div>

            <Separator className="my-6 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

            <div className="flex flex-wrap gap-3">
              <Button 
                onClick={refetch} 
                variant="outline"
                className="flex-1 min-w-[160px] border-2 border-indigo-500 text-indigo-600 hover:bg-indigo-50 hover:scale-105 transition-all duration-200 font-semibold"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Profile
              </Button>
              <Button 
                variant="default"
                className="flex-1 min-w-[160px] bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 font-semibold"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
