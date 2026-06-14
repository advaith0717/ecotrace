import { useMemo } from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { getCarbonRating, formatEmissions, generateMonthlyTrend } from '../utils/calculations';
import { BENCHMARKS } from '../data/carbonData';

function StatCard({ label, value, unit, color, icon }) {
  return (
    <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{icon}</span>
        <span className="text-slate-400 text-sm">{label}</span>
      </div>
      <div className="text-2xl font-bold" style={{ color }}>
        {value}
        <span className="text-sm font-normal text-slate-400 ml-1">{unit}</span>
      </div>
    </div>
  );
}

function ComparisonBar({ label, value, max, color }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="flex items-center gap-3">
      <div className="text-slate-400 text-xs w-20 text-right shrink-0">{label}</div>
      <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <div className="text-white text-xs w-16 shrink-0 font-mono">{formatEmissions(value)}</div>
    </div>
  );
}

export default function Dashboard({ footprint, profile, history }) {
  const rating = getCarbonRating(footprint.total);
  const trend = useMemo(() => generateMonthlyTrend(footprint.total, 6), [footprint.total]);

  const progressToGoal = Math.round((footprint.total / (profile.goal || 2000)) * 100);
  const gapToGoal = Math.max(0, footprint.total - (profile.goal || 2000));

  const categoryColors = {
    transport: '#ef4444',
    food: '#f97316',
    energy: '#eab308',
    shopping: '#8b5cf6',
  };

  const radialData = Object.entries(footprint.breakdown).map(([cat, val]) => ({
    name: cat,
    value: val,
    fill: categoryColors[cat],
  }));

  return (
    <div className="space-y-6">
      {/* Hero card */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-slate-400 text-sm">Your annual carbon footprint</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-5xl font-bold text-white">
                {(footprint.total / 1000).toFixed(1)}
              </span>
              <span className="text-xl text-slate-400">t CO₂e/yr</span>
            </div>
          </div>
          <div className="text-right">
            <div
              className="text-3xl font-bold"
              style={{ color: rating.color }}
            >
              {rating.grade}
            </div>
            <div className="text-sm mt-1" style={{ color: rating.color }}>{rating.label}</div>
          </div>
        </div>

        {/* Goal progress */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-slate-400 mb-2">
            <span>Goal: {formatEmissions(profile.goal || 2000)}/yr</span>
            <span>{progressToGoal}% of goal</span>
          </div>
          <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${Math.min(100, progressToGoal)}%`,
                background: progressToGoal <= 100
                  ? 'linear-gradient(90deg, #22c55e, #4ade80)'
                  : 'linear-gradient(90deg, #ef4444, #f97316)',
              }}
            />
          </div>
          {gapToGoal > 0 && (
            <p className="text-slate-400 text-xs mt-2">
              Reduce by {formatEmissions(gapToGoal)} more to reach your goal
            </p>
          )}
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          label="Per day"
          value={footprint.perDay}
          unit="kg"
          color="#4ade80"
          icon="📅"
        />
        <StatCard
          label="vs. India avg"
          value={footprint.total < BENCHMARKS.india_avg ? '-' : '+'}
          unit={`${formatEmissions(Math.abs(footprint.total - BENCHMARKS.india_avg))}`}
          color={footprint.total < BENCHMARKS.india_avg ? '#4ade80' : '#f97316'}
          icon="🇮🇳"
        />
      </div>

      {/* Breakdown */}
      <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700">
        <h3 className="text-white font-semibold mb-4">Emission breakdown</h3>
        <div className="space-y-3">
          {Object.entries(footprint.breakdown).map(([cat, val]) => (
            <ComparisonBar
              key={cat}
              label={cat.charAt(0).toUpperCase() + cat.slice(1)}
              value={val}
              max={footprint.total || 1}
              color={categoryColors[cat]}
            />
          ))}
        </div>
      </div>

      {/* Benchmarks */}
      <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700">
        <h3 className="text-white font-semibold mb-4">How you compare</h3>
        <div className="space-y-3">
          <ComparisonBar label="You" value={footprint.total} max={8000} color={rating.color} />
          <ComparisonBar label="India avg" value={BENCHMARKS.india_avg} max={8000} color="#60a5fa" />
          <ComparisonBar label="Global avg" value={BENCHMARKS.global_avg} max={8000} color="#a78bfa" />
          <ComparisonBar label="Paris target" value={BENCHMARKS.paris_target} max={8000} color="#34d399" />
        </div>
      </div>

      {/* Trend chart */}
      <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700">
        <h3 className="text-white font-semibold mb-4">Monthly trend</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                labelStyle={{ color: '#cbd5e1' }}
                itemStyle={{ color: '#4ade80' }}
              />
              <Line type="monotone" dataKey="emissions" stroke="#4ade80" strokeWidth={2} dot={{ fill: '#4ade80', r: 3 }} name="Your emissions (kg)" />
              <Line type="monotone" dataKey="target" stroke="#34d399" strokeWidth={1} strokeDasharray="5 5" dot={false} name="Monthly target (kg)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-slate-500 text-xs mt-2">* Monthly estimates based on your current inputs</p>
      </div>
    </div>
  );
}
