"use client";
import * as React from "react";
import { Flex, Box, Stack, Text } from "@chakra-ui/react";
import { HStack, PinInput, PinInputField, useToast } from "@chakra-ui/react";
import { MinusIcon } from "@chakra-ui/icons";
import { AuthContext } from "@/src/context/AuthContext";
import { redirect } from "next/navigation";
import dayjs from "dayjs";
import { ParticleNetwork } from "@/src/presentation/templates/ParticleNetwork";
import CountdownTimer from "@/src/presentation/templates/CountdownTimer";
import LoadingPage from "@/src/presentation/templates/LoadingPage";

export default function SignIn() {
  const pinInputRef = React.useRef<HTMLInputElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const canvasParentRef = React.useRef<HTMLDivElement | null>(null);
  const particleNetworkRef = React.useRef<ParticleNetwork>();
  const { authState, authDispatch } = React.useContext(AuthContext);
  const [pin, setPin] = React.useState("");
  const [isComing, setIsComing] = React.useState(true);
  const toast = useToast();
  const targetDate = "2024-03-20 23:59:59:999";

  const handleComplete = React.useCallback(
    (value: string) => {
      if (value === "21032003") {
        authDispatch({
          type: "logIn",
          payload: {
            isLogin: true,
            nickName: "Ú xinh, 🥰!",
            name: "Le Thị Trúc Linh",
          },
        });
        return;
      }
      toast({
        title: "Không đúng rồi bé Ú ơi! Nhập ngày tháng năm sinh thử xem?",
        status: "warning",
        isClosable: true,
        position: "top-right",
      });
      setPin("");
      pinInputRef.current && pinInputRef.current.focus();
    },
    [authDispatch, toast]
  );

  React.useEffect(() => {
    if (authState.isLogin) {
      redirect("/");
    }
  }, [authState.isLogin]);

  React.useEffect(() => {
    const now = dayjs();
    const target = dayjs(targetDate);
    const remaining = target.diff(now, "second");
    if (remaining <= 0) {
      setIsComing(false);
    }
    authDispatch({ type: "initialize" });
  }, [authDispatch]);

  React.useEffect(() => {
    if (authState.initialized && !particleNetworkRef.current) {
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
    }
  }, [authState.initialized]);

  React.useEffect(() => {
    if (isComing) {
      const intervalId = setInterval(() => {
        const now = dayjs();
        const target = dayjs(targetDate);
        const remaining = target.diff(now, "second");
        if (remaining <= 0) {
          setIsComing(false);
        }
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [isComing, targetDate]);

  if (!authState.initialized) {
    return <LoadingPage />;
  }

  return (
    <main>
      <Box
        width="100vw"
        height="100vh"
        ref={canvasParentRef}
        position="relative"
      >
        <canvas ref={canvasRef} />
      </Box>

      {isComing ? (
        <Box
          position="absolute"
          top="calc(50% - 51px)"
          left="calc(50% - 150px)"
          zIndex={21}
        >
          <Flex align="center" justify="center">
            <Stack spacing={3} align="center" justify="center">
              <Text fontSize="3xl" color="white">
                Coming soon!
              </Text>
              <CountdownTimer targetDate={targetDate} />
            </Stack>
          </Flex>
        </Box>
      ) : (
        <Box
          position="absolute"
          top="calc(50% - 20px)"
          left="calc(50% - 220px)"
          zIndex={21}
        >
          <Flex align="center" justify="center">
            <HStack>
              <PinInput
                value={pin}
                placeholder="🥳"
                autoFocus
                colorScheme="red"
                focusBorderColor="#2C7A7B"
                onComplete={handleComplete}
                onChange={(value) => setPin(value)}
              >
                <PinInputField ref={pinInputRef} />
                <PinInputField />
                <MinusIcon boxSize={6} border="none" color="#70C284" />
                <PinInputField />
                <PinInputField />
                <MinusIcon boxSize={6} border="none" color="#70C284" />
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
              </PinInput>
            </HStack>
          </Flex>
        </Box>
      )}
      <video width="640" height="360" style={{ display: "none" }} preload='auto'>
        <source src="/truc-linh/happy-birthday.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </main>
  );
}
