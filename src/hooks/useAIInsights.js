import { useState, useCallback } from 'react';

// Builds headers — includes API key when running standalone (outside Claude.ai)
function buildHeaders() {
  const headers = { 'Content-Type': 'application/json' };
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  if (apiKey) {
    headers['x-api-key'] = apiKey;
    headers['anthropic-version'] = '2023-06-01';
    headers['anthropic-dangerous-direct-browser-access'] = 'true';
  }
  return headers;
}

/**
 * Hook to get AI-powered personalized carbon insights from Claude API
 */
export function useAIInsights() {
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState(null);
  const [error, setError] = useState(null);

  const fetchInsights = useCallback(async (footprint, completedActions, profile) => {
    setLoading(true);
    setError(null);

    const prompt = `You are EcoAdvisor, a friendly and knowledgeable carbon footprint expert. 
    
A user named "${profile.name || 'EcoTrace User'}" has the following annual carbon footprint:
- Total: ${footprint.total} kg CO2e/year
- Transport: ${footprint.breakdown.transport} kg/year
- Food: ${footprint.breakdown.food} kg/year  
- Home Energy: ${footprint.breakdown.energy} kg/year
- Shopping: ${footprint.breakdown.shopping} kg/year

Their goal is to reduce to ${profile.goal || 2000} kg/year (Paris Agreement aligned).
They have completed ${completedActions.length} eco-actions so far.

The global average is 4,800 kg/year and the Indian average is 1,900 kg/year.

Please provide:
1. A brief, encouraging 2-sentence assessment of their footprint
2. Their top 2 biggest areas for improvement (be specific with numbers)
3. Three personalized, actionable tips specific to their biggest emission sources
4. One motivating fact or comparison (e.g., "your savings equals X trees planted")

Keep the tone warm, specific, data-driven, and action-oriented. Format as JSON with keys: assessment, improvements (array of 2), tips (array of 3 objects with "action" and "impact" fields), and motivation.`;

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: buildHeaders(),
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1000,
          system: 'You are EcoAdvisor. Always respond with valid JSON only. No markdown, no preamble, just the JSON object.',
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);

      const data = await response.json();
      const text = data.content?.find(b => b.type === 'text')?.text || '';
      const clean = text.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(clean);
      setInsights(parsed);
    } catch (err) {
      setError(err.message);
      setInsights(generateFallbackInsights(footprint, profile));
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, insights, error, fetchInsights };
}

/**
 * Hook for AI chat assistant
 */
export function useAIChat() {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm EcoAdvisor, your personal carbon footprint guide. Ask me anything about reducing your environmental impact, understanding your emissions, or finding sustainable alternatives. What would you like to know?",
    }
  ]);

  const sendMessage = useCallback(async (userMessage, footprint) => {
    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setLoading(true);

    const systemPrompt = `You are EcoAdvisor, a knowledgeable, friendly assistant helping users reduce their carbon footprint. 
The user's current footprint context:
- Annual total: ${footprint?.total || 'unknown'} kg CO2e
- Breakdown: Transport ${footprint?.breakdown?.transport || 0}kg, Food ${footprint?.breakdown?.food || 0}kg, Energy ${footprint?.breakdown?.energy || 0}kg, Shopping ${footprint?.breakdown?.shopping || 0}kg

Give specific, actionable, data-backed advice. Be concise (2-4 sentences). Use the user's actual data when relevant.`;

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: buildHeaders(),
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1000,
          system: systemPrompt,
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);

      const data = await response.json();
      const reply = data.content?.find(b => b.type === 'text')?.text || 'Sorry, I could not generate a response.';
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: "I'm having trouble connecting right now, but here's a quick tip: The single most impactful change most people can make is reducing red meat consumption — cutting beef by half saves ~430 kg CO2e annually!",
        }
      ]);
    } finally {
      setLoading(false);
    }
  }, [messages]);

  const clearChat = useCallback(() => {
    setMessages([{
      role: 'assistant',
      content: "Chat cleared! Ask me anything about reducing your carbon footprint.",
    }]);
  }, []);

  return { messages, loading, sendMessage, clearChat };
}

function generateFallbackInsights(footprint, profile) {
  const { total, breakdown } = footprint;
  const topCategory = Object.entries(breakdown).sort(([,a],[,b]) => b - a)[0];

  return {
    assessment: `Your annual footprint of ${(total/1000).toFixed(1)} tonnes CO2e ${total < 1900 ? 'is below the Indian average — great work!' : 'has room for improvement.'}  Every action you take makes a real difference for our planet.`,
    improvements: [
      `${topCategory[0].charAt(0).toUpperCase() + topCategory[0].slice(1)} is your largest source at ${topCategory[1]} kg/year`,
      `You need to reduce by ${Math.max(0, total - (profile.goal || 2000))} kg/year to reach your goal`,
    ],
    tips: [
      { action: 'Switch to public transport twice a week', impact: 'Save ~320 kg CO2e/year' },
      { action: 'Replace one beef meal per week with plant-based food', impact: 'Save ~170 kg CO2e/year' },
      { action: 'Reduce AC usage by 1 hour per day', impact: 'Save ~85 kg CO2e/year' },
    ],
    motivation: `If you hit your goal, your savings equal planting ${Math.round(Math.max(0, total - (profile.goal || 2000)) / 20)} trees every year!`,
  };
}
