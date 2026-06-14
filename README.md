# 🌿 EcoTrace – Carbon Footprint Tracker

> **Understand, track, and reduce your carbon footprint through simple actions and personalized AI-powered insights.**

[![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react)](https://reactjs.org)
[![Vite](https://img.shields.io/badge/Vite-5.2-646CFF?logo=vite)](https://vitejs.dev)
[![Claude AI](https://img.shields.io/badge/Claude-Sonnet%204.6-orange)](https://anthropic.com)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

---

## 🎯 Chosen Vertical

**Individual Carbon Footprint Reduction** – A smart personal companion that empowers everyday users to understand their environmental impact across four key life domains: Transport, Food, Home Energy, and Shopping. The solution combines data-driven tracking with Claude AI-powered insights to make sustainable living approachable, measurable, and rewarding.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🧮 **Real-time Calculator** | Instant footprint computation as users adjust sliders for 15+ life activities |
| 📊 **Visual Dashboard** | Carbon rating, goal progress, category breakdown bars, monthly trend charts |
| 🤖 **AI Insights** | Claude-powered personalized assessment, improvement opportunities, and specific tips |
| 💬 **EcoAdvisor Chat** | Conversational AI assistant with context awareness of user's actual footprint data |
| ✅ **Eco Actions** | 10 curated actions (easy/medium/hard) with CO₂ savings estimates |
| 🌍 **Benchmarking** | Compare against India avg (1.9t), global avg (4.8t), and Paris target (2t) |
| 💾 **Persistent Storage** | All data saved locally (no backend required, privacy-first) |
| 📱 **Mobile-first UI** | Responsive design optimized for mobile with bottom navigation |
| ♿ **Accessible** | Keyboard navigable, ARIA labels, reduced motion support |

---

## 🏗️ Architecture & Approach

### Tech Stack
- **Frontend**: React 18 + Vite + Tailwind CSS
- **Charts**: Recharts (LineChart, RadialBar)
- **AI**: Anthropic Claude Sonnet 4.6 via REST API
- **Storage**: Browser localStorage (zero backend, privacy-first)
- **Testing**: Vitest + Testing Library

### Project Structure
```
src/
├── components/
│   ├── Onboarding.jsx      # 3-step user onboarding flow
│   ├── Dashboard.jsx       # Main footprint overview with charts
│   ├── InputTracker.jsx    # Slider-based activity input
│   ├── ActionsPanel.jsx    # Eco actions with savings tracking
│   └── AIInsightsPanel.jsx # AI insights + chat interface
├── data/
│   └── carbonData.js       # Emission factors, categories, actions
├── hooks/
│   ├── useCarbonData.js    # State management + localStorage
│   └── useAIInsights.js    # Claude API integration
├── utils/
│   └── calculations.js     # Pure calculation functions
└── test/
    ├── setup.js
    └── calculations.test.js # 25+ unit tests
```

### Logic & Decision Making

**Emission Calculations** – Each category uses scientifically-sourced emission factors (IPCC, EPA, India CEF grid data). Transport emissions are annualized from daily/monthly inputs; food from weekly meal patterns; energy from monthly utility usage; shopping from purchase frequency.

**AI Personalization** – The Claude API receives a structured prompt containing the user's exact footprint breakdown, their stated goal, and their action completion status. This context allows Claude to give genuinely personalized advice rather than generic tips. A graceful fallback ensures usability even without API connectivity.

**Data Persistence** – All state (inputs, completed actions, profile, history) is serialized to localStorage. No PII is transmitted externally; name is optional and stored only locally.

**Benchmarking** – Three reference points are used:
- India average: 1.9 tonnes CO₂e/year (UNDP India data)
- Global average: 4.8 tonnes CO₂e/year (Our World in Data)
- Paris Agreement target: 2.0 tonnes CO₂e/year (IPCC SR1.5)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
git clone https://github.com/YOUR_USERNAME/ecotrace-carbon-tracker.git
cd ecotrace-carbon-tracker
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

### Building for Production
```bash
npm run build
npm run preview
```

### Running Tests
```bash
npm test
```

---

## 🔌 AI Configuration

EcoTrace uses the Anthropic Claude API for personalized insights. The API key is handled by the Anthropic platform proxy — no setup required in claude.ai artifacts.

For standalone deployment, set your API key:
```bash
# .env.local
VITE_ANTHROPIC_API_KEY=your_key_here
```

Then update the API call in `src/hooks/useAIInsights.js` to include the Authorization header:
```javascript
headers: {
  'Content-Type': 'application/json',
  'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
  'anthropic-version': '2023-06-01',
}
```

---

## 📐 Emission Factor Sources

| Category | Source |
|---|---|
| Transport | EPA Greenhouse Gas Equivalencies, DEFRA 2023 |
| Food | Our World in Data (Poore & Nemecek, 2018) |
| Electricity | India Central Electricity Authority CEF 2023 (0.233 kg/kWh) |
| LPG/Gas | IPCC AR6 emission factors |
| Shopping | Carbon Trust product lifecycle studies |

---

## 🧪 Testing

25+ unit tests cover:
- All four emission calculation functions
- Total footprint aggregation
- Carbon rating classification
- Utility functions (formatEmissions, percentChange, getTopEmitters)
- Edge cases (zero inputs, boundary values)

```bash
npm test
# 25 tests pass ✓
```

---

## 🎨 Design Decisions

- **Dark theme with green accents** – Connects to the environmental theme while reducing screen energy use and eye strain
- **Slider-first input** – Reduces friction vs. form typing; instant visual feedback motivates exploration
- **Bottom navigation** – Mobile-first UX pattern for thumb-friendly navigation
- **Graceful AI fallback** – Pre-computed fallback insights ensure the app works fully offline
- **No sign-up required** – Privacy-first; name is optional; all data stays on device

---

## 🔮 Assumptions Made

1. Average petrol car emission factor of 0.192 kg CO₂e/km (represents an Indian market mid-size sedan)
2. Electricity grid emission factor of 0.233 kg CO₂e/kWh (India CEF 2023; varies by state)
3. Beef meal = approximately 150g serving (global average portion)
4. Monthly trend chart shows estimated values with ±10% natural variance
5. Flight emissions use short-haul factor (0.255 kg/km); long-haul would be slightly lower per km
6. Air conditioning modeled as 0.35 kg CO₂e/hour based on 1.5-ton AC at India grid mix

---

## 📄 License

MIT License – see [LICENSE](LICENSE) for details.

---

## 🤝 Contributing

Pull requests welcome! Please open an issue first to discuss significant changes.

---

*Built with 💚 for a sustainable future*
