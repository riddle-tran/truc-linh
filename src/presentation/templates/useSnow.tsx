import React, { MutableRefObject, useCallback } from "react";
import { ParticleNetwork } from "./ParticleNetwork";

const useSnow = (
  canvasRef: MutableRefObject<HTMLCanvasElement | null>,
  particleNetworkRef: React.MutableRefObject<ParticleNetwork | undefined>
) => {
  const flakes = React.useRef<any[]>([]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    function drawSnowflake(flake: any) {
      ctx.font = `${flake.size}px Arial`;
      ctx.fillText(flake.text, flake.x, flake.y);
    }

    ctx.clearRect(0, 0, canvas!.width, canvas!.height);
    particleNetworkRef.current?.draw();
    for (const flake of flakes.current) {
      drawSnowflake(flake);
    }
  }, [canvasRef, particleNetworkRef]);

  const runSnow = React.useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    function createSnowflake() {
      const randomValue = Math.floor(Math.random() * 2);
      return {
        x: Math.random() * canvas!.width,
        y: 0,
        size: 14,
        radius: Math.random() * 3 + 1,
        speed: Math.random() * 2 + 1,
        opacity: Math.random(),
        text: !randomValue ? "🎉" : "🎁",
      };
    }

    function updateSnowflakes() {
      for (let i = 0; i < flakes.current.length; i++) {
        const flake = flakes.current[i];

        flake.y += flake.speed;

        if (flake.y > canvas!.height) {
          flakes.current[i] = createSnowflake();
        }
      }
    }

    function snowfall() {
      if (flakes.current.length < 30) {
        flakes.current.push(createSnowflake());
      }
      updateSnowflakes();
      draw();
      requestAnimationFrame(snowfall);
    }

    snowfall();
  }, [canvasRef, draw]);

  return { runSnow, draw };
};

export default useSnow;
