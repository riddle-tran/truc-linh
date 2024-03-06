"use client";

import * as React from "react";
import { useRouter } from 'next/navigation'

import { AuthContext } from "@/src/context/AuthContext";

export default function RootFound() {
  const router = useRouter();
  const { authState } = React.useContext(AuthContext);

  React.useEffect(() => {
    if (authState.isLogin) {
      router.push("/");
      return
    }

    router.push('/sign-in')
  }, [authState.isLogin, router]);

  return <></>;
}
