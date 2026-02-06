import Navbar from "../pages/Lab/Navbar";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { ChevronDown, FileText, FileUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { useGetCourseByCourseCodeQuery, useGetSessionByCourseCodeQuery } from "@/services/api";
import { useMemo } from "react";

const LabDetails = () => {
    const navigate = useNavigate();
    const { courseCode } = useParams();

    // Fetch course details by courseCode
    const { data: course, isLoading: courseLoading, error: courseError } = useGetCourseByCourseCodeQuery(courseCode);
    
    // Fetch sessions directly for this course
    const { data: courseSessions, isLoading: sessionsLoading, error: sessionsError } = useGetSessionByCourseCodeQuery(courseCode, {
        skip: !courseCode
    });

    // Sort sessions by experiment number
    const sortedSessions = useMemo(() => {
        if (!courseSessions) return [];
        return [...courseSessions].sort((a, b) => a.experimentNumber - b.experimentNumber);
    }, [courseSessions]);

    // Format date and time
    const formatDateTime = (date, time) => {
        if (!date || !time) return "N/A";
        const dateObj = new Date(date);
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = dateObj.toLocaleDateString('en-US', options);
        return `${formattedDate}, ${time}`;
    };

    // Loading state
    if (courseLoading || sessionsLoading) {
        return (
            <div className="flex flex-col bg-slate-200 h-screen">
                <Navbar />
                <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    <span className="ml-2 text-lg">Loading course details...</span>
                </div>
            </div>
        );
    }

    // Error state
    if (courseError || sessionsError) {
        return (
            <div className="flex flex-col bg-slate-200 h-screen">
                <Navbar />
                <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                        <p className="text-red-600 text-xl">Error loading course details</p>
                        <Button onClick={() => navigate('/student')} className="mt-4">
                            Go Back
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col bg-slate-200 min-h-screen">
            <Navbar />
            <div className="px-20 py-4">
                <h1 className="text-4xl font-bold">
                    {course?.courseCode} - {course?.courseName}
                </h1>
                {course?.academicYear && (
                    <p className="text-lg text-gray-600 mt-2">Academic Year: {course.academicYear}</p>
                )}
            </div>

            <div className="px-12 pb-8">
                <div className="bg-white p-8 rounded-xl">
                    {/* General Section */}
                    <div className="flex flex-col border-2 rounded-xl border-slate-300 bg-white mb-8">
                        <div className="flex gap-4 items-center p-6">
                            <ChevronDown />
                            <span className="text-2xl font-semibold">General</span>
                        </div>
                        <div className="flex gap-4 items-center p-4 hover:bg-slate-50 cursor-pointer">
                            <FileText className="text-slate-800" />
                            <span>Announcements</span>
                        </div>
                    </div>

                    {/* Experiments Section */}
                    <div>
                        {!sortedSessions || sortedSessions.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                <p className="text-lg">No experiments available for this course yet.</p>
                            </div>
                        ) : (
                            sortedSessions.map((session, index) => (
                                <div key={session.sessionId} className="border-2 rounded-xl border-slate-300 bg-white mb-6">
                                    <Accordion type="single" collapsible>
                                        <AccordionItem value={`item-${index}`} className="border-0">
                                            <div className="p-6">
                                                <div className="w-full flex items-center gap-8">
                                                    <AccordionTrigger className="w-10 h-10 flex justify-center items-center rounded-full bg-slate-300 px-2 py-2 hover:bg-slate-400 transition-colors">
                                                    </AccordionTrigger>
                                                    <span className="text-2xl font-bold">
                                                        Experiment {session.experimentNumber} - {session.title}
                                                    </span>
                                                </div>
                                                <AccordionContent className="mt-4 pl-16">
                                                    <div>
                                                        <button
                                                            onClick={() => {
                                                                navigate("/submission", {
                                                                    state: { 
                                                                        title: `Experiment ${session.experimentNumber} - Submission`,
                                                                        sessionId: session.sessionId,
                                                                        experimentNumber: session.experimentNumber,
                                                                        courseCode: session.courseCode
                                                                    },
                                                                });
                                                            }}
                                                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
                                                        >
                                                            <FileUp />
                                                            <span>Experiment {session.experimentNumber} - File Submission</span>
                                                        </button>
                                                        
                                                        <div className="mt-4 flex gap-8 text-sm">
                                                            <span>
                                                                <b>Opened:</b> {formatDateTime(session.date, session.startTime)}
                                                            </span>
                                                            <span>
                                                                <b>Due:</b> {formatDateTime(session.date, session.endTime)}
                                                            </span>
                                                        </div>

                                                        <div className="flex flex-col mt-6 text-sm space-y-3 bg-slate-50 p-4 rounded-md">
                                                            <p>
                                                                Please submit your files (MATLAB scripts as .m files and plots as .jpeg and the .pdf file) as a <b>zip or .rar file.</b>
                                                            </p>
                                                            <p className="mt-2">And please rename your files as:</p>
                                                            <p className="font-bold ml-4">
                                                                Your_student_number_Experiment_number.zip
                                                            </p>
                                                            <p className="ml-4 text-gray-600">
                                                                Ex: EC_2021_xxx_E{session.experimentNumber.toString().padStart(2, '0')}.zip
                                                            </p>
                                                        </div>
                                                    </div>
                                                </AccordionContent>
                                            </div>
                                        </AccordionItem>
                                    </Accordion>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LabDetails;