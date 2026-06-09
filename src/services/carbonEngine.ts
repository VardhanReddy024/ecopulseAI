import type { FootprintInput, FootprintResult, Recommendation } from "../types";
import { getEcoRating } from "../utils/cn";

// Emission factors (kg CO2e per unit) — sourced from public carbon accounting research
const TRANSPORT_FACTORS = {
  bike: 0,
  car: 0.171, // kg CO2 per km (average gasoline car)
  public: 0.089, // kg CO2 per passenger-km
  flights: 0.255, // kg CO2 per km (rough average)
} as const;

const DIET_FACTORS = {
  vegan: 1.5,
  vegetarian: 1.7,
  mixed: 2.5,
  "meat-heavy": 3.3,
} as const;

const SHOPPING_FACTORS = {
  low: 20,
  medium: 60,
  high: 130,
} as const;

// Global average annual carbon footprint per person ≈ 4,700 kg CO2 (used in vsAverage calc)

export function calculateFootprint(input: FootprintInput): FootprintResult {
  // Transport
  const modeFactor = TRANSPORT_FACTORS[input.transport.primary];
  const transportMonthly = (input.transport.weeklyKm * 4.33 * modeFactor);
  const flightMonthly = (input.transport.flightHours * 800 * TRANSPORT_FACTORS.flights) / 12;

  // Electricity — ~0.42 kg CO2 per kWh (global grid average)
  const electricityFactor = input.electricity.renewable ? 0.05 : 0.42;
  const electricityMonthly = input.electricity.monthlyKwh * electricityFactor;

  // Diet — kg CO2 per day, averaged
  const dietMonthly = DIET_FACTORS[input.diet] * 30;

  // Shopping — averaged per month
  const shoppingMonthly =
    (SHOPPING_FACTORS[input.shopping.fashion] +
      SHOPPING_FACTORS[input.shopping.electronics] +
      SHOPPING_FACTORS[input.shopping.general]) /
    3;

  // Waste
  const wasteFactor = input.waste.plasticLevel === "high" ? 35 : input.waste.plasticLevel === "medium" ? 18 : 6;
  const wasteReduction = input.waste.recycles ? 0.6 : 1;
  const wasteMonthly = wasteFactor * wasteReduction;

  const total =
    transportMonthly + flightMonthly + electricityMonthly + dietMonthly + shoppingMonthly + wasteMonthly;

  const annual = total * 12;
  const rating = getEcoRating(annual / 12);
  // Trees needed to offset annual emissions: ~21 kg CO2 absorbed per mature tree per year
  const treesNeeded = Math.ceil(annual / 21);
  const vsAverage = ((annual - 4700) / 4700) * 100;

  return {
    monthly: Math.round(total * 10) / 10,
    annual: Math.round(annual),
    breakdown: {
      transport: Math.round(transportMonthly + flightMonthly),
      electricity: Math.round(electricityMonthly),
      diet: Math.round(dietMonthly),
      shopping: Math.round(shoppingMonthly),
      waste: Math.round(wasteMonthly),
    },
    rating,
    treesNeeded,
    vsAverage: Math.round(vsAverage),
  };
}

export function generateRecommendations(
  input: FootprintInput,
  result: FootprintResult
): Recommendation[] {
  const recs: Recommendation[] = [];

  // Transport
  if (input.transport.primary === "car") {
    const kmYear = input.transport.weeklyKm * 52;
    const savedKg = Math.round(kmYear * 0.082);
    const pct = Math.round((savedKg / result.annual) * 100);
    recs.push({
      id: "transport-1",
      category: "transport",
      title: "Swap 2 car trips per week for public transport or carpool",
      description: `Based on your ${kmYear.toLocaleString()} km/year driving pattern, switching just two weekly trips could save ~${savedKg} kg CO₂ annually — about ${pct}% of your total footprint. Try combining errands into single trips to compound the effect.`,
      impact: savedKg,
      effort: "low",
      timeframe: "2 weeks to form a habit",
      icon: "Bus",
    });
  }

  if (input.transport.flightHours > 4) {
    const flightCo2 = Math.round(input.transport.flightHours * 200);
    recs.push({
      id: "transport-2",
      category: "transport",
      title: "Consolidate flights or choose rail for short-haul trips",
      description: `Your ${input.transport.flightHours} flight hours generate ~${flightCo2} kg CO₂. For journeys under 6 hours, high-speed rail cuts emissions by 80%. A "flight-free year" challenge could save over a ton of CO₂.`,
      impact: Math.round(flightCo2 * 0.4),
      effort: "medium",
      timeframe: "Plan ahead for next trip",
      icon: "Plane",
    });
  }

  if (input.transport.primary !== "bike") {
    recs.push({
      id: "transport-3",
      category: "transport",
      title: "Cycle or walk for trips under 3 km",
      description: `Half of urban car trips are under 3 km. Replacing even one of these per week with a bike ride saves ~120 kg CO₂/year and adds meaningful exercise to your routine.`,
      impact: 120,
      effort: "low",
      timeframe: "Start this week",
      icon: "Bike",
    });
  }

  // Energy
  if (input.electricity.monthlyKwh > 200) {
    const potential = Math.round((input.electricity.monthlyKwh - 150) * 0.42 * 12);
    recs.push({
      id: "energy-1",
      category: "energy",
      title: `Reduce electricity from ${input.electricity.monthlyKwh} to 150 kWh/month`,
      description: `LED bulbs, smart strips, and switching off standby loads can typically cut usage by 25-35%. At your current rate, this would save ~${potential} kg CO₂ per year and reduce your bill noticeably.`,
      impact: potential,
      effort: "medium",
      timeframe: "1 month to retrofit",
      icon: "Lightbulb",
    });
  }

  if (!input.electricity.renewable) {
    recs.push({
      id: "energy-2",
      category: "energy",
      title: "Switch to a renewable energy provider or install solar",
      description: "Grid electricity is the largest single decarbonization lever for most households. A green tariff or 3-4 solar panels can eliminate 1,500-3,000 kg CO₂ annually — often the highest-impact change available.",
      impact: 2000,
      effort: "high",
      timeframe: "1-3 months to switch",
      icon: "Sun",
    });
  }

  // Diet
  if (input.diet === "meat-heavy") {
    const swapSavings = 480;
    recs.push({
      id: "diet-1",
      category: "diet",
      title: "Adopt one plant-based day per week (Meatless Monday++)",
      description: `Replacing one meat-based meal per day with a plant alternative saves ~${swapSavings} kg CO₂/year. Start with 2 days/week and notice how easy it becomes. Your favorite cuisines have brilliant vegan options.`,
      impact: swapSavings,
      effort: "low",
      timeframe: "Try this week",
      icon: "Salad",
    });
  }
  if (input.diet === "mixed" || input.diet === "meat-heavy") {
    recs.push({
      id: "diet-2",
      category: "diet",
      title: "Choose chicken or fish over beef 50% of the time",
      description: "Beef produces ~27 kg CO₂ per kg produced. Swapping to chicken (6.9 kg) or fish (5 kg) for half your meat meals cuts the dietary footprint by 30% with no sacrifice in protein.",
      impact: 320,
      effort: "low",
      timeframe: "Next grocery run",
      icon: "Utensils",
    });
  }
  if (input.diet !== "vegan") {
    recs.push({
      id: "diet-3",
      category: "diet",
      title: "Cut food waste by planning meals",
      description: "Households waste ~30% of food bought. Better meal planning, smarter storage, and using leftovers could save you money and ~250 kg CO₂/year from production-and-landfill impact.",
      impact: 250,
      effort: "low",
      timeframe: "Start with the weekly shop",
      icon: "Apple",
    });
  }

  // Shopping
  if (input.shopping.fashion !== "low") {
    const fast = input.shopping.fashion === "high" ? 280 : 140;
    recs.push({
      id: "shopping-1",
      category: "shopping",
      title: "Try a 30-day fashion fast + thrift-first rule",
      description: `Fast fashion is one of the dirtiest industries. Buying 70% of clothing secondhand and keeping items 2x as long cuts fashion emissions by ~${fast} kg CO₂/year — and saves real money.`,
      impact: fast,
      effort: "medium",
      timeframe: "Ongoing",
      icon: "Shirt",
    });
  }
  if (input.shopping.electronics === "high") {
    recs.push({
      id: "shopping-2",
      category: "shopping",
      title: "Extend device lifespans — repair before replace",
      description: "Manufacturing a new phone emits ~70 kg CO₂. A refurbished device or extending your current one by 1 year avoids that footprint entirely. Three small repairs = one new device's emissions saved.",
      impact: 210,
      effort: "low",
      timeframe: "When next upgrade feels tempting",
      icon: "Smartphone",
    });
  }

  // Waste
  if (!input.waste.recycles) {
    recs.push({
      id: "waste-1",
      category: "waste",
      title: "Start separating recyclables — paper, glass, plastic, metal",
      description: "Recycling aluminum saves 95% of the energy needed for virgin production. Even modest recycling habits cut waste emissions by 40% and require almost no extra time once established.",
      impact: 180,
      effort: "low",
      timeframe: "Set up bins this weekend",
      icon: "Recycle",
    });
  }
  if (input.waste.plasticLevel !== "low") {
    recs.push({
      id: "waste-2",
      category: "waste",
      title: "Replace 5 single-use plastics with reusables",
      description: "Water bottle, coffee cup, shopping bag, food container, and produce bags. These 5 swaps eliminate ~150 kg of plastic waste and 80 kg CO₂/year — usually paying for themselves within months.",
      impact: 80,
      effort: "low",
      timeframe: "Carry one starting tomorrow",
      icon: "Trash2",
    });
  }

  // Sort by impact descending
  return recs.sort((a, b) => b.impact - a.impact);
}
