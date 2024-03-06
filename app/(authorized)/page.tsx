"use client";
import * as React from "react";

import { AuthContext } from "@/src/context/AuthContext";
import LoadingPage from "@/src/presentation/templates/LoadingPage";
import { ParticleNetwork } from "@/src/presentation/templates/ParticleNetwork";
import { Box } from "@chakra-ui/react";
import { redirect } from "next/navigation";

export default function Home() {
  const [loading, setLoading] = React.useState<boolean>(true);
  const { authState, authDispatch } = React.useContext(AuthContext);

  React.useEffect(() => {
    authDispatch({ type: "initialize" });
  }, [authDispatch]);

  React.useEffect(() => {
    if (!authState.initialized) {
      return;
    }
    if (!authState.isLogin) {
      redirect("/sign-in");
    }
    setLoading(false);
  }, [authState.initialized, authState.isLogin]);

  React.useEffect(() => {
    if (!loading) {
      setTimeout(() => {
        const canvas = document.getElementById(
          "homeCanvasId"
        ) as HTMLDivElement;
        const options = {
          particleColor: "#FFFFFF",
          background: "#FFB6C1",
          interactive: true,
          velocity: 0.66, // Adjust as needed
          density: 10000, // Adjust as needed
        };

        new ParticleNetwork(canvas, options);
      }, 0);
    }
  }, [loading]);

  if (!authState.initialized || loading) {
    return <LoadingPage />;
  }

  if (!authState.initialized || loading) {
    return <LoadingPage />;
  }

  return (
    <main>
      <Box id="homeCanvasId" width="100vw" height="100vh"></Box>
    </main>
  );
}
