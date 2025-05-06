
# ChronoShift Countdown Timer

This is a Next.js application built with React that provides a simple countdown timer. Users can set a target date and time, and the app will display a live countdown. The target time is persisted in the browser's `localStorage`, so the countdown resumes automatically after a page reload.

## Features

- **Set Countdown Target:** Use the date-time picker to select a future date and time.
- **Live Countdown Display:** Shows the remaining time in days, hours, minutes, and seconds, updating every second.
- **Persistence:** The selected target date and time are saved in `localStorage`, allowing the countdown to continue even after closing and reopening the browser tab.
- **Reset Functionality:** A "Reset" button allows clearing the current countdown and the saved target time.
- **Time's Up Notification:** Displays a "Time's up!" message when the countdown reaches zero.
- **Audio Alert:** Plays a notification sound for 5 seconds when the countdown finishes (requires user setup).
- **Dark Mode:** Includes a theme toggle to switch between light and dark modes.
- **User Feedback:** Uses toasts to provide feedback for actions like starting and resetting the timer.
- **Responsive Design:** Adapts to different screen sizes.

## Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **UI Components:** shadcn/ui
- **Styling:** Tailwind CSS
- **State Management:** React Hooks (`useState`, `useEffect`, custom hook `useCountdown`)
- **Persistence:** Browser `localStorage` API
- **Date Handling:** `date-fns`
- **Audio:** Browser `Audio` API

## Running Locally

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd <repository-directory>
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```
3.  **Add Sound File (Required for Audio Alert):**
    *   Create a directory named `sounds` inside the `public` directory (`public/sounds`).
    *   Place an audio file (e.g., MP3, WAV, OGG) named `notification.mp3` inside the `public/sounds` directory. You can find royalty-free notification sounds online.
    *   The application expects the sound file at the path `/sounds/notification.mp3`.

4.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    The application will typically be available at `http://localhost:9002` (or the port specified in your `package.json`).

## Local Storage Usage

The application uses the browser's `localStorage` to store the target timestamp for the countdown under the key `chronoShiftTargetTimestamp`.

- **Saving:** When you click "Start Countdown", the selected future timestamp (in milliseconds since the epoch) is saved.
- **Loading:** On page load, the application checks `localStorage` for this key. If a valid, future timestamp is found, the countdown starts automatically. Invalid or past timestamps are ignored and cleared from storage.
- **Clearing:** Clicking the "Reset Countdown" button removes the key from `localStorage`.

The theme preference (light/dark) is also stored in `localStorage` under the key `theme`.

## Project Structure

```
/public
├── sounds/
│   └── notification.mp3  # <-- Add your sound file here
/src
├── app/                # Next.js App Router pages and layout
│   ├── globals.css     # Global styles and Tailwind directives
│   ├── layout.tsx      # Root layout component
│   └── page.tsx        # Main page component (Home)
├── components/
│   ├── ui/             # shadcn/ui components
│   ├── CountdownDisplay.tsx # Component to display the time left
│   ├── DateTimePicker.tsx   # Component for date/time input
│   ├── ResetButton.tsx      # Component for the reset button
│   └── ThemeToggle.tsx      # Component for toggling light/dark mode
├── hooks/
│   ├── useCountdown.ts # Custom hook for countdown logic
│   ├── use-toast.ts     # Hook for managing toast notifications (from shadcn/ui)
│   └── use-mobile.tsx  # Hook for detecting mobile devices
├── lib/
    └── utils.ts        # Utility functions (e.g., cn for class names)

```

## Audio Handling Details

- The browser's native `Audio` API is used.
- An `Audio` object is initialized client-side.
- The sound file (`public/sounds/notification.mp3`) is loaded via URL.
- Playback is triggered when the countdown finishes (`isFinished` state becomes true).
- A `setTimeout` stops the audio after 5 seconds.
- Error handling (e.g., browser autoplay restrictions) is included. If audio cannot play automatically, a toast message might inform the user.
- A `soundPlayed` state prevents the sound from re-playing if the page is refreshed or the state persists while `isFinished` is true. This state is reset when a new timer is started or the current one is reset.
