import React, { useState } from 'react';
import { useGetAnnouncementsByCourseCodeQuery } from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Loader2, Bell, User, Calendar, BookOpen, LogIn } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import StudentNavbar from '../pages/Student/StudentNavbar';

const Announcements = () => {
  const [courseCode, setCourseCode] = useState('');
  const [searchCourseCode, setSearchCourseCode] = useState('');
  const { user, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const { data: announcements, isLoading, error, refetch } = useGetAnnouncementsByCourseCodeQuery(
    searchCourseCode,
    { skip: !searchCourseCode }
  );

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchCourseCode(courseCode.trim());
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gray-300  ">
        <StudentNavbar />
      <div className="max-w-4xl mx-auto mt-6">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Bell className="w-10 h-10 text-indigo-600" />
            <h1 className="text-4xl font-bold text-gray-800">Course Announcements</h1>
          </div>
          <p className="text-gray-600">Stay updated with the latest course announcements</p>
        </div>

        {/* Authentication Check */}
        {!token && (
          <Card className="mb-6 shadow-lg border-yellow-200 bg-yellow-50">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center gap-4 text-center">
                <LogIn className="w-12 h-12 text-yellow-600" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Login Required</h3>
                  <p className="text-gray-600 mb-4">
                    You need to be logged in to view announcements
                  </p>
                  <button
                    onClick={() => navigate('/signin')}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Go to Login
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search Form - Only show if authenticated */}
        {token && (
          <Card className="mb-6 shadow-lg">
            <CardContent className="pt-6">
              <form onSubmit={handleSearch} className="flex gap-3">
                <input
                  type="text"
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value)}
                  placeholder="Enter course code (e.g., BECS 11431)"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  disabled={!courseCode.trim()}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  Search
                </button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Content - Only show if authenticated */}
        {token && (
          <>
            {/* Loading State */}
            {isLoading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-semibold">Failed to fetch announcements</p>
                <p className="text-sm">
                  {error?.status === 403 && 'Authentication required. Please login first.'}
                  {error?.status === 404 && 'No announcements found.'}
                  {error?.status === 401 && 'Your session has expired. Please login again.'}
                  {!error?.status && 'Network error. Please check your connection.'}
                  {error?.status && error?.status !== 403 && error?.status !== 404 && error?.status !== 401 && 
                    `Error: ${error?.data?.message || error?.message || 'Please try again.'}`}
                </p>
                <p className="text-xs text-gray-600">
                  Status: {error?.status || 'Unknown'} | Course: {searchCourseCode}
                </p>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* No Results */}
        {!isLoading && !error && searchCourseCode && announcements?.length === 0 && (
          <Alert className="bg-yellow-50 border-yellow-200">
            <AlertDescription className="text-yellow-800">
              No announcements found for course code: <strong>{searchCourseCode}</strong>
            </AlertDescription>
          </Alert>
        )}

        {/* Announcements List */}
        {!isLoading && announcements && announcements.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                {announcements.length} Announcement{announcements.length !== 1 ? 's' : ''}
              </h2>
              <button
                onClick={() => refetch()}
                className="text-sm text-indigo-600 hover:text-indigo-800 underline"
              >
                Refresh
              </button>
            </div>

            {announcements.map((announcement) => (
              <Card key={announcement.announcementId} className="shadow-xl border-2  hover:shadow-lg transition-shadow">
                <CardHeader className="bg-slate-900 text-white">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2 flex items-center gap-2">
                        <BookOpen className="w-5 h-5" />
                        {announcement.courseTitle}
                      </CardTitle>
                      <p className="text-sm opacity-90">Course Code: {announcement.courseCode}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  {/* Announcement Content */}
                  <div className="">
                    <p className="text-lg text-gray-800 whitespace-pre-wrap ">
                      {announcement.content}
                    </p>
                  </div>

                  {/* Meta Information */}
                  <div className="border-t pt-4 flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>Posted by: <strong>{announcement.announcerName}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(announcement.createdAt)}</span>
                    </div>
                    {announcement.updatedAt !== announcement.createdAt && (
                      <div className="text-xs text-gray-500 ml-auto">
                        Updated: {formatDate(announcement.updatedAt)}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!searchCourseCode && !isLoading && token && (
          <div className="text-center py-12">
            <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">
              Enter a course code above to view announcements
            </p>
          </div>
        )}
          </>
        )}
      </div>
    </div>
  );
};

export default Announcements;
