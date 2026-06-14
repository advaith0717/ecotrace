// Carbon emission factors in kg CO2e per unit
// Sources: EPA, IPCC, Our World in Data

export const EMISSION_FACTORS = {
  transport: {
    car_petrol_per_km: 0.192,      // kg CO2e/km (average petrol car)
    car_diesel_per_km: 0.171,      // kg CO2e/km (average diesel car)
    car_electric_per_km: 0.053,    // kg CO2e/km (average EV, grid mix)
    bus_per_km: 0.089,             // kg CO2e/km
    train_per_km: 0.041,           // kg CO2e/km
    flight_short_per_km: 0.255,    // kg CO2e/km (<1500km)
    flight_long_per_km: 0.195,     // kg CO2e/km (>1500km)
    motorcycle_per_km: 0.114,      // kg CO2e/km
    bicycle_per_km: 0.0,           // kg CO2e/km
    walking_per_km: 0.0,           // kg CO2e/km
  },
  food: {
    beef_per_kg: 27.0,             // kg CO2e/kg
    lamb_per_kg: 39.2,             // kg CO2e/kg
    pork_per_kg: 12.1,             // kg CO2e/kg
    chicken_per_kg: 6.9,           // kg CO2e/kg
    fish_per_kg: 6.1,              // kg CO2e/kg
    dairy_per_kg: 3.2,             // kg CO2e/kg
    eggs_per_kg: 4.8,              // kg CO2e/kg
    vegetables_per_kg: 2.0,        // kg CO2e/kg
    fruits_per_kg: 1.1,            // kg CO2e/kg
    grains_per_kg: 1.4,            // kg CO2e/kg
    legumes_per_kg: 0.9,           // kg CO2e/kg
  },
  energy: {
    electricity_per_kwh: 0.233,    // kg CO2e/kWh (India grid avg)
    natural_gas_per_kwh: 0.202,    // kg CO2e/kWh
    lpg_per_kg: 2.983,             // kg CO2e/kg
    coal_per_kg: 2.42,             // kg CO2e/kg
    solar_per_kwh: 0.041,          // kg CO2e/kWh (lifecycle)
    wood_per_kg: 0.0,              // kg CO2e/kg (carbon neutral)
  },
  shopping: {
    clothing_per_item: 10.0,       // kg CO2e/item (avg)
    electronics_phone_per_unit: 70.0,  // kg CO2e/unit
    electronics_laptop_per_unit: 300.0, // kg CO2e/unit
    furniture_per_item: 50.0,      // kg CO2e/item (avg)
    plastic_per_kg: 6.0,           // kg CO2e/kg
    paper_per_kg: 1.0,             // kg CO2e/kg
  },
};

export const CATEGORIES = [
  {
    id: 'transport',
    label: 'Transport',
    icon: '🚗',
    color: '#ef4444',
    description: 'Daily commute, travel, and trips',
    inputs: [
      { id: 'car_km', label: 'Car travel (km/day)', factor: 'car_petrol_per_km', unit: 'km', type: 'number', default: 10 },
      { id: 'flight_km', label: 'Flights this month (km total)', factor: 'flight_short_per_km', unit: 'km', type: 'number', default: 0 },
      { id: 'bus_km', label: 'Bus travel (km/day)', factor: 'bus_per_km', unit: 'km', type: 'number', default: 0 },
      { id: 'train_km', label: 'Train travel (km/day)', factor: 'train_per_km', unit: 'km', type: 'number', default: 0 },
    ]
  },
  {
    id: 'food',
    label: 'Food & Diet',
    icon: '🥗',
    color: '#f97316',
    description: 'What you eat and how often',
    inputs: [
      { id: 'beef_meals', label: 'Red meat meals per week (mutton/beef)', factor: 0.83, unit: 'meals', type: 'number', default: 2 },
      { id: 'chicken_meals', label: 'Chicken/fish/egg meals per week', factor: 0.23, unit: 'meals', type: 'number', default: 4 },
      { id: 'veg_meals', label: 'Vegetarian meals per week', factor: 0.07, unit: 'meals', type: 'number', default: 7 },
      { id: 'dairy_daily', label: 'Dairy servings per day', factor: 0.24, unit: 'servings', type: 'number', default: 2 },
    ]
  },
  {
    id: 'energy',
    label: 'Home Energy',
    icon: '⚡',
    color: '#eab308',
    description: 'Electricity, heating, and cooling',
    inputs: [
      { id: 'electricity_kwh', label: 'Monthly electricity (kWh)', factor: 0.233, unit: 'kWh', type: 'number', default: 150 },
      { id: 'lpg_kg', label: 'Monthly LPG/gas (kg)', factor: 2.983, unit: 'kg', type: 'number', default: 10 },
      { id: 'ac_hours', label: 'AC usage (hours/day)', factor: 0.35, unit: 'hrs', type: 'number', default: 4 },
    ]
  },
  {
    id: 'shopping',
    label: 'Shopping',
    icon: '🛍️',
    color: '#8b5cf6',
    description: 'Goods, clothing, and electronics',
    inputs: [
      { id: 'clothing_items', label: 'New clothing items/month', factor: 10.0, unit: 'items', type: 'number', default: 2 },
      { id: 'electronics', label: 'Electronics purchases/year', factor: 25.0, unit: 'items', type: 'number', default: 1 },
      { id: 'online_orders', label: 'Online orders/week', factor: 1.5, unit: 'orders', type: 'number', default: 3 },
    ]
  },
];

// Global average: ~4.8 tonnes CO2e/year
// Indian average: ~1.9 tonnes CO2e/year
// Paris Agreement target: ~2.0 tonnes CO2e/year
export const BENCHMARKS = {
  global_avg: 4800,    // kg/year
  india_avg: 1900,     // kg/year
  paris_target: 2000,  // kg/year
  low_carbon: 1000,    // kg/year
};

export const ACTIONS = [
  {
    id: 'go_veg_one_day',
    category: 'food',
    label: 'Go vegetarian one day a week',
    savingKgPerYear: 170,
    difficulty: 'easy',
    tip: 'Replacing one meat meal per week with plant-based food saves the equivalent of driving 680 km.',
  },
  {
    id: 'switch_to_led',
    category: 'energy',
    label: 'Switch to LED lighting',
    savingKgPerYear: 60,
    difficulty: 'easy',
    tip: 'LEDs use up to 80% less energy than incandescent bulbs.',
  },
  {
    id: 'cold_wash',
    category: 'energy',
    label: 'Wash clothes in cold water',
    savingKgPerYear: 45,
    difficulty: 'easy',
    tip: '90% of a washing machine\'s energy goes to heating water.',
  },
  {
    id: 'public_transport',
    category: 'transport',
    label: 'Take public transport 2x per week',
    savingKgPerYear: 320,
    difficulty: 'medium',
    tip: 'Switching from a car to a bus for your commute twice a week can save hundreds of kg CO2 per year.',
  },
  {
    id: 'reduce_beef',
    category: 'food',
    label: 'Reduce red meat to once a week',
    savingKgPerYear: 430,
    difficulty: 'medium',
    tip: 'Beef production emits 20x more greenhouse gases than plant proteins.',
  },
  {
    id: 'solar_panel',
    category: 'energy',
    label: 'Install rooftop solar',
    savingKgPerYear: 1200,
    difficulty: 'hard',
    tip: 'A 2kW rooftop solar system in India can offset over 1 tonne of CO2 annually.',
  },
  {
    id: 'no_flight_year',
    category: 'transport',
    label: 'Take one fewer flight per year',
    savingKgPerYear: 900,
    difficulty: 'hard',
    tip: 'A single long-haul flight can emit as much CO2 as driving for months.',
  },
  {
    id: 'second_hand',
    category: 'shopping',
    label: 'Buy second-hand clothing',
    savingKgPerYear: 120,
    difficulty: 'easy',
    tip: 'The fashion industry accounts for 10% of global carbon emissions.',
  },
  {
    id: 'unplug_standby',
    category: 'energy',
    label: 'Unplug devices on standby',
    savingKgPerYear: 40,
    difficulty: 'easy',
    tip: 'Standby power can account for 10% of household electricity use.',
  },
  {
    id: 'plant_tree',
    category: 'general',
    label: 'Plant 5 trees this year',
    savingKgPerYear: 100,
    difficulty: 'medium',
    tip: 'A mature tree absorbs about 20 kg of CO2 per year.',
  },
];
