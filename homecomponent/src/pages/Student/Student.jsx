import StudentNavbar from "./StudentNavbar";
import StudentDetails from "./StudentDetails";
const Student = () => {
  return (
        <div className="min-h-screen bg-gray-300">
            <StudentNavbar />
            <StudentDetails />
        </div>
    );
};

export default Student;