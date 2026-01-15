import { useState } from "react";
import { useForm } from "react-hook-form";
import RoleMainTabs from "./RoleMainTabs";
import StaffSubRole from "./StaffSubRole";

const SignUpForm = () => {
  const { register, handleSubmit } = useForm();

  const [role, setRole] = useState("student");
  const [staffRole, setStaffRole] = useState("lecturer");

  const onSubmit = (data) => {
    console.log("User Main Role:", role);
    console.log("Staff Sub Role:", staffRole);
    console.log("Form Data:", data);
  };

  return (
    <div className="flex justify-center items-center bg-gradient-to-r from-blue-500 to-cyan-500 h-156">
      <div className="bg-white w-full h-full py-12 px-32 rounded-r-2xl">

        <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
        <p className="text-gray-500 mb-6">Sign in to access your dashboard</p>
        <RoleMainTabs role={role} setRole={setRole} />
        {role === "staff" && (
          <StaffSubRole staffRole={staffRole} setStaffRole={setStaffRole} />
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          <div>
            <label className="text-gray-700 font-medium">Username</label>
            <input
                type="email"
                placeholder="user-ec030"
              {...register("email")}
              className="w-full mt-2 p-3 rounded-xl bg-gray-100 border"
            />
          </div>

          <div>
            <label className="text-gray-700 font-medium">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              {...register("password")}
              className="w-full mt-2 p-3 rounded-xl bg-gray-100 border"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-400 to-blue-600 text-white font-semibold shadow-md"
          >
            {role === "student"
              ? "Sign In as Student"
              : `Sign In as ${staffRole}`}
          </button>
        </form>

        <p className="mt-4 text-center text-blue-600 hover:underline">
          Forgot your password?
        </p>
      </div>
    </div>
  );
};

export default SignUpForm;
