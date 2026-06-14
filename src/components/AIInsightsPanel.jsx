import { useEffect, useState } from 'react';
import { useAIInsights, useAIChat } from '../hooks/useAIInsights';

function InsightsCard({ insights, loading }) {
  if (loading) {
    return (
      <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 animate-pulse">
        <div className="h-4 bg-slate-700 rounded mb-3 w-3/4"></div>
        <div className="h-4 bg-slate-700 rounded mb-3"></div>
        <div className="h-4 bg-slate-700 rounded w-5/6"></div>
        <div className="mt-4 text-center text-slate-500 text-sm">Analyzing your footprint...</div>
      </div>
    );
  }

  if (!insights) return null;

  return (
    <div className="space-y-4">
      {/* Assessment */}
      <div className="bg-gradient-to-br from-blue-900/30 to-slate-800 rounded-2xl p-5 border border-blue-800/30">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🤖</span>
          <div>
            <p className="text-blue-300 text-xs font-semibold uppercase tracking-wider mb-2">EcoAdvisor Assessment</p>
            <p className="text-slate-200 text-sm leading-relaxed">{insights.assessment}</p>
          </div>
        </div>
      </div>

      {/* Areas to improve */}
      {insights.improvements && (
        <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700">
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
            <span>📍</span> Key opportunities
          </h3>
          <ul className="space-y-2">
            {insights.improvements.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                <span className="text-orange-400 mt-0.5">→</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tips */}
      {insights.tips && (
        <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700">
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
            <span>💡</span> Personalized tips
          </h3>
          <div className="space-y-3">
            {insights.tips.map((tip, i) => (
              <div key={i} className="bg-slate-700/50 rounded-xl p-3">
                <p className="text-white text-sm font-medium">{tip.action}</p>
                <p className="text-green-400 text-xs mt-1 font-mono">{tip.impact}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Motivation */}
      {insights.motivation && (
        <div className="bg-green-900/20 rounded-2xl p-4 border border-green-800/30">
          <p className="text-green-300 text-sm text-center">🌱 {insights.motivation}</p>
        </div>
      )}
    </div>
  );
}

function ChatMessage({ message }) {
  const isUser = message.role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
        isUser
          ? 'bg-green-600 text-white rounded-br-sm'
          : 'bg-slate-700 text-slate-200 rounded-bl-sm'
      }`}>
        {!isUser && (
          <span className="text-xs text-slate-400 block mb-1">🤖 EcoAdvisor</span>
        )}
        {message.content}
      </div>
    </div>
  );
}

export default function AIInsightsPanel({ footprint, completedActions, profile }) {
  const { loading: insightLoading, insights, fetchInsights } = useAIInsights();
  const { messages, loading: chatLoading, sendMessage, clearChat } = useAIChat();
  const [chatInput, setChatInput] = useState('');
  const [tab, setTab] = useState('insights');

  useEffect(() => {
    fetchInsights(footprint, completedActions, profile);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSend = () => {
    if (!chatInput.trim() || chatLoading) return;
    sendMessage(chatInput, footprint);
    setChatInput('');
  };

  const quickQuestions = [
    "What's my biggest source of emissions?",
    "How can I reduce my food footprint?",
    "Is my commute sustainable?",
    "What are the easiest first steps?",
  ];

  return (
    <div className="space-y-4">
      {/* Tab switcher */}
      <div className="flex bg-slate-800 rounded-xl p-1 border border-slate-700">
        {[
          { id: 'insights', label: '✨ Insights' },
          { id: 'chat', label: '💬 Ask EcoAdvisor' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === t.id ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'insights' ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-slate-400 text-sm">AI-generated based on your data</p>
            <button
              onClick={() => fetchInsights(footprint, completedActions, profile)}
              disabled={insightLoading}
              className="text-green-400 text-sm hover:text-green-300 disabled:opacity-50 transition-colors"
            >
              {insightLoading ? '⏳ Analyzing...' : '↺ Refresh'}
            </button>
          </div>
          <InsightsCard insights={insights} loading={insightLoading} />
        </div>
      ) : (
        <div className="flex flex-col h-[500px]">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-3 pb-3">
            {messages.map((msg, i) => (
              <ChatMessage key={i} message={msg} />
            ))}
            {chatLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-700 rounded-2xl px-4 py-3 rounded-bl-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick questions */}
          {messages.length <= 1 && (
            <div className="py-2">
              <p className="text-slate-500 text-xs mb-2">Try asking:</p>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map(q => (
                  <button
                    key={q}
                    onClick={() => { sendMessage(q, footprint); }}
                    className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 px-3 py-1.5 rounded-full transition-colors border border-slate-600"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="flex gap-2 pt-3 border-t border-slate-700">
            <input
              type="text"
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask about your carbon footprint..."
              className="flex-1 bg-slate-700 border border-slate-600 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-green-500"
            />
            <button
              onClick={handleSend}
              disabled={!chatInput.trim() || chatLoading}
              className="bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white px-4 py-2.5 rounded-xl transition-colors text-sm font-medium"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
