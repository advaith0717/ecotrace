import { useState } from 'react';

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [goal, setGoal] = useState(2000);

  const goals = [
    { value: 1000, label: 'Climate Hero', desc: '< 1 tonne/year' },
    { value: 2000, label: 'Paris Aligned', desc: '~2 tonnes/year' },
    { value: 3000, label: 'Gradual Progress', desc: '~3 tonnes/year' },
  ];

  const steps = [
    {
      title: "Welcome to EcoTrace 🌿",
      subtitle: "Your personal carbon footprint companion",
      content: (
        <div className="space-y-6">
          <p className="text-slate-300 text-lg leading-relaxed">
            EcoTrace helps you understand your environmental impact through simple tracking
            and AI-powered insights. Know your footprint. Take action. See the change.
          </p>
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: '📊', label: 'Track', desc: 'Log your daily activities' },
              { icon: '🤖', label: 'Understand', desc: 'AI insights & tips' },
              { icon: '🌱', label: 'Reduce', desc: 'Take meaningful actions' },
            ].map(item => (
              <div key={item.label} className="bg-slate-800 rounded-xl p-4 text-center border border-slate-700">
                <div className="text-3xl mb-2">{item.icon}</div>
                <div className="font-semibold text-white text-sm">{item.label}</div>
                <div className="text-slate-400 text-xs mt-1">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      title: "What should we call you?",
      subtitle: "Personalize your experience",
      content: (
        <div className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Your name (optional)"
            className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-green-500 text-lg"
          />
          <p className="text-slate-400 text-sm">
            Your data stays on your device — we don't collect personal information.
          </p>
        </div>
      )
    },
    {
      title: "Set your carbon goal",
      subtitle: "Choose your annual reduction target",
      content: (
        <div className="space-y-3">
          {goals.map(g => (
            <button
              key={g.value}
              onClick={() => setGoal(g.value)}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                goal === g.value
                  ? 'border-green-500 bg-green-500/10'
                  : 'border-slate-700 bg-slate-800 hover:border-slate-500'
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold text-white">{g.label}</div>
                  <div className="text-slate-400 text-sm">{g.desc}</div>
                </div>
                {goal === g.value && (
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">✓</div>
                )}
              </div>
            </button>
          ))}
          <p className="text-slate-500 text-xs pt-2">
            The Paris Agreement recommends ~2 tonnes CO2e per person per year by 2050.
          </p>
        </div>
      )
    },
  ];

  const current = steps[step];

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-8">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === step ? 'w-8 bg-green-500' : i < step ? 'w-2 bg-green-700' : 'w-2 bg-slate-700'
              }`}
            />
          ))}
        </div>

        <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-2xl">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white mb-2">{current.title}</h1>
            <p className="text-slate-400">{current.subtitle}</p>
          </div>

          {current.content}

          <div className="flex gap-3 mt-8">
            {step > 0 && (
              <button
                onClick={() => setStep(s => s - 1)}
                className="flex-1 py-3 rounded-xl border border-slate-600 text-slate-300 hover:bg-slate-700 transition-colors"
              >
                Back
              </button>
            )}
            <button
              onClick={() => {
                if (step < steps.length - 1) {
                  setStep(s => s + 1);
                } else {
                  onComplete(name.trim() || 'EcoTracer', goal);
                }
              }}
              className="flex-1 py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-semibold transition-colors"
            >
              {step === steps.length - 1 ? 'Start Tracking 🌿' : 'Continue →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
