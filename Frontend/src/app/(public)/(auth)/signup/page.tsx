'use client';

import { useRouter } from "next/navigation";
import Link from "next/link";

import { authClient } from "@/lib/auth";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from "react";

export const signupSchema = z.object({
    name: z.string().min(1, "Name is required"),
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
      ),

      confirmPassword: z
      .string()
      .min(5, "Confirm password must be at least 5 characters long")
      .max(20, "Confirm password must not exceed 20 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
        "Confirm password must contain lowercase, uppercase, number, and special character"
      )
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });


export default function SignupPage() {
    const { register, handleSubmit,  setError, formState: { errors } } = useForm<z.infer<typeof signupSchema>>({ resolver: zodResolver(signupSchema) });

    const firstError = errors.root?.message || Object.values(errors)[0]?.message;

    const [loading, setLoading] = useState(false);
      
    const router = useRouter();

    const onSubmit = async (data: z.infer<typeof signupSchema>) => {

        const { name, email, password } = data;
        console.log(name, email, password);
        try {
          setLoading(true);
        const response = await authClient.signUp.email({
            name: name,
            email: email,
            password: password,
          }
        );
                
        if (!response.data) {
            setError("root", { type: "server",  message: response.error.message || "Invalid email or password" });
            return;
        }

        router.push("/login");
            
       return { success: true, message: "User created successfully" };
           
            
        } catch (error) {
            console.error(error);
        } finally {
          setLoading(false);
        }
    } 

    const handleGoogleSignUp = async () => {
        console.log('This is working .....')
        try{
            const response = await authClient.signIn.social({
                provider: "google",
                callbackURL: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/courses`, 
                });

     console.log(response)
        } 
        catch(error){
            console.log(error)
        }
      };
 
    const handleGithubSignUp = async () => {
        try {
          await authClient.signIn.social({
            provider: "github",
            callbackURL: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/courses`,
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
                Create your account
              </h1>
              <p className="text-slate-500 mt-2 text-sm sm:text-base">
                Start your learning journey today
              </p>
            </div>
  
            {/* Form */}
            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>

            <div>
                {/* Name */}
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  {...register("name")}
                  placeholder="John Doe"
                  className="w-full h-12 px-4 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#0039a6]"
                />
              </div>

              <div>
                {/* Email */}
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
  
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    {...register("password")}
                    placeholder="********"
                    className="w-full h-12 px-4 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#0039a6]"
                  />
                </div>
  
                <div>
                  {/* Confirm Password */}
                  <label className="block text-sm font-semibold text-slate-800 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    placeholder="********"
                    {...register("confirmPassword")}
                    className="w-full h-12 px-4 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#0039a6]"
                  />
                </div>
              </div>
  
              <p className="text-sm text-slate-500">
                Password must be at least 5 characters long.
              </p>

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
                  {loading ? "Signing up..." : "Sign Up"}
                </button>
            </form>
  
            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-slate-400 text-sm">Or continue with</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>
  
            {/* Social Signup */}
            <div className="grid grid-cols-2 gap-4">
              <button 
              onClick={handleGoogleSignUp}
              className="h-12 rounded-2xl border border-slate-200 hover:bg-[#0039a6]/5 font-medium text-slate-800 transition">
                Google
              </button>
              <button 
              onClick={handleGithubSignUp}
              className="h-12 rounded-2xl border border-slate-200 hover:bg-[#0039a6]/5 font-medium text-slate-800 transition">
                GitHub
              </button>
            </div>
  
            {/* Sign In */}
            <p className="text-center text-sm text-slate-500 mt-8">
              Already have an account?{' '}
              <span className="text-[#0039a6] font-semibold cursor-pointer hover:underline">
                <Link href="/login">Sign in</Link>
              </span>
            </p>
          </div>
        </div>
      </div>
    );
  }
  