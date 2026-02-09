import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Calendar, CheckCircle2, UserCircle } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { useCreateCourseEnrollmentMutation, useGetCourseByCourseCodeQuery } from '../../services/api';
import { useParams, useNavigate } from 'react-router-dom';
import CourseEnrolle from '../../assets/enrolleImg.jpg';
import {z} from 'zod';

const coursesEnrollSchema = z.object({
    studentId: z.string().min(3, 'Student ID must be at least 3 characters'),
    courseId: z.string().min(2, 'Course ID must be at least 2 characters').regex(/^[A-Z0-9\s]+$/, 'Course ID must contain only capital letters, numbers, and spaces'),
});

const CourseEnroll = () => {
    const [studentId, setStudentId] = useState('');
    const [courseId, setCourseId] = useState('');
    const [studentIdError, setStudentIdError] = useState('');
    const [courseIdError, setCourseIdError] = useState('');
    const [enrollDialog, setEnrollDialog] = useState({ open: false });
    const [enrolledCourses, setEnrolledCourses] = useState([]);

    const { courseCode } = useParams();
    const navigate = useNavigate();
    const [createEnrollment, { isLoading: isEnrolling }] = useCreateCourseEnrollmentMutation();
    
    // Auto-populate courseId if courseCode is in URL
    useEffect(() => {
        if (courseCode && !courseId) {
            setCourseId(courseCode.toUpperCase());
        }
    }, [courseCode]);
    
    // Fetch course details based on entered courseId
    const shouldFetchCourse = courseId.trim().length >= 2 && /^[A-Z0-9\s]+$/.test(courseId.trim());
    const { data: courseDetails, isLoading, error } = useGetCourseByCourseCodeQuery(
        courseId.trim(),
        { skip: !shouldFetchCourse }
    );

    // Validate student ID (alphanumeric)
    const validateStudentId = (value) => {
        if (!value.trim()) {
            setStudentIdError('Student ID is required');
            return false;
        }
        if (value.length < 3) {
            setStudentIdError('Student ID must be at least 3 characters');
            return false;
        }
        setStudentIdError('');
        return true;
    };

    // Validate course ID (capital letters, numbers, and spaces)
    const validateCourseId = (value) => {
        if (!value.trim()) {
            setCourseIdError('Course ID is required');
            return false;
        }
        const courseCodeRegex = /^[A-Z0-9\s]+$/;
        if (!courseCodeRegex.test(value)) {
            setCourseIdError('Course ID must contain only capital letters, numbers, and spaces');
            return false;
        }
        if (value.trim().length < 2) {
            setCourseIdError('Course ID must be at least 2 characters');
            return false;
        }
        setCourseIdError('');
        return true;
    };

    const handleCourseIdChange = (e) => {
        const value = e.target.value.toUpperCase();
        setCourseId(value);
        if (value) {
            validateCourseId(value);
        } else {
            setCourseIdError('');
        }
    };

    const handleStudentIdChange = (e) => {
        const value = e.target.value;
        setStudentId(value);
        if (value) {
            validateStudentId(value);
        } else {
            setStudentIdError('');
        }
    };

    const handleEnrollClick = () => {
        const isStudentIdValid = validateStudentId(studentId);
        const isCourseIdValid = validateCourseId(courseId);

        if (isStudentIdValid && isCourseIdValid) {
            // Check if already enrolled
            const alreadyEnrolled = enrolledCourses.find(
                e => e.studentId === studentId && e.courseId === courseId
            );

            if (alreadyEnrolled) {
                alert('You are already enrolled in this course!');
                return;
            }

            setEnrollDialog({ open: true });
        }
    };

    const confirmEnroll = async () => {
        try {
            console.log('Enrollment started');
            console.log('Student ID:', studentId.trim());
            console.log('Course ID (entered):', courseId.trim());
            console.log('Course Details:', courseDetails);
            
            // Validate using Zod schema
            const validationResult = coursesEnrollSchema.safeParse({
                studentId: studentId.trim(),
                courseId: courseId.trim()
            });

            if (!validationResult.success) {
                const errors = validationResult.error.errors.map(err => err.message).join(', ');
                alert(errors);
                return;
            }

            if (!courseDetails?.courseId) {
                console.error('Course details missing:', { courseDetails, courseId });
                alert(`Course "${courseId.trim()}" not found. Please enter a valid course code.`);
                return;
            }

            const enrollmentPayload = {
                studentNumber: studentId.trim(),
                courseCode: courseId.trim(),
            };

            console.log('Sending enrollment payload:', enrollmentPayload);
            
            // Send to backend
            const response = await createEnrollment(enrollmentPayload).unwrap();

            console.log('Enrollment response:', response);

            // Add to enrolled courses list on success
            setEnrolledCourses([...enrolledCourses, {
                studentId: studentId.trim(),
                courseId: courseId.trim(),
                enrollmentDate: new Date().toISOString().split('T')[0]
            }]);

            // Reset form
            setStudentId('');
            setCourseId('');
            setEnrollDialog({ open: false });

            alert('Successfully enrolled in course!');
            
            // Navigate to lab details page with the course code
            navigate(`/lab-details/${courseId.trim()}`);

        } catch (error) {
            console.error('Enrollment failed:', error);
            
            // Better error messages
            if (error?.data?.message) {
                // Show the actual backend error message
                alert(error.data.message);
            } else if (error.status === 404) {
                alert('Resource not found. Please check your student ID and course code.');
            } else if (error.status === 401 || error.status === 403) {
                alert('Authentication failed. Please login again.');
                navigate('/signin');
            } else if (error.status === 400) {
                alert('Invalid request. Please check your input.');
            } else {
                alert('Failed to enroll. Please try again.');
            }
        }
    };

    const cancelEnroll = () => {
        setEnrollDialog({ open: false });
    };

    const handleUnenroll = (index) => {
        if (window.confirm('Are you sure you want to unenroll from this course?')) {
            setEnrolledCourses(enrolledCourses.filter((_, i) => i !== index));
        }
    };

    return (
        <div className="space-y-6 p-6 flex justify-center items-center flex-col bg-slate-900 w-screen h-screen">
            {/* Header */}
            <div className="space-y-3 py-6 px-28 bg-slate-200 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-2">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                        Course Enrollment
                    </h1>
                </div>
                <p className="text-gray-500 font-medium">
                    Enter your Student ID and Course ID to enroll in this course.
                </p>
            </div>

            {/* Course Details and Enrollment Form */}
            <div className="flex flex-row justify-center items-center gap-12 bg-slate-400 p-10 rounded-lg">
                {/* Course Details Card - Show only when course is loaded */}
                {courseDetails && (
                    <div className="w-88 mt-8 bg-white rounded-2xl shadow-lg">
                        <img src={CourseEnrolle} alt="Enrollment" className="w-88 h-52 rounded-t-2xl object-cover" />
                        <div className="mt-4 px-4 mb-8">
                            <div className="flex flex-col mb-4">
                                <h2 className="text-lg sm:text-xl font-bold truncate">
                                    {courseDetails.courseCode}
                                </h2>
                                <p className="text-lg sm:text-xl font-bold mb-2 truncate">
                                    {courseDetails.courseName}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                    {courseDetails.lecturer?.name?.charAt(0) || 'T'}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-800">
                                        {courseDetails.lecturer?.name || 'N/A'}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Lecturer
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Enrollment Form */}
                <Card className="max-w-2xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-primary" />
                            Enroll in Course
                        </CardTitle>
                        <CardDescription>
                            Fill in your details to enroll in a new course
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="studentId" className="flex items-center gap-2">
                                <UserCircle className="h-4 w-4" />
                                Student ID
                            </Label>
                            <Input
                                id="studentId"
                                type="text"
                                placeholder="Enter your student ID (e.g., STU001, 2021CS001)"
                                value={studentId}
                                onChange={handleStudentIdChange}
                                className={studentIdError ? 'border-red-500' : ''}
                            />
                            {studentIdError && (
                                <p className="text-sm text-red-500">{studentIdError}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="courseId" className="flex items-center gap-2">
                                <BookOpen className="h-4 w-4" />
                                Course ID
                            </Label>
                            <Input
                                id="courseId"
                                type="text"
                                placeholder="Enter course ID (e.g., BECS 11431, CS 101)"
                                value={courseId}
                                onChange={handleCourseIdChange}
                                className={courseIdError ? 'border-red-500' : ''}
                                maxLength={20}
                            />
                            {courseIdError && (
                                <p className="text-sm text-red-500">{courseIdError}</p>
                            )}
                            {isLoading && shouldFetchCourse && (
                                <p className="text-sm text-blue-500">Loading course details...</p>
                            )}
                            {error && shouldFetchCourse && (
                                <p className="text-sm text-red-500">Course not found with this code</p>
                            )}
                            <p className="text-xs text-muted-foreground">
                                Course ID can contain capital letters, numbers, and spaces (e.g., BECS 11431)
                            </p>
                        </div>

                        <Button
                            onClick={handleEnrollClick}
                            disabled={!studentId || !courseId || studentIdError || courseIdError || isEnrolling || !courseDetails || isLoading}
                            className="w-full"
                            size="lg"
                        >
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            {isEnrolling ? 'Enrolling...' : isLoading ? 'Loading course...' : !courseDetails ? 'Enter valid course code' : 'Enroll in Course'}
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Enrolled Courses Summary */}
            {enrolledCourses.length > 0 && (
                <Card className="border-green-200 bg-green-50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-green-800">
                            <CheckCircle2 className="h-5 w-5" />
                            Your Enrolled Courses ({enrolledCourses.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {enrolledCourses.map((enrollment, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-4 bg-white rounded-lg border"
                                >
                                    <div className="flex items-center gap-4">
                                        <Badge variant="outline" className="bg-green-100 text-green-800">
                                            {enrollment.courseId}
                                        </Badge>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <UserCircle className="h-4 w-4 text-muted-foreground" />
                                                <span className="font-medium">Student: {enrollment.studentId}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm text-muted-foreground">
                                                    Enrolled: {enrollment.enrollmentDate}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleUnenroll(index)}
                                    >
                                        Unenroll
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Enrollment Confirmation Dialog */}
            <Dialog open={enrollDialog.open} onOpenChange={(open) => !open && cancelEnroll()}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-primary" />
                            Confirm Course Enrollment
                        </DialogTitle>
                        <DialogDescription>
                            Please review your enrollment details before confirming.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-3">
                            <div className="p-4 bg-muted rounded-lg space-y-3">
                                <div className="flex items-center gap-3">
                                    <UserCircle className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Student ID</p>
                                        <p className="text-lg font-semibold">{studentId}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <BookOpen className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Course ID</p>
                                        <p className="text-lg font-semibold">{courseId}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Calendar className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Enrollment Date</p>
                                        <p className="text-lg font-semibold">{new Date().toISOString().split('T')[0]}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-sm text-blue-800">
                                    <strong>Note:</strong> By confirming, you will be enrolled in this course.
                                    Make sure the information is correct before proceeding.
                                </p>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={cancelEnroll}>
                            Cancel
                        </Button>
                        <Button
                            onClick={confirmEnroll}
                            className="bg-green-600 hover:bg-green-700"
                            disabled={isEnrolling}
                        >
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            {isEnrolling ? 'Enrolling...' : 'Confirm Enrollment'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CourseEnroll;
