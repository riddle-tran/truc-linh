// components/CountdownTimer.tsx
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { Text } from "@chakra-ui/react";

dayjs.extend(duration);

interface CountdownTimerProps {
  targetDate: string; // Target date in YYYY-MM-DD format
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate }) => {
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  useEffect(() => {
    const now = dayjs();
    const target = dayjs(targetDate);
    const remaining = target.diff(now, "second");
    setTimeRemaining(remaining);
  }, [targetDate]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = dayjs();
      const target = dayjs(targetDate);
      const remaining = target.diff(now, "second");
      setTimeRemaining(remaining);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [targetDate]);

  const formatTime = (seconds: number): string => {
    const duration = dayjs.duration(seconds, "seconds");
    const days = duration.days();
    const hours = duration.hours();
    const minutes = duration.minutes();
    const secondsLeft = duration.seconds();
    let time = "";
    if (days) {
      time += `${days}d `;
    }
    if (hours) {
      time += `${hours}h `;
    }
    if (minutes) {
      time += `${minutes}m `;
    }

    if (secondsLeft) {
      time += `${secondsLeft}s`;
    }

    return time;
  };

  return (
    <Text fontSize="3xl" color="white" minW={300} textAlign="center">
      {formatTime(timeRemaining)}
    </Text>
  );
};

export default CountdownTimer;
