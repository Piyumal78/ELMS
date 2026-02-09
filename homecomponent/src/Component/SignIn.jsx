import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../services/api";
import { setCredentials } from "../lib/redux/store";
import SignUpDetails from "./SignUpDetails";

const SignIn = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");
    const [login, { isLoading }] = useLoginMutation();

    const onSubmit = async (data) => {
        setErrorMessage("");
        try {
            const result = await login({
                username: data.username,
                password: data.password,
            }).unwrap();

            const userRole = result.user?.role || 'ROLE_STUDENT';

            // Save token, role, and complete user object to localStorage for API access
            localStorage.setItem('token', result.token);
            localStorage.setItem('userRole', userRole);

            // Store complete user object (CRITICAL for demonstrator dashboard)
            localStorage.setItem('user', JSON.stringify(result.user));

            dispatch(setCredentials({
                token: result.token,
                user: {
                    id: result.user?.id,
                    username: result.user?.username || data.username,
                    role: userRole,
                    registrationNumber: data.username,
                    email: result.user?.email
                }
            }));

            if (userRole.includes('STUDENT')) {
                navigate("/student");
            } else if (userRole.includes('DEMONSTRATOR')) {
                navigate("/demonstrator/dashboard");
            } else if (userRole.includes('LECTURER') || userRole.includes('STAFF') || userRole.includes('ADMIN') || userRole.includes('LAB_ASSISTANT')) {
                navigate("/dashboard");
            } else {
                navigate("/");
            }
        } catch (err) {
            console.error("Login failed", err);
            setErrorMessage(err?.data?.message || "Login failed");
        }
    };

    return (
        <div className="flex flex-row justify-center items-center py-16 bg-slate-900 min-h-screen">
            <SignUpDetails />
            <div className="flex justify-center items-center h-156">
                <div className="bg-white w-full h-full py-12 px-32 rounded-r-2xl">
                    <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
                    <p className="text-gray-500 mb-6">Sign in to access your dashboard</p>

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
                                placeholder="Enter your password"
                                {...register("password", { required: "Password is required" })}
                                className="w-full mt-2 p-3 rounded-xl bg-gray-100 border"
                            />
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-400 to-blue-600 text-white font-semibold shadow-md disabled:opacity-50"
                        >
                            {isLoading ? "Signing In..." : "Sign In"}
                        </button>
                    </form>

                    <div className="mt-4 text-center">
                        <button
                            onClick={() => navigate("/signup")}
                            className="text-blue-600 hover:underline font-medium"
                        >
                            First time? Activate Your Account
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SignIn;