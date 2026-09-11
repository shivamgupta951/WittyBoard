"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/nextjs";
import { UserDetailsContext } from "@/context/userDetailsContext";

function Provider({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    // Keep the local user row synchronized after Clerk has established a
    // session. The API is idempotent, so this is safe on every app load.
    if (!isLoaded || !isSignedIn) return;
    void CreateNewUser();
  }, [isLoaded, isSignedIn]);

  const [userDetails, setUserDetails] = useState<any>();

  const CreateNewUser = async () => {
    try {
      const result = await axios.post("/api/users");
      setUserDetails(result.data);
    } catch (error) {
      // Public pages can render before authentication is ready. Do not turn a
      // temporary user-sync failure into an unhandled browser promise rejection.
      console.error("Failed to synchronize user:", error);
    }
  };
  return (
    <UserDetailsContext value={{userDetails,setUserDetails}}>
      <div>{children}</div>
    </UserDetailsContext>
  );
}

export default Provider;
