import { ACTIONS } from '../data/carbonData';
import { formatEmissions } from '../utils/calculations';

const difficultyConfig = {
  easy: { label: 'Easy', color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
  medium: { label: 'Medium', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  hard: { label: 'Hard', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
};

const categoryIcons = {
  transport: '🚗',
  food: '🥗',
  energy: '⚡',
  shopping: '🛍️',
  general: '🌍',
};

function ActionCard({ action, completed, onToggle }) {
  const diff = difficultyConfig[action.difficulty];

  return (
    <div
      className={`bg-slate-800 rounded-xl border transition-all duration-200 cursor-pointer ${
        completed ? 'border-green-500 bg-green-500/5' : 'border-slate-700 hover:border-slate-500'
      }`}
      onClick={() => onToggle(action.id)}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
            completed ? 'border-green-500 bg-green-500' : 'border-slate-600'
          }`}>
            {completed && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <span className={`font-medium text-sm ${completed ? 'text-slate-400 line-through' : 'text-white'}`}>
                {action.label}
              </span>
              <span className="text-lg shrink-0">{categoryIcons[action.category]}</span>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ color: diff.color, background: diff.bg }}
              >
                {diff.label}
              </span>
              <span className="text-green-400 text-xs font-mono font-semibold">
                -{formatEmissions(action.savingKgPerYear)}/yr
              </span>
            </div>

            <p className="text-slate-500 text-xs mt-2 leading-relaxed">{action.tip}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ActionsPanel({ completedActions, onToggle }) {
  const totalSavings = ACTIONS
    .filter(a => completedActions.includes(a.id))
    .reduce((sum, a) => sum + a.savingKgPerYear, 0);

  const easyActions = ACTIONS.filter(a => a.difficulty === 'easy');
  const medActions = ACTIONS.filter(a => a.difficulty === 'medium');
  const hardActions = ACTIONS.filter(a => a.difficulty === 'hard');

  return (
    <div className="space-y-6">
      {/* Progress summary */}
      <div className="bg-gradient-to-br from-green-900/40 to-slate-800 rounded-2xl p-5 border border-green-800/30">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-slate-400 text-sm">Actions completed</p>
            <p className="text-white text-2xl font-bold">{completedActions.length} / {ACTIONS.length}</p>
          </div>
          <div className="text-right">
            <p className="text-slate-400 text-sm">Annual savings</p>
            <p className="text-green-400 text-2xl font-bold font-mono">-{formatEmissions(totalSavings)}</p>
          </div>
        </div>
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 rounded-full transition-all duration-500"
            style={{ width: `${(completedActions.length / ACTIONS.length) * 100}%` }}
          />
        </div>
        {totalSavings > 0 && (
          <p className="text-slate-400 text-xs mt-3">
            🌳 Your actions are equivalent to planting {Math.round(totalSavings / 20)} trees per year
          </p>
        )}
      </div>

      {/* Easy wins */}
      <div>
        <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">
          🍃 Easy wins
        </h3>
        <div className="space-y-3">
          {easyActions.map(action => (
            <ActionCard
              key={action.id}
              action={action}
              completed={completedActions.includes(action.id)}
              onToggle={onToggle}
            />
          ))}
        </div>
      </div>

      {/* Medium effort */}
      <div>
        <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">
          💪 Medium effort
        </h3>
        <div className="space-y-3">
          {medActions.map(action => (
            <ActionCard
              key={action.id}
              action={action}
              completed={completedActions.includes(action.id)}
              onToggle={onToggle}
            />
          ))}
        </div>
      </div>

      {/* High impact */}
      <div>
        <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">
          🚀 High impact
        </h3>
        <div className="space-y-3">
          {hardActions.map(action => (
            <ActionCard
              key={action.id}
              action={action}
              completed={completedActions.includes(action.id)}
              onToggle={onToggle}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
