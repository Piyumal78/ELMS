import { Microscope, Beaker, Lock } from "lucide-react";

const StaffSubRole = ({ staffRole, setStaffRole }) => {
  const options = [
    { id: "Lecturer", label: "Lecturer", icon: Microscope },
    { id: "Lab", label: "Lab Assistant", icon: Beaker },
    { id: "Demonstrator", label: "Demonstrator", icon: Lock },
  ];

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      {options.map((opt) => {
        const Icon = opt.icon;

        return (
          <button
            key={opt.id}
            onClick={() => setStaffRole(opt.id)}
            className={`border rounded-xl py-4 flex flex-col items-center gap-2 transition px-4 ${
              staffRole === opt.id
                ? "bg-teal-50 border-teal-400"
                : "bg-white border-gray-300"
            }`}
          >
            <Icon size={28} />
            <span className="font-medium">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default StaffSubRole;
