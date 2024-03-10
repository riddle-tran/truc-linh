"use client";
import * as React from "react";

import { AuthContext } from "@/src/context/AuthContext";
import LoadingPage from "@/src/presentation/templates/LoadingPage";
import { Box, Image } from "@chakra-ui/react";
import { redirect } from "next/navigation";
import { ParticleNetwork } from "./ParticleNetwork";
import useSnow from "./useSnow";

const HappyBirthday: React.FC<{ active: Boolean }> = ({ active }) => {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const canvasParentRef = React.useRef<HTMLDivElement | null>(null);
  const particleNetworkRef = React.useRef<ParticleNetwork>();
  const {runSnow} = useSnow(canvasRef, particleNetworkRef);

  React.useEffect(() => {
    setTimeout(() => {
      if (!particleNetworkRef.current) {
        const canvas = canvasRef.current;
        const parent = canvasParentRef.current;
        if (!canvas || !parent) return;
        const options = {
          particleColor: "#FFFFFF",
          background: "#FFB6C1",
          interactive: true,
          velocity: 10.66, // Adjust as needed
          density: 10000, // Adjust as needed
        };

        particleNetworkRef.current = new ParticleNetwork(
          parent,
          canvas,
          options
        );
        runSnow()
      }
    }, 0);
  }, [active, runSnow]);

  return (
    <Box
      width="100vw"
      height="calc(100vh - 68px)"
      ref={canvasParentRef}
      position="relative"
    >
      <canvas ref={canvasRef} />
    </Box>
  );
};

export default HappyBirthday;
