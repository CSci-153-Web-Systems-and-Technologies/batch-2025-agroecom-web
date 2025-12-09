"use client";

import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { signout } from "@/lib/auth-actions";
import { useUserData } from "@/lib/user-data";
import { Skeleton } from "@/components/ui/skeleton";

const AuthButton = () => {
  const { user, loading } = useUserData();
  const router = useRouter();

  if (loading) {
    return (
        <Skeleton className="h-10 w-24 rounded-md" />
    );
  }

  if (user) {
    return (
      <>
        <Button
          variant="destructive"
          size="lg"
          onClick={() => {
            signout();
          }}
        >
          Log out
        </Button>
      </>
    );
  }

  return (
    <>
      <Button
        size="lg"
        onClick={() => {
          router.push("/signup");
        }}
      >
        Signup
      </Button>

      <Button
        size="lg"
        onClick={() => {
          router.push("/login");
        }}
      >
        Login
      </Button>
    </>
  );
};

export default AuthButton;