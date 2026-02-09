import { useState } from "react";
import { Calendar, Clock, MapPin, Users, BookOpen, CheckCircle, XCircle } from "lucide-react";
import { Labnavbar } from "./Labnavbar";

const Lab = () => {
  const [selectedTab, setSelectedTab] = useState("all");
  const [bookedLabs, setBookedLabs] = useState([]);

  const handleBookNow = (sessionId) => {
    const session = labSessions.find(s => s.id === sessionId);
    if (session && session.status === "Available") {
      // Update the session status
      const updatedSession = { ...session, status: "Booked" };
      setBookedLabs([...bookedLabs, sessionId]);
      
      // Show confirmation message
      alert(`Successfully booked: ${session.labName}\nDate: ${new Date(session.date).toLocaleDateString()}\nTime: ${session.time}`);
    }
  };

  const labSessions = [
    {
      id: 1,
      labName: "Lab Session 1 - Introduction to Programming",
      date: "2025-12-02",
      time: "10:00 AM - 12:00 PM",
      room: "Lab Room 301",
      instructor: "Dr. Smith",
      capacity: 30,
      enrolled: 28,
      status: "Completed",
      week: "Week 1"
    },
    {
      id: 2,
      labName: "Lab Session 2 - Variables and Data Types",
      date: "2025-12-09",
      time: "10:00 AM - 12:00 PM",
      room: "Lab Room 301",
      instructor: "Dr. Smith",
      capacity: 30,
      enrolled: 27,
      status: "Completed",
      week: "Week 2"
    },
    {
      id: 3,
      labName: "Lab Session 3 - Control Structures",
      date: "2025-12-16",
      time: "10:00 AM - 12:00 PM",
      room: "Lab Room 301",
      instructor: "Dr. Smith",
      capacity: 30,
      enrolled: 29,
      status: "Booked",
      week: "Week 3"
    },
    {
      id: 4,
      labName: "Lab Session 4 - Functions and Methods",
      date: "2025-12-23",
      time: "10:00 AM - 12:00 PM",
      room: "Lab Room 301",
      instructor: "Dr. Smith",
      capacity: 30,
      enrolled: 25,
      status: "Booked",
      week: "Week 4"
    },
    {
      id: 5,
      labName: "Lab Session 5 - Arrays and Collections",
      date: "2025-12-30",
      time: "10:00 AM - 12:00 PM",
      room: "Lab Room 301",
      instructor: "Dr. Smith",
      capacity: 30,
      enrolled: 26,
      status: "Booked",
      week: "Week 5"
    },
    {
      id: 6,
      labName: "Lab Session 6 - String Manipulation",
      date: "2026-01-06",
      time: "10:00 AM - 12:00 PM",
      room: "Lab Room 301",
      instructor: "Dr. Smith",
      capacity: 30,
      enrolled: 24,
      status: "Available",
      week: "Week 6"
    },
    {
      id: 7,
      labName: "Lab Session 7 - Object-Oriented Programming",
      date: "2026-01-13",
      time: "10:00 AM - 12:00 PM",
      room: "Lab Room 301",
      instructor: "Dr. Smith",
      capacity: 30,
      enrolled: 22,
      status: "Available",
      week: "Week 7"
    },
    {
      id: 8,
      labName: "Lab Session 8 - Inheritance and Polymorphism",
      date: "2026-01-20",
      time: "10:00 AM - 12:00 PM",
      room: "Lab Room 301",
      instructor: "Dr. Smith",
      capacity: 30,
      enrolled: 20,
      status: "Available",
      week: "Week 8"
    },
    {
      id: 9,
      labName: "Lab Session 9 - Exception Handling",
      date: "2026-01-27",
      time: "10:00 AM - 12:00 PM",
      room: "Lab Room 301",
      instructor: "Dr. Smith",
      capacity: 30,
      enrolled: 18,
      status: "Available",
      week: "Week 9"
    },
    {
      id: 10,
      labName: "Lab Session 10 - File I/O Operations",
      date: "2026-02-03",
      time: "10:00 AM - 12:00 PM",
      room: "Lab Room 301",
      instructor: "Dr. Smith",
      capacity: 30,
      enrolled: 19,
      status: "Available",
      week: "Week 10"
    },
    {
      id: 11,
      labName: "Lab Session 11 - Database Connectivity",
      date: "2026-02-10",
      time: "10:00 AM - 12:00 PM",
      room: "Lab Room 301",
      instructor: "Dr. Smith",
      capacity: 30,
      enrolled: 21,
      status: "Available",
      week: "Week 11"
    },
    {
      id: 12,
      labName: "Lab Session 12 - Web Development Basics",
      date: "2026-02-17",
      time: "10:00 AM - 12:00 PM",
      room: "Lab Room 301",
      instructor: "Dr. Smith",
      capacity: 30,
      enrolled: 17,
      status: "Available",
      week: "Week 12"
    },
    {
      id: 13,
      labName: "Lab Session 13 - API Development",
      date: "2026-02-24",
      time: "10:00 AM - 12:00 PM",
      room: "Lab Room 301",
      instructor: "Dr. Smith",
      capacity: 30,
      enrolled: 16,
      status: "Available",
      week: "Week 13"
    },
    {
      id: 14,
      labName: "Lab Session 14 - Testing and Debugging",
      date: "2026-03-03",
      time: "10:00 AM - 12:00 PM",
      room: "Lab Room 301",
      instructor: "Dr. Smith",
      capacity: 30,
      enrolled: 15,
      status: "Available",
      week: "Week 14"
    },
    {
      id: 15,
      labName: "Lab Session 15 - Final Project Presentation",
      date: "2026-03-10",
      time: "10:00 AM - 12:00 PM",
      room: "Lab Room 301",
      instructor: "Dr. Smith",
      capacity: 30,
      enrolled: 14,
      status: "Available",
      week: "Week 15"
    }
  ];

  const allSessions = labSessions.map(session => ({
    ...session,
    status: bookedLabs.includes(session.id) ? "Booked" : session.status
  }));
  const upcomingSessions = allSessions.filter(session => session.status === "Booked");
  const completedSessions = allSessions.filter(session => session.status === "Completed");
  const availableSessions = allSessions.filter(session => session.status === "Available");

  const getStatusColor = (status) => {
    switch(status) {
      case "Booked": return "text-blue-600 bg-blue-50";
      case "Completed": return "text-green-600 bg-green-50";
      case "Available": return "text-gray-600 bg-gray-50";
      default: return "text-gray-600";
    }
  };

  const renderSessions = (sessions) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sessions.map((session) => (
          <div key={session.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
            <div className="bg-gradient-to-r from-teal-400 to-blue-500 p-4">
              <h3 className="text-white font-bold text-lg">{session.labName}</h3>
              <span className="inline-block mt-2 px-3 py-1 bg-white text-blue-600 rounded-full text-xs font-semibold">
                {session.week}
              </span>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-center text-gray-700">
                <Calendar className="w-5 h-5 mr-3 text-blue-500" />
                <span>{new Date(session.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              
              <div className="flex items-center text-gray-700">
                <Clock className="w-5 h-5 mr-3 text-blue-500" />
                <span>{session.time}</span>
              </div>
              
              <div className="flex items-center text-gray-700">
                <MapPin className="w-5 h-5 mr-3 text-blue-500" />
                <span>{session.room}</span>
              </div>
              
              <div className="flex items-center text-gray-700">
                <BookOpen className="w-5 h-5 mr-3 text-blue-500" />
                <span>Instructor: {session.instructor}</span>
              </div>
              
              <div className="flex items-center text-gray-700">
                <Users className="w-5 h-5 mr-3 text-blue-500" />
                <span>Enrolled: {session.enrolled}/{session.capacity}</span>
                <div className="ml-auto">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${(session.enrolled / session.capacity) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(session.status)}`}>
                  {session.status === "Completed" && <CheckCircle className="w-4 h-4 mr-2" />}
                  {session.status === "Booked" && <Clock className="w-4 h-4 mr-2" />}
                  {session.status === "Available" && <XCircle className="w-4 h-4 mr-2" />}
                  {session.status}
                </span>
                
                {session.status === "Available" && (
                  <button 
                    onClick={() => handleBookNow(session.id)}
                    className="ml-auto float-right px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors active:bg-blue-800"
                  >
                    Book Now
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full px-4 py-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">Semester Lab Sessions</h1>
          <p className="text-gray-600">Complete overview of all 15 lab sessions for this semester</p>
        </div>

        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex border-b overflow-x-auto">
            <button
              onClick={() => setSelectedTab("all")}
              className={`px-6 py-4 text-sm font-semibold transition-colors whitespace-nowrap ${
                selectedTab === "all"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              All Sessions ({allSessions.length})
            </button>
            <button
              onClick={() => setSelectedTab("upcoming")}
              className={`px-6 py-4 text-sm font-semibold transition-colors whitespace-nowrap ${
                selectedTab === "upcoming"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Upcoming ({upcomingSessions.length})
            </button>
            <button
              onClick={() => setSelectedTab("completed")}
              className={`px-6 py-4 text-sm font-semibold transition-colors whitespace-nowrap ${
                selectedTab === "completed"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Completed ({completedSessions.length})
            </button>
            <button
              onClick={() => setSelectedTab("available")}
              className={`px-6 py-4 text-sm font-semibold transition-colors whitespace-nowrap ${
                selectedTab === "available"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Available ({availableSessions.length})
            </button>
          </div>
        </div>

        <div className="mt-6">
          {selectedTab === "all" && renderSessions(allSessions)}
          {selectedTab === "upcoming" && renderSessions(upcomingSessions)}
          {selectedTab === "completed" && renderSessions(completedSessions)}
          {selectedTab === "available" && renderSessions(availableSessions)}
        </div>

        {((selectedTab === "upcoming" && upcomingSessions.length === 0) ||
          (selectedTab === "completed" && completedSessions.length === 0) ||
          (selectedTab === "available" && availableSessions.length === 0)) && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No {selectedTab} sessions found</p>
          </div>
        )}
      </div>
      <Labnavbar />
    </div>
  );
};

export default Lab;