"use client";

import { useState, useEffect } from 'react';

interface CountdownResult {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isFinished: boolean;
}

const calculateTimeLeft = (targetTimestamp: number | null): CountdownResult => {
  if (!targetTimestamp || targetTimestamp <= Date.now()) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isFinished: true };
  }

  const difference = targetTimestamp - Date.now();
  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / 1000 / 60) % 60);
  const seconds = Math.floor((difference / 1000) % 60);

  return { days, hours, minutes, seconds, isFinished: false };
};

export const useCountdown = (targetTimestamp: number | null): CountdownResult => {
  const [timeLeft, setTimeLeft] = useState<CountdownResult>(() => calculateTimeLeft(targetTimestamp));

  useEffect(() => {
    setTimeLeft(calculateTimeLeft(targetTimestamp));

    if (!targetTimestamp || targetTimestamp <= Date.now()) {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isFinished: true });
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetTimestamp));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetTimestamp]);

  return timeLeft;
};
