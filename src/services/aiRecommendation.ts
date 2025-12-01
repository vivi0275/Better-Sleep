// OpenRouter API configuration - use environment variable for API key
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || '';
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export interface SleepData {
  lastNight: string;
  average: string;
  quality: number;
  temperature?: number;
  light?: number;
  airQuality?: number;
  noiseLevel?: number;
}

export interface CalendarEvent {
  title: string;
  time: string;
  date: string;
  dateTime: Date;
  location?: string;
}

export interface AlarmRecommendation {
  recommendedTime: string; // Format: "6:30 AM"
  reasoning: string;
  confidence: number; // 0-100
}

/**
 * Get AI-powered alarm time recommendation based on sleep data, environment, and calendar events
 */
export async function getAlarmRecommendation(
  sleepData: SleepData,
  environmentData: {
    temperature?: number;
    light?: number;
    airQuality?: number;
    noiseLevel?: number;
  },
  nextEvent?: CalendarEvent,
  currentTime?: Date
): Promise<AlarmRecommendation> {
  if (!OPENROUTER_API_KEY) {
    throw new Error('OpenRouter API key not configured');
  }

  // Build comprehensive prompt
  const prompt = `You are a sleep and wake-up time optimization expert. Analyze the following data and recommend the optimal wake-up time.

Sleep Data:
- Last Night Sleep: ${sleepData.lastNight}
- Average Sleep: ${sleepData.average}
- Sleep Quality: ${sleepData.quality}%

Environment:
${environmentData.temperature ? `- Temperature: ${environmentData.temperature}°F` : ''}
${environmentData.light ? `- Light Level: ${environmentData.light} lux` : ''}
${environmentData.airQuality ? `- Air Quality: ${environmentData.airQuality} AQI` : ''}
${environmentData.noiseLevel ? `- Noise Level: ${environmentData.noiseLevel} dB` : ''}

${nextEvent ? `Next Important Event:
- Title: ${nextEvent.title}
- Time: ${nextEvent.time} on ${nextEvent.date}
${nextEvent.location ? `- Location: ${nextEvent.location}` : ''}` : 'No upcoming events scheduled'}

${currentTime ? `Current Time: ${currentTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}` : ''}

Based on sleep science, circadian rhythms, and the user's sleep patterns, recommend:
1. The optimal wake-up time (format: "X:XX AM" or "X:XX PM")
2. A brief explanation (1-2 sentences) of why this time is optimal
3. Consider sleep cycles (90-minute cycles), ensuring the user wakes up at the end of a cycle
4. Account for the next event if provided (wake up early enough to be prepared)
5. Consider environmental factors that might affect sleep quality

Respond in JSON format:
{
  "recommendedTime": "6:30 AM",
  "reasoning": "Brief explanation here",
  "confidence": 85
}`;

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Better Sleep App',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openrouter/bert-nebulon-alpha',
        messages: [
          {
            role: 'system',
            content: 'You are a sleep science expert who provides optimal wake-up time recommendations based on sleep data, environment, and schedule. Always respond with valid JSON.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      const errorData = errorText ? JSON.parse(errorText) : {};
      
      // Handle rate limiting
      if (response.status === 429) {
        const rateLimitError = new Error(
          errorData?.error?.message || 'Rate limit exceeded. Please try again later.'
        ) as Error & { status: number; isRateLimit: boolean };
        rateLimitError.status = 429;
        (rateLimitError as any).isRateLimit = true;
        throw rateLimitError;
      }
      
      throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('OpenRouter API Response:', result);
    
    const assistantMessage = result.choices?.[0]?.message?.content;
    
    if (!assistantMessage) {
      console.error('No assistant message in response:', result);
      throw new Error('No response from AI');
    }

    console.log('Assistant Message:', assistantMessage);

    // Parse JSON response
    let recommendation: AlarmRecommendation;
    try {
      // Try to extract JSON from the response
      const jsonMatch = assistantMessage.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        console.log('Parsed Recommendation:', parsed);
        
        // Handle both 'recommendedTime' and 'recommendedWakeUpTime' field names
        const recommendedTime = parsed.recommendedTime || parsed.recommendedWakeUpTime;
        
        recommendation = {
          recommendedTime: recommendedTime || '6:30 AM',
          reasoning: parsed.reasoning || 'Optimized based on your sleep patterns and schedule.',
          confidence: parsed.confidence || 75,
        };
      } else {
        console.warn('No JSON found in response, using fallback');
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.warn('JSON parse error, using fallback:', parseError);
      // Fallback: create recommendation from text
      const timeMatch = assistantMessage.match(/(\d{1,2}:\d{2}\s*(?:AM|PM))/i);
      recommendation = {
        recommendedTime: timeMatch ? timeMatch[1] : '6:30 AM',
        reasoning: assistantMessage.substring(0, 200), // Limit reasoning length
        confidence: 75,
      };
    }

    // Validate and format the recommended time
    if (!recommendation.recommendedTime) {
      console.warn('No recommendedTime in response, using default');
      recommendation.recommendedTime = '6:30 AM';
    }

    // Ensure reasoning exists
    if (!recommendation.reasoning) {
      recommendation.reasoning = 'Optimized based on your sleep patterns and schedule.';
    }

    console.log('Final recommendation:', recommendation);
    return recommendation;
  } catch (error: any) {
    // Log all errors for debugging
    console.error('Error fetching AI alarm recommendation:', {
      message: error?.message,
      status: error?.status,
      isRateLimit: error?.isRateLimit,
      error,
    });
    
    // Only log non-rate-limit errors to avoid console spam
    if (!error?.isRateLimit && error?.status !== 429) {
      console.error('Full error details:', error);
    }
    throw error;
  }
}

