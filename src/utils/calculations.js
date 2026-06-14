/**
 * Carbon footprint calculation utilities
 * All values returned in kg CO2e per year unless specified
 */

/**
 * Calculate transport emissions from daily/monthly inputs
 * @param {Object} inputs - User transport data
 * @returns {number} kg CO2e per year
 */
export function calculateTransportEmissions(inputs) {
  const {
    car_km = 0,       // km/day
    flight_km = 0,    // km/month
    bus_km = 0,       // km/day
    train_km = 0,     // km/day
  } = inputs;

  const carEmissions = car_km * 0.192 * 365;
  const flightEmissions = flight_km * 0.255 * 12;
  const busEmissions = bus_km * 0.089 * 365;
  const trainEmissions = train_km * 0.041 * 365;

  return carEmissions + flightEmissions + busEmissions + trainEmissions;
}

/**
 * Calculate food emissions from weekly meal inputs
 * @param {Object} inputs - User food data
 * @returns {number} kg CO2e per year
 */
export function calculateFoodEmissions(inputs) {
  const {
    beef_meals = 0,      // meals/week (avg 0.15kg beef per meal)
    chicken_meals = 0,   // meals/week (avg 0.15kg chicken)
    veg_meals = 0,       // meals/week
    dairy_daily = 0,     // servings/day (250ml equivalent)
  } = inputs;

  const beefEmissions = beef_meals * 0.83 * 52;
  const chickenEmissions = chicken_meals * 0.23 * 52;
  const vegEmissions = veg_meals * 0.07 * 52;
  const dairyEmissions = dairy_daily * 0.24 * 365;

  return beefEmissions + chickenEmissions + vegEmissions + dairyEmissions;
}

/**
 * Calculate home energy emissions
 * @param {Object} inputs - User energy data
 * @returns {number} kg CO2e per year
 */
export function calculateEnergyEmissions(inputs) {
  const {
    electricity_kwh = 0,  // kWh/month
    lpg_kg = 0,           // kg/month
    ac_hours = 0,         // hours/day
  } = inputs;

  const electricityEmissions = electricity_kwh * 0.233 * 12;
  const lpgEmissions = lpg_kg * 2.983 * 12;
  const acEmissions = ac_hours * 0.35 * 365; // ~0.35 kWh/hr * 0.233 * 365 ≈ 0.35 factor

  return electricityEmissions + lpgEmissions + acEmissions;
}

/**
 * Calculate shopping emissions
 * @param {Object} inputs - User shopping data
 * @returns {number} kg CO2e per year
 */
export function calculateShoppingEmissions(inputs) {
  const {
    clothing_items = 0,   // items/month
    electronics = 0,      // items/year
    online_orders = 0,    // orders/week
  } = inputs;

  const clothingEmissions = clothing_items * 10.0 * 12;
  const electronicsEmissions = electronics * 25.0;
  const shippingEmissions = online_orders * 1.5 * 52;

  return clothingEmissions + electronicsEmissions + shippingEmissions;
}

/**
 * Calculate total footprint from all category inputs
 * @param {Object} allInputs - All user inputs keyed by category
 * @returns {Object} Breakdown and total in kg CO2e/year
 */
export function calculateTotalFootprint(allInputs) {
  const transport = calculateTransportEmissions(allInputs.transport || {});
  const food = calculateFoodEmissions(allInputs.food || {});
  const energy = calculateEnergyEmissions(allInputs.energy || {});
  const shopping = calculateShoppingEmissions(allInputs.shopping || {});

  const total = transport + food + energy + shopping;

  return {
    total: Math.round(total),
    breakdown: {
      transport: Math.round(transport),
      food: Math.round(food),
      energy: Math.round(energy),
      shopping: Math.round(shopping),
    },
    perDay: Math.round(total / 365),
    perMonth: Math.round(total / 12),
  };
}

/**
 * Calculate percentage change between two values
 */
export function percentChange(before, after) {
  if (before === 0) return 0;
  return Math.round(((after - before) / before) * 100);
}

/**
 * Get carbon rating label and color based on total kg/year
 */
export function getCarbonRating(kgPerYear) {
  if (kgPerYear < 1000) return { label: 'Excellent', color: '#22c55e', grade: 'A+' };
  if (kgPerYear < 2000) return { label: 'Great', color: '#4ade80', grade: 'A' };
  if (kgPerYear < 3000) return { label: 'Good', color: '#86efac', grade: 'B' };
  if (kgPerYear < 4000) return { label: 'Average', color: '#fbbf24', grade: 'C' };
  if (kgPerYear < 6000) return { label: 'Above Average', color: '#f97316', grade: 'D' };
  return { label: 'High Impact', color: '#ef4444', grade: 'F' };
}

/**
 * Generate monthly trend data for chart (simulated historical)
 * @param {number} currentTotal - Current annual kg CO2e
 * @param {number} months - Number of months of history
 */
export function generateMonthlyTrend(currentTotal, months = 6) {
  const monthlyBase = currentTotal / 12;
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const now = new Date();

  return Array.from({ length: months }, (_, i) => {
    const monthIndex = (now.getMonth() - months + i + 12) % 12;
    const variance = (Math.random() - 0.5) * 0.2; // ±10% variance
    const trend = 1 - (i * 0.02); // slight downward trend over time
    return {
      month: monthNames[monthIndex],
      emissions: Math.round(monthlyBase * trend * (1 + variance)),
      target: Math.round(2000 / 12), // Paris target monthly
    };
  });
}

/**
 * Identify biggest emission sources from breakdown
 */
export function getTopEmitters(breakdown) {
  return Object.entries(breakdown)
    .sort(([, a], [, b]) => b - a)
    .map(([category, value]) => ({ category, value }));
}

/**
 * Format kg CO2e for display
 */
export function formatEmissions(kg) {
  if (kg >= 1000) {
    return `${(kg / 1000).toFixed(1)}t`;
  }
  return `${kg}kg`;
}
