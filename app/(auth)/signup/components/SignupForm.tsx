'use client' 

import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signup } from "@/lib/auth-actions";
import Link from "next/link";
import { toast } from "sonner"; 
import Image from "next/image"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SignupForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    const pass = formData.get("password") as string;
    const confirmPass = formData.get("confirmPassword") as string;

    if (pass !== confirmPass) {
      setError("Passwords do not match");
      toast.error("Passwords do not match");
      return; 
    }

    setError(null); 
    
    await signup(formData);
  };

  return (
    <div className="flex min-h-screen w-full font-inter bg-white">
      <div className="flex w-full items-center justify-center p-8">
        <Card className="w-full max-w-[480px] border-0 shadow-none">
          <CardHeader className="flex flex-col items-center space-y-0 pb-6">
              <div className="mb-6 flex justify-center">
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-[#0096FF] overflow-hidden shadow-sm">
                 <Image 
                   src="/nav_logo.png" 
                   alt="Avatar" 
                   width={96}
                   height={96}
                   className="h-full w-full object-cover scale-110"
                 />
              </div>
            </div>

            <div className="w-full border-t border-gray-100 mb-6"></div>

            <div className="w-full text-left space-y-1">
                <CardTitle className="text-xl font-bold text-gray-900 font-inter">
                  Create an account
                </CardTitle>
                <CardDescription className="text-gray-500 text-sm font-inter">
                  Get started with AGROECOM today.
                </CardDescription>
            </div>
          </CardHeader>

          <form action={handleSubmit}>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-900 font-medium text-sm">Username</Label>
                <Input 
                  id="username" 
                  name="username"
                  type="text" 
                  placeholder="Enter Username" 
                  className="h-12 border-gray-200 bg-white rounded-[10px] focus-visible:ring-[#008000]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-900 font-medium text-sm">Email</Label>
                <Input 
                  id="email" 
                  name="email"
                  type="email" 
                  placeholder="email@gmail.com" 
                  className="h-12 border-gray-200 bg-white rounded-[10px] focus-visible:ring-[#008000]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-900 font-medium text-sm">Password</Label>
                <Input 
                  id="password" 
                  name="password"
                  type="password" 
                  placeholder="••••••••" 
                  className="h-12 border-gray-200 bg-white rounded-[10px] focus-visible:ring-[#008000]"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <p className="text-xs text-gray-500 font-normal">Must be at least 6 characters long.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-900 font-medium text-sm">Confirm Password</Label>
                <Input 
                  id="confirmPassword" 
                  name="confirmPassword"
                  type="password" 
                  placeholder="••••••••" 
                  className={`h-12 border-gray-200 bg-white rounded-[10px] focus-visible:ring-[#008000] ${error ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                  required
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (error) setError(null);
                  }}
                />
                {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
              </div>

            </CardContent>

            <CardFooter className="flex flex-col space-y-6 pt-6">
              <Button 
                type="submit"
                className="w-full h-12 text-sm font-medium bg-[#008000] hover:bg-[#22C55E] text-white rounded-[10px] transition-colors"
              >
                Create Account <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              
              <div className="w-full text-left">
                  <span className="text-gray-900 text-sm">
                      Already have an account?{' '}
                  </span>
                  <Link href="/login" className="font-bold text-gray-900 text-sm hover:underline">
                      Login
                  </Link>
              </div>

              <div className="w-full border-t border-gray-100"></div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}