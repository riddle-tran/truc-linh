"use client";
import * as React from "react";

import { Box, Text } from "@chakra-ui/react";
import { ParticleNetwork } from "./ParticleNetwork";
import useSnow from "./useSnow";

const HappyBirthday: React.FC<{ active: Boolean }> = ({ active }) => {
  const textContent = React.useRef([
    "Chúc mừng sinh nhật người con gái xinh đẹp, Trúc Linh!",
    "Sinh nhật của em không chỉ là sự kỷ niệm, mà còn là cơ hội để em nhìn",
    "lại những chặng đường đã qua và nhận ra rằng em là một phần quan trọng",
    "không thể thiếu bên những người thân quanh em.",
    "Chúc em tiếp tục trải nghiệm những điều mới mẻ, tỏa sáng như ánh đèn",
    "và luôn giữ nguyên tinh thần khám phá. Cuộc sống là một cuộc phiêu",
    "lưu, và hy vọng sẽ có người đi cùng em trên mọi con đường, chia sẻ mọi",
    "niềm vui và thách thức.",
    "Chúc mừng sinh nhật, người con gái đặc biệt! 🎁❤️",
    "-- Riddle --",
  ]);

  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const canvasParentRef = React.useRef<HTMLDivElement | null>(null);
  const particleNetworkRef = React.useRef<ParticleNetwork>();
  const textContentWrapper = React.useRef<HTMLDivElement>(null);

  const { runSnow } = useSnow(canvasRef, particleNetworkRef);

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
        runSnow();
        const ctx = canvas?.getContext("2d") as CanvasRenderingContext2D;
        const video = document.createElement("video");
        video.src = "/truc-linh/happy-birthday.mp4"; // Replace with the actual path to your video file
        video.autoplay = true;
        video.preload = "auto";
        video.loop = true;

        video.addEventListener("canplay", () => {
          video.play();
        });

        video.addEventListener("ended", () => {
          video.currentTime = 0;
          video.play();
        });


        const drawFrame = () => {
          ctx.drawImage(video, canvas.width / 2, 190, 640, 360);
          requestAnimationFrame(drawFrame);
        };

        video.addEventListener("play", drawFrame);
      }
    }, 0);
  }, [active, runSnow]);

  React.useEffect(() => {
    if (!textContentWrapper.current) {
      return;
    }
    const pElements = textContentWrapper.current.querySelectorAll("p");
    pElements.forEach((pElement, index) => {
      pElement.textContent = textContent.current[index + 1];
    });
  }, []);

  return (
    <>
      <Box
        width="100vw"
        height="calc(100vh - 68px)"
        ref={canvasParentRef}
        position="relative"
      >
        <canvas ref={canvasRef} />
      </Box>
      <Box
        position="absolute"
        top="250px"
        left="calc(10%)"
        zIndex={21}
        fontFamily="cursive"
        ref={textContentWrapper}
      >
        <Text fontSize="xl" color="#008000"></Text>
        <br />
        <Text fontSize="lg" color="#008000"></Text>
        <Text fontSize="lg" color="#008000"></Text>
        <Text fontSize="lg" color="#008000"></Text>
        <br />
        <Text fontSize="lg" color="#008000"></Text>
        <Text fontSize="lg" color="#008000"></Text>
        <Text fontSize="lg" color="#008000"></Text>
        <Text fontSize="lg" color="#008000"></Text>
        <br />
        <Text fontSize="lg" color="#008000"></Text>
        <br />
        <Text fontSize="lg" color="#008000"></Text>
      </Box>
    </>
  );
};

export default HappyBirthday;
