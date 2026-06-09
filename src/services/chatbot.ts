import type { ChatMessage, FootprintResult, FootprintInput } from "../types";

interface ChatContext {
  footprint?: FootprintResult;
  input?: FootprintInput;
}

const greetingKeywords = ["hi", "hello", "hey", "yo", "greetings"];
const helpKeywords = ["help", "what can you do", "capabilities", "features"];
const footprintKeywords = ["footprint", "carbon", "co2", "emission", "calculate"];
const reduceKeywords = ["reduce", "lower", "cut", "decrease", "shrink", "minimize"];
const studentKeywords = ["student", "college", "university", "school", "campus"];
const transportKeywords = ["transport", "car", "drive", "commute", "travel", "flight", "bus", "train"];
const energyKeywords = ["energy", "electricity", "power", "bill", "solar", "renewable"];
const foodKeywords = ["food", "diet", "eat", "vegan", "vegetarian", "meat", "meal"];
const shoppingKeywords = ["shop", "buy", "purchase", "fashion", "clothes", "clothing"];
const wasteKeywords = ["waste", "plastic", "recycle", "trash", "garbage", "compost"];
const waterKeywords = ["water", "shower", "laundry"];

function pickContextual(input: string, ctx: ChatContext): string {
  const text = input.toLowerCase();

  if (greetingKeywords.some((k) => text.includes(k)) && text.length < 25) {
    return "Hi! I'm Pulse, your AI sustainability copilot. Ask me anything about reducing your footprint — try \"How can I cut my transport emissions?\" or \"What's the biggest lever for someone in a city?\"";
  }

  if (helpKeywords.some((k) => text.includes(k))) {
    return "I can help you with:\n• Personalized reduction strategies based on your footprint\n• Transport, energy, food, shopping, and waste tips\n• Explaining carbon concepts in plain language\n• Calculating impact of specific lifestyle changes\n• Finding local, low-cost eco swaps\n\nWhat would you like to explore?";
  }

  if (studentKeywords.some((k) => text.includes(k))) {
    return "Top moves for students:\n1. **Bike/walk for under-3km trips** — campus is perfect for this, saves ~150 kg CO₂/yr\n2. **Refurbished laptop over new** — saves ~330 kg CO₂ and hundreds of dollars\n3. **Tap water + reusable bottle** — single-use plastic is 50% of student waste\n4. **Plant-based meals 3-4x/week** — Meatless Monday compounds; lentils are cheap and fast\n5. **Share textbooks** or use library copies — printing is carbon-intensive\n6. **Cold-water laundry** — 90% of washing energy goes to heating water\n\nWant me to model the impact of any of these for your footprint?";
  }

  if (text.includes("biggest") || text.includes("most important") || text.includes("highest impact")) {
    return "The single biggest lever for most people is **transportation + energy** — combined, they're often 60-70% of household footprint. Concrete moves ranked by impact:\n\n🥇 Switch to renewable electricity (1,500-3,000 kg/yr)\n🥈 Replace one car with EV or transit (2,000+ kg/yr)\n🥉 Go plant-based most days (~500-800 kg/yr)\n\nIf I had to pick ONE thing this week: **switch your electricity to a green tariff**. It's a 30-minute decision that runs in the background forever.";
  }

  if (footprintKeywords.some((k) => text.includes(k)) && reduceKeywords.some((k) => text.includes(k))) {
    if (ctx.footprint) {
      const top = Object.entries(ctx.footprint.breakdown).sort(([, a], [, b]) => b - a)[0];
      return `Your highest-emission category is **${top[0]}** at ${top[1]} kg CO₂/month. That's roughly ${Math.round((top[1] / ctx.footprint.monthly) * 100)}% of your footprint.\n\nFor ${top[0]}, the three highest-leverage moves are:\n1. ${getTopTip(top[0] as keyof typeof ctx.footprint.breakdown, 1)}\n2. ${getTopTip(top[0] as keyof typeof ctx.footprint.breakdown, 2)}\n3. ${getTopTip(top[0] as keyof typeof ctx.footprint.breakdown, 3)}\n\nWant me to estimate the kg CO₂ saved by any of these for you?`;
    }
    return "To give you precise numbers, I'd love to see your footprint. Head to the Calculator — takes 60 seconds. After that I can rank recommendations by your actual impact.";
  }

  if (transportKeywords.some((k) => text.includes(k))) {
    return "Transport tips, ranked by impact:\n\n🚲 **Short trips → bike/walk** (free, zero emissions, 150 kg CO₂/yr per trip replaced)\n🚌 **Replace 2 weekly car trips with transit** (~400 kg CO₂/yr)\n⚡ **If you drive, go EV on next vehicle** (cuts driving emissions ~60%)\n✈️ **Train over plane for <6h journeys** (saves 80% of trip emissions)\n🚗 **Combine errands into one trip** (cold-start is the dirtiest)\n\nA useful rule: if it's under 3km, walk. If it's under 30km, train. If it's over 30km and you have to drive, consider EV at next replacement.";
  }

  if (energyKeywords.some((k) => text.includes(k))) {
    return "Energy moves, ranked by impact:\n\n☀️ **Switch to renewable tariff or install solar** — biggest single lever (1,500-3,000 kg CO₂/yr)\n💡 **LED everywhere + smart strips** — cuts lighting 80%, ~100 kg CO₂/yr\n🌡️ **Drop thermostat 1°C in winter / raise 1°C in summer** — 200-300 kg CO₂/yr\n🚿 **Cold-water laundry 80% of the time** — ~150 kg CO₂/yr\n🔌 **Unplug standby loads** (TV, chargers) — 50-100 kg CO₂/yr\n\nThe single best ROI: a renewable energy tariff. Costs ~$5-15/month more but eliminates the biggest emissions source in most homes.";
  }

  if (foodKeywords.some((k) => text.includes(k))) {
    return "Food moves, ranked by impact:\n\n🥦 **Go plant-based 3+ days/week** — biggest single dietary change (~500 kg CO₂/yr)\n🐄 **Beef → chicken swap** — 75% reduction in meat emissions\n🥡 **Halve food waste** — saves ~250 kg CO₂/yr + real money\n🌾 **Eat seasonally + locally when possible** — ~100 kg CO₂/yr, tastier\n🐟 **Choose smaller fish, lower on food chain** — sardines > tuna for the planet\n\nSurprising fact: a vegan diet saves ~1,100 kg CO₂/yr vs. meat-heavy. Going fully vegan is the highest-impact individual dietary change, but even 30% reduction is meaningful.";
  }

  if (shoppingKeywords.some((k) => text.includes(k))) {
    return "Shopping tips:\n\n👕 **Thrift/secondhand 70%+ of clothing** — fashion is ~10% of global emissions (~280 kg CO₂/yr saved)\n📱 **Refurbished electronics, extend device life 1+ year** (~210 kg CO₂/yr per device)\n🛍️ **Buy less, choose well, make it last** — Marie Kondo for carbon\n🔧 **Repair before replace** — iFixit has guides for almost everything\n🌱 **Look for certifications**: B Corp, Fairtrade, GOTS (organic textiles)\n\nThe 'cost-per-wear' mindset beats any green certification: an expensive, well-made coat you wear 200 times beats a cheap jacket worn 10 times — both environmentally and financially.";
  }

  if (wasteKeywords.some((k) => text.includes(k))) {
    return "Waste hierarchy (in order of impact):\n\n🚫 **Refuse** — say no to single-use when you can (bottles, bags, cutlery)\n♻️ **Reduce** — buy less, use less, need less\n🔄 **Reuse** — refillable, repairable, shareable\n🗑️ **Recycle** — properly sorted, this is the LAST resort, not the first\n\nQuick wins:\n• Reusable water bottle (~80 kg plastic/yr)\n• Compost food scraps (30% of household waste)\n• Buy in bulk with your own containers\n• Learn what your local recycling actually accepts (most people recycle wrong)";
  }

  if (waterKeywords.some((k) => text.includes(k))) {
    return "Water — indirect but real climate impact:\n\n🚿 **Shorter showers** — 4 minutes saves ~40 kg CO₂/yr from water heating\n❄️ **Cold-water laundry 80% of the time** — ~150 kg CO₂/yr\n🌱 **Fix leaky taps** — a dripping hot tap wastes ~200L/yr\n🌧️ **Collect rainwater for plants** — free, off-grid\n\nHot water is 25% of home energy. Cutting showers by 2 minutes is the single easiest water-and-energy win.";
  }

  if (text.includes("thank")) {
    return "You're welcome! Small consistent actions, multiplied by millions of people, is exactly what shifts the trajectory. Want me to suggest a 7-day starter challenge based on your footprint?";
  }

  if (text.includes("climate change") || text.includes("global warming")) {
    return "Climate change basics, the short version:\n\n🌡️ The Earth is ~1.2°C warmer than pre-industrial times\n🔥 Each additional 0.5°C dramatically increases extreme weather risk\n⏰ To stay under 1.5°C (Paris Agreement), we need ~50% emissions cut by 2030\n\nPersonal action matters, but **systems change moves faster**. Beyond your own footprint, you can:\n• Vote for climate policy\n• Support businesses with credible climate plans\n• Talk about it — social norms shift faster than habits\n• Divest from fossil fuels in your investments\n\nThe good news: clean energy is now cheaper than fossil fuels. We're at an inflection point.";
  }

  // Fallback — context-aware
  if (ctx.footprint) {
    return `Great question. Based on your profile (${ctx.footprint.rating.label}, ${ctx.footprint.annual} kg CO₂/yr), the highest-leverage changes are usually in transport, energy, and diet.\n\nTry asking me about any of these specifically, or about:\n• "Biggest impact" actions for your footprint\n• Practical tips for a specific lifestyle (student, parent, remote worker)\n• How to talk to friends/family about climate\n\nWhat would be most useful?`;
  }
  return "I can give you practical, numbers-backed advice on reducing your carbon footprint. Try asking about transport, energy, food, shopping, or waste — or share what aspect of sustainability interests you most.";
}

function getTopTip(category: string, n: number): string {
  const map: Record<string, string[]> = {
    transport: [
      "Swap 2 car trips/week for public transport or carpool",
      "Cycle or walk for trips under 3 km",
      "Combine errands to reduce cold starts",
    ],
    electricity: [
      "Switch to a renewable energy tariff",
      "LED lighting + smart power strips",
      "Lower thermostat 1°C in winter",
    ],
    diet: [
      "Adopt plant-based 3+ days per week",
      "Replace beef with chicken/fish 50% of the time",
      "Cut food waste in half",
    ],
    shopping: [
      "Thrift-first for clothing",
      "Refurbished over new for electronics",
      "Repair before replace",
    ],
    waste: [
      "Set up recycling station",
      "Replace 5 single-use plastics with reusables",
      "Compost food scraps",
    ],
  };
  return (map[category] || ["Make a plan"])[n - 1];
}

export async function sendMessage(
  userInput: string,
  _history: ChatMessage[],
  context: ChatContext
): Promise<string> {
  // Simulate thinking time for natural UX
  await new Promise((r) => setTimeout(r, 600 + Math.random() * 800));

  return pickContextual(userInput, context);
}

export const SUGGESTED_PROMPTS = [
  "How can I reduce my transport emissions?",
  "What's the biggest impact change I can make?",
  "Tips for a student on a budget?",
  "How does food waste affect my footprint?",
  "Is going vegan actually worth it?",
  "Help me understand my breakdown",
];
