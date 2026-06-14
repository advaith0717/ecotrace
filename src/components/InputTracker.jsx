import { useState } from 'react';
import { CATEGORIES } from '../data/carbonData';

function CategorySection({ category, inputs, onUpdate }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between p-5 hover:bg-slate-750 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{category.icon}</span>
          <div className="text-left">
            <div className="font-semibold text-white">{category.label}</div>
            <div className="text-slate-400 text-sm">{category.description}</div>
          </div>
        </div>
        <svg
          className={`w-5 h-5 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="px-5 pb-5 space-y-4 border-t border-slate-700 pt-4">
          {category.inputs.map(input => {
            const value = inputs[input.id] ?? input.default;
            return (
              <div key={input.id}>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-slate-300 text-sm">{input.label}</label>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-mono font-semibold text-sm w-10 text-right">
                      {value}
                    </span>
                    <span className="text-slate-500 text-xs">{input.unit}</span>
                  </div>
                </div>
                <input
                  type="range"
                  min={0}
                  max={input.id.includes('flight') ? 20000 : input.id.includes('km') ? 200 : input.id.includes('kwh') ? 1000 : 20}
                  step={input.id.includes('km') && !input.id.includes('flight') ? 1 : input.id.includes('kwh') ? 10 : input.id.includes('flight') ? 500 : 1}
                  value={value}
                  onChange={e => onUpdate(category.id, { [input.id]: parseFloat(e.target.value) })}
                  className="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, ${category.color} 0%, ${category.color} ${
                      (value / (input.id.includes('flight') ? 20000 : input.id.includes('km') ? 200 : input.id.includes('kwh') ? 1000 : 20)) * 100
                    }%, #334155 ${
                      (value / (input.id.includes('flight') ? 20000 : input.id.includes('km') ? 200 : input.id.includes('kwh') ? 1000 : 20)) * 100
                    }%, #334155 100%)`
                  }}
                />
                <div className="flex justify-between text-slate-600 text-xs mt-1">
                  <span>0</span>
                  <span>{input.unit === 'km' && !input.id.includes('flight') ? '200' : input.id.includes('kwh') ? '1000 kWh' : input.id.includes('flight') ? '20,000 km' : '20'}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function InputTracker({ inputs, onUpdate }) {
  return (
    <div className="space-y-4">
      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 border-dashed">
        <p className="text-slate-400 text-sm text-center">
          💡 Adjust the sliders to match your lifestyle. Your footprint updates in real time.
        </p>
      </div>

      {CATEGORIES.map(category => (
        <CategorySection
          key={category.id}
          category={category}
          inputs={inputs[category.id] || {}}
          onUpdate={onUpdate}
        />
      ))}

      <div className="text-center text-slate-600 text-xs pb-4">
        Emission factors based on IPCC, EPA, and India CEF data
      </div>
    </div>
  );
}
