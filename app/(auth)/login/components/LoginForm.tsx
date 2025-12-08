'use client'

import React, { useState } from "react";
import Link from "next/link";
import { login } from "@/lib/auth-actions"; 
import SignInWithGoogleButton from "./SignInWithGoogleButton"; 

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import Image from 'next/image'

export default function LoginForm() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    try {
        await login(formData);
    } catch (error) {
        console.error(error);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="flex w-full items-center justify-center p-8 font-inter bg-white">
      <Card className="w-full max-w-[480px] border-0 shadow-none">
        
        <CardHeader className="flex flex-col items-center space-y-0 pb-6">
            <div className="mb-6 flex justify-center">
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-[#0096FF] overflow-hidden shadow-sm">
                 <Image
                   src="/nav_logo.png" 
                   alt="Avatar" 
                   width="100"
                   height="100"
                   className="object-cover scale-110"
                 />
              </div>
            </div>
            <div className="w-full border-t border-gray-100 mb-6"></div>

            <div className="w-full text-left space-y-1">
                <CardTitle className="text-xl font-bold text-gray-900">
                  Welcome back
                </CardTitle>
                <CardDescription className="text-gray-500 text-sm">
                  Login to your AGROECOM account.
                </CardDescription>
            </div>
        </CardHeader>

        <CardContent className="space-y-6">
            <form action={handleSubmit} className="space-y-6">
                
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-900 font-medium text-sm">Email</Label>
                    <Input 
                        id="email" 
                        name="email"
                        type="email" 
                        placeholder="example@gmail.com" 
                        className="h-12 border-gray-200 bg-white rounded-[10px] focus-visible:ring-[#008000]" 
                        required
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="text-gray-900 font-medium text-sm">Password</Label>
                    </div>
                    
                    <div className="relative">
                        <Input 
                            id="password" 
                            name="password"
                            type="password" 
                            placeholder="••••••••••"
                            className="h-12 border-gray-200 bg-white rounded-[10px] focus-visible:ring-[#008000]" 
                            required
                        />
                    </div>
                     <div className="flex justify-end pt-1">
                        <Link 
                            href="/forgot-password" 
                            className="text-xs text-[#008000] hover:underline font-medium"
                        >
                            Forgot your password?
                        </Link>
                    </div>
                </div>

                <Button 
                    type="submit" 
                    className="w-full h-12 text-sm font-medium bg-[#008000] hover:bg-[#22C55E] text-white rounded-[10px] transition-colors"
                    disabled={loading}
                >
                    {loading ? "Logging in..." : "Login"} 
                </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-100" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="[&_button]:w-full [&_button]:h-12 [&_button]:rounded-[10px]">
                 <SignInWithGoogleButton />
            </div>

        </CardContent>

        <CardFooter className="flex flex-col space-y-6 pt-0">
            <div className="w-full text-left">
                <span className="text-gray-900 text-sm">
                    Don&apos;t have an account?{' '}
                </span>
                <Link href="/signup" className="font-bold text-gray-900 text-sm hover:underline">
                    Sign up
                </Link>
            </div>
            <div className="w-full border-t border-gray-100"></div>
        </CardFooter>
      </Card>
    </div>
  );
}