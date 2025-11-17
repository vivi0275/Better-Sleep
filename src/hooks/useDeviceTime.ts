import { useState, useEffect } from "react";

/**
 * Hook to get the current device time that updates every second
 * Ensures all time in the app is synced with the device's local time
 */
export const useDeviceTime = () => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    // Update time immediately
    setCurrentTime(new Date());

    // Update every second
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return currentTime;
};

/**
 * Format time in 12-hour format (e.g., "6:30 AM")
 */
export const formatTime12Hour = (date: Date): string => {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

/**
 * Format time in 24-hour format (e.g., "06:30")
 */
export const formatTime24Hour = (date: Date): string => {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

/**
 * Format date (e.g., "Dec 20, 2024")
 */
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

/**
 * Format date and time together
 */
export const formatDateTime = (date: Date): string => {
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

/**
 * Get device timezone
 */
export const getDeviceTimezone = (): string => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

/**
 * Check if a date is today
 */
export const isToday = (date: Date): boolean => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

/**
 * Check if a date is tomorrow
 */
export const isTomorrow = (date: Date): boolean => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return (
    date.getDate() === tomorrow.getDate() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getFullYear() === tomorrow.getFullYear()
  );
};

/**
 * Get relative time label (Today, Tomorrow, or formatted date)
 */
export const getRelativeTimeLabel = (date: Date): string => {
  if (isToday(date)) {
    return "Today";
  }
  if (isTomorrow(date)) {
    return "Tomorrow";
  }
  return formatDate(date);
};

