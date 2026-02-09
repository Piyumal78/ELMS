import Lab from "../../assets/lab.jpg";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Input } from "../../components/ui/input";
import { Search } from "lucide-react";
import { useGetCoursesQuery, useGetEnrollmentByStudentNumberAndCourseCodeQuery } from "../../services/api";
import { useSelector } from "react-redux";

const StudentDetails = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [checkingCourse, setCheckingCourse] = useState(null);

  // Get student registration number from Redux store
  const user = useSelector((state) => state.auth?.user);
  const studentNumber = user?.registrationNumber || user?.username;

  console.log('User:', user);
  console.log('Username:', user.username);
  console.log('Student Number:', studentNumber);

  const { data: courses, error, isLoading } = useGetCoursesQuery();

  // Check enrollment for selected course using RTK Query
  const { data: enrollmentData, error: enrollmentError, isLoading: checkingEnrollment } = 
    useGetEnrollmentByStudentNumberAndCourseCodeQuery(
      {
        studentNumber: studentNumber,
        courseCode: checkingCourse
      },
      {
        skip: !checkingCourse || !studentNumber // Skip query if no course selected
      }
    );

  console.log('Checking Course:', checkingCourse);
  console.log('Enrollment Data:', enrollmentData);
  console.log('Enrollment Error:', enrollmentError);

  const labdetails = [
    { semeter: "1st Semester" },
    { semeter: "2nd Semester" },
    { semeter: "3rd Semester" },
    { semeter: "4th Semester" },
    { semeter: "5th Semester" },
    { semeter: "6th Semester" },
  ];

  // useEffect to handle navigation after enrollment check
  useEffect(() => {
    console.log('useEffect triggered - checkingCourse:', checkingCourse, 'checkingEnrollment:', checkingEnrollment);
    
    if (checkingCourse && !checkingEnrollment) {
      console.log('Query completed. enrollmentData:', enrollmentData, 'enrollmentError:', enrollmentError);
      
      if (enrollmentData) {
        // Student is enrolled - go to lab details
        console.log('Student is enrolled:', enrollmentData);
        navigate(`/lab-details/${checkingCourse}`);
        setCheckingCourse(null);
      } else if (enrollmentError) {
        // Student is not enrolled (404 error) - go to enrollment page
        console.log('Student not enrolled, redirecting to enrollment page');
        navigate(`/course-enroll/${checkingCourse}`);
        setCheckingCourse(null);
      }
    }
  }, [checkingCourse, checkingEnrollment, enrollmentData, enrollmentError, navigate]);

  // Handle course card click
  const handleCourseClick = (courseCode) => {
    console.log('Course clicked:', courseCode);
    console.log('Student Number at click:', studentNumber);
    
    if (!studentNumber) {
      alert("Please login first");
      navigate('/signin');
      return;
    }

    // Set the course to check enrollment
    console.log('Setting checkingCourse to:', courseCode);
    setCheckingCourse(courseCode);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading courses...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-64 text-red-500">Error loading courses</div>;
  }

  const filteredCourses = courses?.filter((course) =>
    course.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.courseCode.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  // const filteredLabs = labdetails.filter((lab) =>
  //   lab.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //   lab.semeter.toLowerCase().includes(searchQuery.toLowerCase())
  // );

  return (
    <div className="w-full mt-8 px-16">
      <div className="flex flex-col mb-4">
        <span className="text-2xl sm:text-4xl font-bold">
          Welcome Back, {user?.registrationNumber && user.username || "User" }! 👋
        </span>
        <span className="text-sm text-gray-600 mb-4">
          Here's what's happening with your labs this semester
        </span>
        <div className="relative w-full max-w-md">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search labs by name or semester..."
            className="pl-8 bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="w-full max-w-auto max-h-auto mx-auto flex items-center justify-center">
        <div className="grid grid-cols-2 gap-4 w-[1200px] pr-2">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course, index) => (
              <div
                key={course.courseId || index}
                onClick={() => handleCourseClick(course.courseCode)}
                className="bg-white shadow-md rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow duration-200 relative"
              >
                <div className="relative">
                  {labdetails[index] && (
                    <span className="absolute top-2 left-2 bg-green-600 text-white px-3 py-1 rounded-md text-sm font-semibold z-10">
                      {labdetails[index].semeter}
                    </span>
                  )}
                  <img
                    src={Lab}
                    alt={course.courseName}
                    className="w-full h-56 object-cover rounded-md mb-2"
                  />
                </div>
                <div className="flex gap-4">
                  <h2 className="text-lg sm:text-xl font-bold mb-2 truncate">
                    {course.courseCode}
                  </h2>
                  <p className="text-lg sm:text-xl font-bold mb-2 truncate">
                    {course.courseName}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-8 text-gray-500">
              No courses found matching your search
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default StudentDetails;