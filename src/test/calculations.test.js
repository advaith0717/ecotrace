import { describe, it, expect } from 'vitest';
import {
  calculateTransportEmissions,
  calculateFoodEmissions,
  calculateEnergyEmissions,
  calculateShoppingEmissions,
  calculateTotalFootprint,
  getCarbonRating,
  percentChange,
  formatEmissions,
  getTopEmitters,
} from '../utils/calculations';

describe('calculateTransportEmissions', () => {
  it('returns 0 for no inputs', () => {
    expect(calculateTransportEmissions({})).toBe(0);
  });

  it('calculates car emissions correctly', () => {
    // 10 km/day * 0.192 kg/km * 365 days = 700.8 kg/year
    const result = calculateTransportEmissions({ car_km: 10 });
    expect(result).toBeCloseTo(700.8, 0);
  });

  it('calculates flight emissions correctly', () => {
    // 1000 km/month * 0.255 * 12 months = 3060 kg/year
    const result = calculateTransportEmissions({ flight_km: 1000 });
    expect(result).toBeCloseTo(3060, 0);
  });

  it('calculates combined transport correctly', () => {
    const result = calculateTransportEmissions({ car_km: 10, bus_km: 5, train_km: 3 });
    const expected = (10 * 0.192 * 365) + (5 * 0.089 * 365) + (3 * 0.041 * 365);
    expect(result).toBeCloseTo(expected, 0);
  });

  it('handles zero values explicitly', () => {
    expect(calculateTransportEmissions({ car_km: 0, flight_km: 0, bus_km: 0, train_km: 0 })).toBe(0);
  });
});

describe('calculateFoodEmissions', () => {
  it('returns 0 for empty inputs', () => {
    expect(calculateFoodEmissions({})).toBe(0);
  });

  it('calculates beef meals correctly', () => {
    // 2 beef meals/week * 0.83 kg CO2e * 52 weeks = 86.32 kg/year
    const result = calculateFoodEmissions({ beef_meals: 2 });
    expect(result).toBeCloseTo(86.32, 1);
  });

  it('calculates dairy daily correctly', () => {
    // 2 servings/day * 0.24 * 365 = 175.2 kg/year
    const result = calculateFoodEmissions({ dairy_daily: 2 });
    expect(result).toBeCloseTo(175.2, 1);
  });

  it('vegetarian meals have lower emissions than beef', () => {
    const veganResult = calculateFoodEmissions({ veg_meals: 7 });
    const beefResult = calculateFoodEmissions({ beef_meals: 7 });
    expect(veganResult).toBeLessThan(beefResult);
  });
});

describe('calculateEnergyEmissions', () => {
  it('returns 0 for no inputs', () => {
    expect(calculateEnergyEmissions({})).toBe(0);
  });

  it('calculates electricity correctly', () => {
    // 150 kWh/month * 0.233 * 12 = 419.4 kg/year
    const result = calculateEnergyEmissions({ electricity_kwh: 150 });
    expect(result).toBeCloseTo(419.4, 1);
  });

  it('calculates LPG correctly', () => {
    // 10 kg/month * 2.983 * 12 = 357.96 kg/year
    const result = calculateEnergyEmissions({ lpg_kg: 10 });
    expect(result).toBeCloseTo(357.96, 1);
  });
});

describe('calculateShoppingEmissions', () => {
  it('returns 0 for no inputs', () => {
    expect(calculateShoppingEmissions({})).toBe(0);
  });

  it('calculates clothing correctly', () => {
    // 2 items/month * 10.0 * 12 = 240 kg/year
    const result = calculateShoppingEmissions({ clothing_items: 2 });
    expect(result).toBeCloseTo(240, 0);
  });

  it('calculates electronics correctly', () => {
    // 1 item/year * 25.0 = 25 kg/year
    const result = calculateShoppingEmissions({ electronics: 1 });
    expect(result).toBeCloseTo(25, 0);
  });
});

describe('calculateTotalFootprint', () => {
  it('returns structured breakdown', () => {
    const result = calculateTotalFootprint({
      transport: { car_km: 10 },
      food: { beef_meals: 2 },
      energy: { electricity_kwh: 150 },
      shopping: { clothing_items: 2 },
    });

    expect(result).toHaveProperty('total');
    expect(result).toHaveProperty('breakdown');
    expect(result).toHaveProperty('perDay');
    expect(result).toHaveProperty('perMonth');
    expect(result.breakdown).toHaveProperty('transport');
    expect(result.breakdown).toHaveProperty('food');
    expect(result.breakdown).toHaveProperty('energy');
    expect(result.breakdown).toHaveProperty('shopping');
  });

  it('total is approximately sum of breakdown (within rounding)', () => {
    const result = calculateTotalFootprint({
      transport: { car_km: 15 },
      food: { beef_meals: 3, chicken_meals: 4 },
      energy: { electricity_kwh: 200, lpg_kg: 10 },
      shopping: { clothing_items: 3 },
    });

    const sumOfBreakdown = Object.values(result.breakdown).reduce((a, b) => a + b, 0);
    // Allow ±2 due to individual Math.round on each category
    expect(Math.abs(result.total - sumOfBreakdown)).toBeLessThanOrEqual(2);
  });

  it('handles empty inputs gracefully', () => {
    const result = calculateTotalFootprint({});
    expect(result.total).toBe(0);
  });

  it('perDay is approximately total / 365', () => {
    const result = calculateTotalFootprint({ transport: { car_km: 20 } });
    expect(result.perDay).toBeCloseTo(result.total / 365, 0);
  });
});

describe('getCarbonRating', () => {
  it('returns A+ for excellent footprint', () => {
    const rating = getCarbonRating(800);
    expect(rating.grade).toBe('A+');
    expect(rating.label).toBe('Excellent');
  });

  it('returns A for great footprint', () => {
    const rating = getCarbonRating(1500);
    expect(rating.grade).toBe('A');
  });

  it('returns F for high footprint', () => {
    const rating = getCarbonRating(8000);
    expect(rating.grade).toBe('F');
  });

  it('returns a color hex string', () => {
    const rating = getCarbonRating(2000);
    expect(rating.color).toMatch(/^#[0-9a-f]{6}$/i);
  });
});

describe('percentChange', () => {
  it('calculates reduction correctly', () => {
    expect(percentChange(1000, 800)).toBe(-20);
  });

  it('calculates increase correctly', () => {
    expect(percentChange(1000, 1200)).toBe(20);
  });

  it('handles zero before value', () => {
    expect(percentChange(0, 100)).toBe(0);
  });

  it('returns 0 for no change', () => {
    expect(percentChange(1000, 1000)).toBe(0);
  });
});

describe('formatEmissions', () => {
  it('formats kg under 1000', () => {
    expect(formatEmissions(500)).toBe('500kg');
  });

  it('formats tonnes over 1000', () => {
    expect(formatEmissions(1500)).toBe('1.5t');
  });

  it('formats exactly 1000', () => {
    expect(formatEmissions(1000)).toBe('1.0t');
  });
});

describe('getTopEmitters', () => {
  it('returns categories sorted by emission', () => {
    const breakdown = { transport: 1000, food: 500, energy: 800, shopping: 200 };
    const result = getTopEmitters(breakdown);
    expect(result[0].category).toBe('transport');
    expect(result[1].category).toBe('energy');
    expect(result[2].category).toBe('food');
    expect(result[3].category).toBe('shopping');
  });

  it('returns correct values', () => {
    const breakdown = { transport: 1000, food: 500 };
    const result = getTopEmitters(breakdown);
    expect(result[0].value).toBe(1000);
  });
});
