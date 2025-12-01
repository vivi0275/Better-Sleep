import { useState, useEffect, useCallback } from 'react';
import { 
  loadCalendarEvents, 
  transformCalendarEvents,
  type TransformedCalendarEvent 
} from '@/services/googleCalendar';
import { GOOGLE_CALENDAR_CONFIG } from '@/config/googleCalendar';

declare global {
  interface Window {
    gapi: any;
  }
}

export function useGoogleCalendar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [events, setEvents] = useState<TransformedCalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Fetch events from Google Calendar - MOCKED VERSION
  const fetchEvents = useCallback(async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    setError(null);

    try {
      // Use mock data instead of real API
      const googleEvents = await loadCalendarEvents(null, 20); // Get more events to show multiple days
      const transformedEvents = transformCalendarEvents(googleEvents);
      setEvents(transformedEvents);
    } catch (err: any) {
      console.error('Error fetching events:', err);
      setError(err.message || 'Failed to load calendar events');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Initialize Google API - MOCKED VERSION
  useEffect(() => {
    // Simulate initialization delay
    const initializeAPI = async () => {
      // Simulate API initialization delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock: Always initialize successfully and auto-connect
      setIsInitialized(true);
      setError(null);
      
      // Auto-connect with mock user
      setUserEmail('victorpicart02@gmail.com');
      setIsAuthenticated(true);
      
      // Load events immediately
      await fetchEvents();
    };

    setTimeout(() => {
      initializeAPI();
    }, 100);
  }, [fetchEvents]);

  // Handle sign in - MOCKED VERSION
  const handleSignIn = useCallback(async () => {
    setLoading(true);
    // Simulate sign-in delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setUserEmail('victorpicart02@gmail.com');
    setIsAuthenticated(true);
    setError(null);
    await fetchEvents();
    setLoading(false);
  }, [fetchEvents]);

  // Handle sign out - MOCKED VERSION
  const handleSignOut = useCallback(async () => {
    setIsAuthenticated(false);
    setUserEmail(null);
    setEvents([]);
    setError(null);
  }, []);

  return {
    isInitialized,
    isAuthenticated,
    events,
    loading,
    error,
    userEmail,
    signIn: handleSignIn,
    signOut: handleSignOut,
    refreshEvents: fetchEvents,
  };
}

