
import type { FC } from 'react';
import { Button } from "@/components/ui/button";
import { RotateCcw } from 'lucide-react';

interface ResetButtonProps {
  onReset: () => void;
  disabled?: boolean;
}

export const ResetButton: FC<ResetButtonProps> = ({ onReset, disabled = false }) => {
  return (
    <Button
      onClick={onReset}
      variant="outline"
      className="flex items-center gap-2 border-accent text-accent hover:bg-accent/10"
      disabled={disabled}
      aria-label="Reset Countdown"
    >
      <RotateCcw className="h-4 w-4" />
      Reset Countdown
    </Button>
  );
};
