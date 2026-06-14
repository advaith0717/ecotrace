import { useState, useEffect, useCallback } from 'react';
import { calculateTotalFootprint } from '../utils/calculations';

const STORAGE_KEY = 'ecotrace_data';

const DEFAULT_INPUTS = {
  transport: { car_km: 10, flight_km: 0, bus_km: 0, train_km: 0 },
  food: { beef_meals: 2, chicken_meals: 4, veg_meals: 7, dairy_daily: 2 },
  energy: { electricity_kwh: 150, lpg_kg: 10, ac_hours: 4 },
  shopping: { clothing_items: 2, electronics: 1, online_orders: 3 },
};

const DEFAULT_STATE = {
  inputs: DEFAULT_INPUTS,
  completedActions: [],
  history: [],
  profile: { name: '', goal: 2000, joinedAt: null },
  onboarded: false,
};

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveToStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('Could not save to localStorage:', e);
  }
}

export function useCarbonData() {
  const [state, setState] = useState(() => {
    const stored = loadFromStorage();
    return stored || DEFAULT_STATE;
  });

  const footprint = calculateTotalFootprint(state.inputs);

  useEffect(() => {
    saveToStorage(state);
  }, [state]);

  const updateInputs = useCallback((category, values) => {
    setState(prev => ({
      ...prev,
      inputs: {
        ...prev.inputs,
        [category]: { ...prev.inputs[category], ...values },
      },
    }));
  }, []);

  const toggleAction = useCallback((actionId) => {
    setState(prev => {
      const isCompleted = prev.completedActions.includes(actionId);
      return {
        ...prev,
        completedActions: isCompleted
          ? prev.completedActions.filter(id => id !== actionId)
          : [...prev.completedActions, actionId],
      };
    });
  }, []);

  const saveSnapshot = useCallback(() => {
    setState(prev => ({
      ...prev,
      history: [
        ...prev.history,
        {
          date: new Date().toISOString(),
          total: footprint.total,
          breakdown: footprint.breakdown,
        }
      ].slice(-12), // keep last 12 snapshots
    }));
  }, [footprint]);

  const setProfile = useCallback((profile) => {
    setState(prev => ({
      ...prev,
      profile: { ...prev.profile, ...profile },
    }));
  }, []);

  const completeOnboarding = useCallback((name, goal) => {
    setState(prev => ({
      ...prev,
      profile: { name, goal: goal || 2000, joinedAt: new Date().toISOString() },
      onboarded: true,
    }));
  }, []);

  const resetData = useCallback(() => {
    setState(DEFAULT_STATE);
  }, []);

  return {
    inputs: state.inputs,
    footprint,
    completedActions: state.completedActions,
    history: state.history,
    profile: state.profile,
    onboarded: state.onboarded,
    updateInputs,
    toggleAction,
    saveSnapshot,
    setProfile,
    completeOnboarding,
    resetData,
  };
}
