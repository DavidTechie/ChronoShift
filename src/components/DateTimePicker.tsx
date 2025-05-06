"use client";

import type { FC } from 'react';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { format, parseISO, isValid, addHours } from 'date-fns'; 

interface DateTimePickerProps {
  onStart: (timestamp: number) => void;
}

const formatDateTimeLocal = (date: Date): string => {
  if (!isValid(date)) {
    console.warn("formatDateTimeLocal received an invalid date");
    const fallbackDate = addHours(new Date(), 1);
    return format(fallbackDate, "yyyy-MM-dd'T'HH:mm");
  }
  return format(date, "yyyy-MM-dd'T'HH:mm");
};

export const DateTimePicker: FC<DateTimePickerProps> = ({ onStart }) => {
  const [selectedDateTime, setSelectedDateTime] = useState<string>(() => {
    const defaultDate = addHours(new Date(), 1);
    return formatDateTimeLocal(defaultDate);
  });
  const [error, setError] = useState<string | null>(null);

  const handleDateTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDateTime(event.target.value);
    setError(null); 
  };

  const handleStartClick = () => {
    if (!selectedDateTime) {
        setError("Please select a date and time.");
        return;
    }

    const selectedDate = parseISO(selectedDateTime);

    if (!isValid(selectedDate)) {
      setError("Invalid date or time format selected.");
      return;
    }

    if (selectedDate.getTime() <= Date.now() + 1000) {
      setError("Please select a time in the future.");
      return;
    }

    setError(null);
    onStart(selectedDate.getTime());
  };

  const minDateTime = formatDateTimeLocal(new Date());


  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border border-border rounded-lg">
      <CardHeader>
        <CardTitle className="text-center text-xl sm:text-2xl font-semibold text-primary">Set Countdown Target</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="datetime-picker" className="mb-2 block text-sm font-medium text-foreground">
            Target Date & Time
          </Label>
          <Input
            id="datetime-picker"
            type="datetime-local"
            value={selectedDateTime}
            onChange={handleDateTimeChange}
            className="w-full text-base appearance-none border rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" // Added more specific styling
            min={minDateTime}
            aria-label="Select target date and time"
            aria-invalid={!!error}
            aria-describedby={error ? "datetime-error" : undefined}
          />
        </div>
        {error && (
          <Alert variant="destructive" role="alert" id="datetime-error">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleStartClick} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" aria-label="Start Countdown">
          Start Countdown
        </Button>
      </CardFooter>
    </Card>
  );
};
