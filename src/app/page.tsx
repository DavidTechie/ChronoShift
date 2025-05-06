"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { CountdownDisplay } from '@/components/CountdownDisplay';
import { DateTimePicker } from '@/components/DateTimePicker';
import { ResetButton } from '@/components/ResetButton';
import { useCountdown } from '@/hooks/useCountdown';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import { ThemeToggle } from '@/components/ThemeToggle';

const LOCAL_STORAGE_KEY = 'chronoShiftTargetTimestamp';
const SOUND_URL = '/sounds/notification.mp3';

export default function Home() {
  const [targetTimestamp, setTargetTimestamp] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const prevFinishedRef = useRef<boolean>(false);

  useEffect(() => {
    setIsClient(true);
    const audioInstance = new Audio(SOUND_URL);
    audioInstance.preload = 'auto';
    setAudio(audioInstance);

    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const ts = parseInt(saved, 10);
        if (!isNaN(ts) && ts > Date.now()) {
          setTargetTimestamp(ts);
        } else {
          localStorage.removeItem(LOCAL_STORAGE_KEY);
        }
      }
    } catch (err) {
      console.error("Failed to access localStorage:", err);
    }

    return () => {
      if (audioInstance) {
        audioInstance.pause();
        audioInstance.src = '';
        audioInstance.load();
      }
    };
  }, []);

  const { days, hours, minutes, seconds, isFinished } = useCountdown(targetTimestamp);

  useEffect(() => {
    let soundTimeout: NodeJS.Timeout;

    if (!prevFinishedRef.current && isFinished && targetTimestamp && audio) {
      audio.currentTime = 0;
      audio.play().catch(error => {
        console.error("Error playing sound:", error);
        toast({
          title: "Audio Playback Blocked",
          description: "Click the page to enable sound.",
          variant: "destructive",
        });
      });

      toast({
        title: "Countdown Over",
        description: "Time's up!",
      });

      soundTimeout = setTimeout(() => {
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }
      }, 6000);
    }

    prevFinishedRef.current = isFinished;

    return () => {
      if (soundTimeout) clearTimeout(soundTimeout);
    };
  }, [isFinished, targetTimestamp, audio, toast]);

  const handleStart = useCallback((timestamp: number) => {
    if (timestamp <= Date.now()) {
      toast({
        title: "Invalid Time",
        description: "Please select a time in the future.",
        variant: "destructive",
      });
      return;
    }

    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, timestamp.toString());
      setTargetTimestamp(timestamp);

      if (audio && !audio.paused) {
        audio.pause();
        audio.currentTime = 0;
      }

      toast({
        title: "Countdown Started",
        description: "Your timer is now active.",
      });
    } catch (err) {
      console.error("Failed to save to localStorage:", err);
      toast({
        title: "Storage Error",
        description: "Could not save countdown settings.",
        variant: "destructive",
      });
    }
  }, [toast, audio]);

  const handleReset = useCallback(() => {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      setTargetTimestamp(null);

      if (audio && !audio.paused) {
        audio.pause();
        audio.currentTime = 0;
      }

      toast({
        title: "Countdown Reset",
        description: "Timer has been cleared.",
      });
    } catch (err) {
      console.error("Failed to remove from localStorage:", err);
      toast({
        title: "Storage Error",
        description: "Could not reset countdown settings.",
        variant: "destructive",
      });
    }
  }, [toast, audio]);

  if (!isClient || !audio) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 bg-background text-foreground">
        <div className="text-xl font-semibold text-primary animate-pulse">Loading ChronoShift...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 bg-background text-foreground transition-colors duration-300">
      <header className="absolute top-4 right-4">
        <ThemeToggle />
      </header>
      <main className="flex flex-col items-center space-y-6 sm:space-y-10 w-full max-w-lg">
        <h1 className="text-3xl sm:text-5xl font-bold text-center text-primary drop-shadow-sm">
          ChronoShift Countdown
        </h1>

        {targetTimestamp && !isFinished && (
          <>
            <CountdownDisplay
              days={days}
              hours={hours}
              minutes={minutes}
              seconds={seconds}
              isFinished={false}
            />
            <ResetButton onReset={handleReset} />
          </>
        )}

        {!targetTimestamp && (
          <DateTimePicker onStart={handleStart} key={targetTimestamp ?? 'picker-initial'} />
        )}

        {isFinished && targetTimestamp && (
          <>
            <CountdownDisplay
              days={0}
              hours={0}
              minutes={0}
              seconds={0}
              isFinished={true}
            />
            <ResetButton onReset={handleReset} />
          </>
        )}
      </main>

      <footer className="mt-auto pt-8 text-center text-muted-foreground text-sm">
        Powered by React & Next.js
      </footer>
      <Toaster />
    </div>
  );
}