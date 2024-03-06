"use client";
import * as React from "react";
import { Flex, Progress } from "@chakra-ui/react";

export default function LoadingPage() {
  return (
    <Flex align="center" justify="center" minW="100vw" minH="100vh">
      <Progress size="xs" isIndeterminate  w='50%' colorScheme='green'/>
    </Flex>
  );
}
