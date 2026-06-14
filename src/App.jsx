import { useState } from 'react';
import { useCarbonData } from './hooks/useCarbonData';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import InputTracker from './components/InputTracker';
import ActionsPanel from './components/ActionsPanel';
import AIInsightsPanel from './components/AIInsightsPanel';
import { formatEmissions } from './utils/calculations';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'track', label: 'Track', icon: '✏️' },
  { id: 'actions', label: 'Actions', icon: '✅' },
  { id: 'ai', label: 'AI Advisor', icon: '🤖' },
];

function Header({ footprint, profile }) {
  return (
    <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌿</span>
          <span className="font-bold text-white text-lg">EcoTrace</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-slate-400">
              {profile.name ? `Hi, ${profile.name}` : 'Your footprint'}
            </div>
            <div className="text-green-400 font-bold font-mono text-sm">
              {formatEmissions(footprint.total)}/yr
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function BottomNav({ active, onChange }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 z-50">
      <div className="max-w-2xl mx-auto px-2 py-2 flex">
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className={`flex-1 flex flex-col items-center gap-0.5 py-2 rounded-xl transition-all ${
              active === item.id
                ? 'bg-slate-800 text-green-400'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

export default function App() {
  const {
    inputs, footprint, completedActions, history, profile, onboarded,
    updateInputs, toggleAction, completeOnboarding, saveSnapshot,
  } = useCarbonData();

  const [activeTab, setActiveTab] = useState('dashboard');

  if (!onboarded) {
    return <Onboarding onComplete={completeOnboarding} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header footprint={footprint} profile={profile} />

      <main className="max-w-2xl mx-auto px-4 pt-6 pb-28">
        {activeTab === 'dashboard' && (
          <Dashboard footprint={footprint} profile={profile} history={history} />
        )}
        {activeTab === 'track' && (
          <InputTracker inputs={inputs} onUpdate={updateInputs} />
        )}
        {activeTab === 'actions' && (
          <ActionsPanel
            completedActions={completedActions}
            onToggle={toggleAction}
          />
        )}
        {activeTab === 'ai' && (
          <AIInsightsPanel
            footprint={footprint}
            completedActions={completedActions}
            profile={profile}
          />
        )}
      </main>

      <BottomNav active={activeTab} onChange={setActiveTab} />
    </div>
  );
}
