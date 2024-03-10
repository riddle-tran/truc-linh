"use client";
import * as React from "react";

import { AuthContext } from "@/src/context/AuthContext";
import LoadingPage from "@/src/presentation/templates/LoadingPage";
import { Box } from "@chakra-ui/react";
import { ParticleNetwork } from "./ParticleNetwork";
import useSnow from "./useSnow";
import { useImage } from "./useImage";

interface ImageObject {
  image: HTMLImageElement;
  x: number;
  y: number;
  width: number;
  height: number;
}

const Memories: React.FC<{ active: Boolean }> = ({ active }) => {
  const [loading, setLoading] = React.useState<boolean>(true);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const canvasParentRef = React.useRef<HTMLDivElement | null>(null);
  const particleNetworkRef = React.useRef<ParticleNetwork>();
  const { runSnow, draw } = useSnow(canvasRef, particleNetworkRef);
  const { runImage } = useImage(canvasRef, draw);

  React.useEffect(() => {
    setLoading(false);
  }, []);

  React.useEffect(() => {
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

      particleNetworkRef.current = new ParticleNetwork(parent, canvas, options);
      runSnow();
      runImage()
    }
  }, [active, runImage, runSnow]);

  if (loading) {
    return <LoadingPage />;
  }

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

export default Memories;
