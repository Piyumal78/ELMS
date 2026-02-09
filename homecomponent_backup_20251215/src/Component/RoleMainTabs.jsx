const RoleMainTabs = ({ role, setRole }) => {
  return (
    <div className="flex bg-gray-200 rounded-full mb-6 p-1">
      <button
        className={`flex-1 py-2 rounded-full font-medium transition ${
          role === "student" ? "bg-white shadow text-black" : "text-gray-600"
        }`}
        onClick={() => setRole("student")}
      >
        Student
      </button>

      <button
        className={`flex-1 py-2 rounded-full font-medium transition ${
          role === "staff" ? "bg-white shadow text-black" : "text-gray-600"
        }`}
        onClick={() => setRole("staff")}
      >
        Staff
      </button>
    </div>
  );
};

export default RoleMainTabs;
