import Lab from "../../assets/lab.jpg";
import { useNavigate } from "react-router-dom"; 

const StudentDetails = () => {
  const navigate = useNavigate();
  const labdetails = [
    { semeter: "1st Semester", name: "BECS202 - Data Structures Lab", path: "/lab1" },
    { semeter: "1st Semester", name: "BECS200 - Programming Fundamentals Lab", path: "/lab2" },
    { semeter: "2nd Semester", name: "BECS204 - Digital Logic Design Lab", path: "/lab3" },
    { semeter: "2nd Semester", name: "BECS214 - Computer Networks Lab", path: "/lab4" },
    { semeter: "3rd Semester", name: "BECS206 - Computer Architecture Lab", path: "/lab5" },
    { semeter: "4th Semester", name: "BECS208 - Microprocessor Lab0", path: "/lab6" },
    { semeter: "5th Semester", name: "BECS210 - Operating Systems Lab", path: "/lab7" },
    { semeter: "6th Semester", name: "BECS212 - Database Systems Lab", path: "/lab7" }, 
  ];

  return (
    <div className="w-full px-4">
      <div className="flex flex-col mb-4">
        <span className="text-2xl sm:text-4xl font-semibold">
          Welcome Back, Lahiru Sanjana! 👋
        </span>
        <span className="text-sm text-gray-600">
          Here's what's happening with your labs this semester
        </span>
      </div>

      <div className="w-full max-w-auto max-h-auto mx-auto flex items-center justify-center">
        <div className="grid grid-cols-2 gap-4 w-[1200px] pr-2">
          {labdetails.map((lab, index) => {
            return (
              <div
                key={index}
                onClick={() => navigate(lab.path)}
                className="bg-white shadow-md rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow duration-200"
              >
                <div className="relative">
                  <img
                    src={Lab}
                    alt={lab.name}
                    className="w-full h-56 object-cover rounded-md mb-2"
                  />
                  <span className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-semibold">
                    {lab.semeter}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold mb-2 truncate">
                  {lab.name}
                </h2>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default StudentDetails;