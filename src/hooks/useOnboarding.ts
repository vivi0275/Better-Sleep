import { useState, useEffect } from "react";

export interface OnboardingData {
  age: number | null;
  weight: number | null;
  personType: string | null;
  sleepProblems: string[];
  sleepHabits: {
    bedtime: string | null;
    wakeTime: string | null;
    sleepDuration: string | null;
    sleepQuality: string | null;
  };
}

const STORAGE_KEY = "better-sleep-onboarding-data";

const initialData: OnboardingData = {
  age: null,
  weight: null,
  personType: null,
  sleepProblems: [],
  sleepHabits: {
    bedtime: null,
    wakeTime: null,
    sleepDuration: null,
    sleepQuality: null,
  },
};

export function useOnboarding() {
  const [data, setData] = useState<OnboardingData>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return initialData;
      }
    }
    return initialData;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const updateAge = (age: number) => {
    setData((prev) => ({ ...prev, age }));
  };

  const updateWeight = (weight: number) => {
    setData((prev) => ({ ...prev, weight }));
  };

  const updatePersonType = (personType: string) => {
    setData((prev) => ({ ...prev, personType }));
  };

  const updateSleepProblems = (problems: string[]) => {
    setData((prev) => ({ ...prev, sleepProblems: problems }));
  };

  const updateSleepHabits = (habits: Partial<OnboardingData["sleepHabits"]>) => {
    setData((prev) => ({
      ...prev,
      sleepHabits: { ...prev.sleepHabits, ...habits },
    }));
  };

  const reset = () => {
    setData(initialData);
    localStorage.removeItem(STORAGE_KEY);
  };

  const isComplete = () => {
    return (
      data.age !== null &&
      data.weight !== null &&
      data.personType !== null &&
      data.sleepProblems.length > 0 &&
      data.sleepHabits.bedtime !== null &&
      data.sleepHabits.wakeTime !== null &&
      data.sleepHabits.sleepDuration !== null &&
      data.sleepHabits.sleepQuality !== null
    );
  };

  return {
    data,
    updateAge,
    updateWeight,
    updatePersonType,
    updateSleepProblems,
    updateSleepHabits,
    reset,
    isComplete: isComplete(),
  };
}

