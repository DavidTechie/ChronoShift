import type { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from '@/lib/utils';

interface CountdownDisplayProps {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isFinished: boolean;
}

interface TimeBlockProps {
  value: number;
  label: string;
  className?: string;
}

const TimeBlock: FC<TimeBlockProps> = ({ value, label, className }) => (
  <div className={cn("flex flex-col items-center justify-center p-2 sm:p-4 rounded-lg bg-secondary text-secondary-foreground min-w-[70px] sm:min-w-[90px]", className)}>
    <span className="text-3xl sm:text-5xl font-bold tabular-nums transition-all duration-300 ease-in-out">
      {value.toString().padStart(2, '0')}
    </span>
    <span className="text-xs sm:text-sm uppercase text-muted-foreground">{label}</span>
  </div>
);

export const CountdownDisplay: FC<CountdownDisplayProps> = ({ days, hours, minutes, seconds, isFinished }) => {
  if (isFinished) {
    return (
      <Card className="w-full max-w-md mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl sm:text-3xl font-bold text-primary">Countdown Finished!</CardTitle>
        </CardHeader>
        <CardContent className="text-center text-lg text-muted-foreground">
          Time's up!
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-lg mx-auto shadow-lg border-primary">
      <CardHeader>
         <CardTitle className="text-center text-xl sm:text-2xl font-semibold text-primary">Time Remaining</CardTitle>
       </CardHeader>
      <CardContent className="flex items-center justify-center space-x-2 sm:space-x-4">
        <TimeBlock value={days} label="Days" />
        <TimeBlock value={hours} label="Hours" />
        <TimeBlock value={minutes} label="Minutes" />
        <TimeBlock value={seconds} label="Seconds" className="text-accent-foreground bg-accent" />
      </CardContent>
    </Card>
  );
};
