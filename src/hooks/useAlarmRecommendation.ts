import { useQuery } from '@tanstack/react-query';
import { getAlarmRecommendation, type SleepData, type CalendarEvent, type AlarmRecommendation } from '@/services/aiRecommendation';

interface UseAlarmRecommendationOptions {
  sleepData: SleepData;
  environmentData: {
    temperature?: number;
    light?: number;
    airQuality?: number;
    noiseLevel?: number;
  };
  nextEvent?: CalendarEvent;
  currentTime?: Date;
  enabled?: boolean;
}

/**
 * Hook to get AI-powered alarm time recommendations
 * Uses React Query for caching and state management
 */
export function useAlarmRecommendation({
  sleepData,
  environmentData,
  nextEvent,
  currentTime,
  enabled = true,
}: UseAlarmRecommendationOptions) {
  // Create a stable query key that doesn't change on every render
  // Only include essential data that affects the recommendation
  const queryKey = [
    'alarm-recommendation',
    sleepData.lastNight,
    sleepData.average,
    sleepData.quality,
    nextEvent?.title,
    nextEvent?.dateTime?.toISOString().split('T')[0], // Only date, not time
  ];
  
  return useQuery<AlarmRecommendation>({
    queryKey,
    queryFn: async () => {
      console.log('Fetching AI recommendation with:', { sleepData, environmentData, nextEvent });
      try {
        const result = await getAlarmRecommendation(sleepData, environmentData, nextEvent, currentTime);
        console.log('AI recommendation result:', result);
        return result;
      } catch (error) {
        console.error('Error in queryFn:', error);
        throw error;
      }
    },
    enabled: enabled && !!sleepData,
    staleTime: 1000 * 60 * 30, // Cache 30 minutes
    gcTime: 1000 * 60 * 60, // Keep in cache 1 hour
    retry: (failureCount, error: any) => {
      // Don't retry on rate limit errors (429)
      if (error?.status === 429 || error?.isRateLimit) {
        console.log('Rate limit reached, not retrying');
        return false;
      }
      // Retry once for other errors
      if (failureCount < 1) {
        console.log(`Retry attempt ${failureCount + 1} for AI recommendation`);
        return true;
      }
      return false;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
    refetchOnMount: false, // Don't refetch on mount if we have cached data
  });
}

