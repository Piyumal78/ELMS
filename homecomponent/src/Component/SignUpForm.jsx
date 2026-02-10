import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLoginMutation, useActivateAccountMutation } from "../services/api";
import { setCredentials } from "../lib/redux/store";
import RoleMainTabs from "./RoleMainTabs";
import StaffSubRole from "./StaffSubRole";

const SignUpForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [role, setRole] = useState("student");
  const [staffRole, setStaffRole] = useState("lecturer");
  const [isActivating, setIsActivating] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [login, { isLoading: isLoggingIn }] = useLoginMutation();
  const [activateAccount, { isLoading: isActivatingAccount }] = useActivateAccountMutation();

  const onSubmit = async (data) => {
    setErrorMessage("");
    
    try {
      if (isActivating) {
        // Account Activation 
        await activateAccount({
          username: data.username,
          password: data.password,
        }).unwrap();
        
        alert("Account activated successfully! Please login now.");
        navigate("/signin");
      } else {
        // Login 
        const result = await login({
          username: data.username,
          password: data.password,
        }).unwrap();
        
        // Backend role  use
        const userRole = result.user?.role || 'ROLE_STUDENT';
        
        // Token save in redux and localStorage
        dispatch(setCredentials({ 
          token: result.token, 
          user: { 
            username: result.user?.username || data.username,
            role: userRole, // Backend actual role
            registrationNumber: data.username
          } 
        }));
        
        // redirect based on actual role
        if (userRole.includes('STUDENT')) {
          navigate("/student");
        } else if (userRole.includes('LECTURER') || userRole.includes('STAFF') || userRole.includes('ADMIN')) {
          navigate("/dashboard");
        } else {
          navigate("/");
        }
      }
    } catch (err) {
      console.error("Error:", err);
      setErrorMessage(
        err?.data?.message || 
        (isActivating ? "Account activation failed" : "Login failed")
      );
    }
  };

  return (
    <div className="flex justify-center items-center  h-156">
      <div className="bg-white w-full h-full py-12 px-32 rounded-r-2xl">

        <h2 className="text-3xl font-bold mb-2">
          {isActivating ? "Activate Your Account" : "Welcome Back"}
        </h2>
        <p className="text-gray-500 mb-6">
          {isActivating 
            ? "Set your password to activate your account" 
            : "Sign in to access your dashboard"}
        </p>
        
        {/* Role selection removed - Backend determines the role */}

        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          <div>
            <label className="text-gray-700 font-medium">Registration Number</label>
            <input
              type="text"
              placeholder="EC/2021/002"
              {...register("username", { required: "Registration number is required" })}
              className="w-full mt-2 p-3 rounded-xl bg-gray-100 border"
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
            )}
          </div>

          <div>
            <label className="text-gray-700 font-medium">Password</label>
            <input
              type="password"
              placeholder={isActivating ? "Set your password" : "Enter your password"}
              {...register("password", { 
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters"
                }
              })}
              className="w-full mt-2 p-3 rounded-xl bg-gray-100 border"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoggingIn || isActivatingAccount}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-400 to-blue-600 text-white font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoggingIn || isActivatingAccount 
              ? "Processing..." 
              : isActivating 
                ? "Activate Account"
                : "Sign In"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => navigate("/signin")}
            className="text-blue-600 hover:underline font-medium"
          >
            Already activated? Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
