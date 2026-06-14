import { useState, useCallback } from 'react';

const API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.1-8b-instant';

async function callGroq(system, messages) {
  const key = import.meta.env.VITE_ANTHROPIC_API_KEY;
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1000,
      messages: [{ role: 'system', content: system }, ...messages],
    }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || `API ${res.status}`);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}

export function useAIInsights() {
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState(null);
  const [error, setError] = useState(null);

  const fetchInsights = useCallback(async (footprint, completedActions, profile) => {
    setLoading(true);
    setError(null);
    try {
      const prompt = `User "${profile.name || 'User'}" annual footprint:
Total: ${footprint.total}kg CO2e. Transport: ${footprint.breakdown.transport}kg, Food: ${footprint.breakdown.food}kg, Energy: ${footprint.breakdown.energy}kg, Shopping: ${footprint.breakdown.shopping}kg.
Goal: ${profile.goal || 2000}kg. Actions completed: ${completedActions.length}.
India avg: 1900kg, Global avg: 4800kg, Paris target: 2000kg.

Return JSON only: { "assessment": "2 encouraging sentences with their numbers", "improvements": ["area 1 with kg amount", "area 2 with kg amount"], "tips": [{"action":"specific tip","impact":"save Xkg/yr"},{"action":"...","impact":"..."},{"action":"...","impact":"..."}], "motivation": "1 sentence with tree/car equivalent" }`;

      const text = await callGroq('Return valid JSON only. No markdown, no explanation, no code blocks.', [{ role: 'user', content: prompt }]);
      const clean = text.replace(/```json|```/g, '').trim();
      setInsights(JSON.parse(clean));
    } catch (err) {
      setError(err.message);
      setInsights(fallbackInsights(footprint, profile));
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, insights, error, fetchInsights };
}

export function useAIChat() {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: "Hi! I'm EcoAdvisor 🌱 Ask me anything about reducing your carbon footprint!",
  }]);

  const sendMessage = useCallback(async (userMessage, footprint) => {
    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const system = `You are EcoAdvisor, a friendly carbon footprint assistant for Indian users. User's footprint: ${footprint?.total || 0}kg/yr (Transport:${footprint?.breakdown?.transport || 0}kg, Food:${footprint?.breakdown?.food || 0}kg, Energy:${footprint?.breakdown?.energy || 0}kg, Shopping:${footprint?.breakdown?.shopping || 0}kg). Give specific advice in 2-4 sentences using their actual data. Reference Indian context where relevant.`;
      const reply = await callGroq(system, newMessages.map(m => ({ role: m.role, content: m.content })));
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Connection issue! Tip: replacing one red meat meal/week with dal or paneer saves ~170kg CO2 per year 🌱",
      }]);
    } finally {
      setLoading(false);
    }
  }, [messages]);

  const clearChat = useCallback(() => {
    setMessages([{ role: 'assistant', content: "Chat cleared! What would you like to know? 🌿" }]);
  }, []);

  return { messages, loading, sendMessage, clearChat };
}

function fallbackInsights(footprint, profile) {
  const top = Object.entries(footprint.breakdown).sort(([,a],[,b]) => b-a)[0];
  const gap = Math.max(0, footprint.total - (profile.goal || 2000));
  return {
    assessment: `Your ${(footprint.total/1000).toFixed(1)}t footprint is ${footprint.total < 1900 ? 'below the Indian average — excellent!' : 'close to the Indian average of 1.9t.'} Every action counts toward your goal.`,
    improvements: [`${top[0]} is your biggest source at ${top[1]}kg/year`, `Reduce by ${gap}kg more to hit your goal`],
    tips: [
      { action: 'Use public transport twice a week', impact: 'Save ~320kg/yr' },
      { action: 'Replace red meat with dal/paneer twice a week', impact: 'Save ~170kg/yr' },
      { action: 'Reduce AC by 1 hour daily', impact: 'Save ~85kg/yr' },
    ],
    motivation: `Reaching your goal equals planting ${Math.round(gap/20)} trees every year! 🌳`,
  };
}