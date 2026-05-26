'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from "react";

export const loginSchema = z.object({
    email: z
      .string()
      .toLowerCase()
      .email("Please enter a valid email")
      .refine(
        (value) => {
          const allowedDomains = ["com", "in", "net"];
          const domain = value.split(".").pop();
          return allowedDomains.includes(domain || "");
        },
        {
          message: "Only .com, .in, and .net domains are valid",
        }
      ),

    password: z
      .string()
      .min(5, "Password must be at least 5 characters long")
      .max(20, "Password must not exceed 20 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
        "Password must contain lowercase, uppercase, number, and special character"
      )
  })

export default function LoginPage() {
    const { register, handleSubmit,  setError, formState: { errors } } = useForm<z.infer<typeof loginSchema>>({ resolver: zodResolver(loginSchema) });

    const firstError = errors.root?.message || Object.values(errors)[0]?.message;
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const onSubmit = async (data: z.infer<typeof loginSchema>) => {
        const { email, password } = data;
        try {
           setLoading(true);
            const response = await authClient.signIn.email({
                email: email,
                password: password,
               }
            );
            if (!response.data) {
                console.log("Backend Error: ", response.error);
                setError("root", { type: "server",  message: response.error.message || "Invalid email or password" });
                return;
            }
                       

            router.push("/home");
        } catch (error) {
            console.error(error);
        } finally {
          setLoading(false);
        }
    }
    const handleGoogleLogin = async () => {
        try {
          await authClient.signIn.social({
            provider: "google",
            callbackURL: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/courses`,
          });
        } catch (error) {
          console.log(error);
        }
      };
    const handleGithubLogin = async () => {
        try {
          const response = await authClient.signIn.social({
            provider: "github",
            callbackURL:  `${process.env.NEXT_PUBLIC_FRONTEND_URL}/courses`,
          });
        } catch (error) {
          console.log(error);
        }
      };

    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="bg-white border border-slate-100 rounded-3xl shadow-lg p-6 sm:p-8">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-[#0039a6] flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl font-bold">M</span>
              </div>
            </div>
  
            {/* Heading */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-slate-800">
                Welcome back
              </h1>
              <p className="text-slate-500 mt-2 text-sm sm:text-base">
                Login to continue your learning journey
              </p>
            </div>
  
            {/* Form */}
            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  {...register("email")}
                  placeholder="you@example.com"
                  className="w-full h-12 px-4 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#0039a6]"
                />
              </div>
  
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-slate-800">
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-sm text-[#0039a6] hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <input
                  type="password"
                  placeholder="********"
                  {...register("password")}
                  className="w-full h-12 px-4 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#0039a6]"
                />
              </div>
             
              {firstError && ( <p className="text-red-500 text-center text-sm"> {String(firstError)} </p>)}

              <button
                  type="submit"
                  disabled={loading}
                  className={`w-full h-12 rounded-2xl text-white font-semibold transition-all duration-200
                    ${
                      loading
                        ? "bg-[#002d84] opacity-70 cursor-not-allowed"
                        : "bg-[#0039a6] hover:bg-[#002d84] cursor-pointer"
                    }
                  `}
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
            </form>
  
            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-slate-400 text-sm">Or continue with</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>
  
            {/* Social Login */}
            <div className="grid grid-cols-2 gap-4">
              <button 
               onClick={handleGoogleLogin}
               className="h-12 rounded-2xl border border-slate-200 hover:bg-[#0039a6]/5 font-medium text-slate-800 transition">
                Google
              </button>
              <button 
              onClick={handleGithubLogin}
              className="h-12 rounded-2xl border border-slate-200 hover:bg-[#0039a6]/5 font-medium text-slate-800 transition">
                GitHub
              </button>
            </div>
  
            {/* Signup Link */}
            <p className="text-center text-sm text-slate-500 mt-8">
              Don’t have an account?{' '}
              <span className="text-[#0039a6] font-semibold cursor-pointer hover:underline">
                <Link href="/signup">Create account</Link>
              </span>
            </p>
          </div>
        </div>
      </div>
    );
  }