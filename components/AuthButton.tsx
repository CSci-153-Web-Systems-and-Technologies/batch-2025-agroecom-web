"use client";

import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/use-user";

const AuthButton = () => {
    const { user, signOut } = useUser();
    const router = useRouter();

  if (user) {
    return (
      <>
        <Button
          variant="destructive"
          size="lg"
          onClick={() => {
            signOut();
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
