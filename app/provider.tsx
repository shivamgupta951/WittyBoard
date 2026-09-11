"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { UserDetailsContext } from "@/context/userDetailsContext";

function Provider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    CreateNewUser();
  }, []);

  const [userDetails, setUserDetails] = useState<any>();

  const CreateNewUser = async () => {
    const result = await axios.post("/api/users");
    setUserDetails(result.data);
  };
  return (
    <UserDetailsContext value={{userDetails,setUserDetails}}>
      <div>{children}</div>
    </UserDetailsContext>
  );
}

export default Provider;
