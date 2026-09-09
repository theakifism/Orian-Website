import { useState } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';

// Splits the plain-text response from the API into a headline paragraph and
// a bullet list, based on the "Headline: ... / Suggested actions: - ..."
// structure the Gemini prompt is instructed to always follow.
function parseInsights(text) {
  const actionsIdx = text.indexOf('Suggested actions:');
  const headline = (actionsIdx >= 0 ? text.slice(0, actionsIdx) : text)
    .replace(/^Headline:\s*/i, '')
    .trim();
  const actionsBlock = actionsIdx >= 0 ? text.slice(actionsIdx + 'Suggested actions:'.length) : '';
  const actions = actionsBlock
    .split('\n')
    .map((l) => l.replace(/^[-•]\s*/, '').trim())
    .filter(Boolean);
  return { headline, actions };
}

const AIInsights = () => {
  const [state, setState] = useState('idle'); // idle | loading | ready | error
  const [insights, setInsights] = useState(null);
  const [error, setError] = useState('');

  const generate = async () => {
    setState('loading');
    setError('');
    try {
      const res = await fetch('/api/admin/ai-insights', { method: 'POST', credentials: 'same-origin' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not generate insights.');
      setInsights({ ...parseInsights(data.text), generatedAt: data.generatedAt });
      setState('ready');
    } catch (err) {
      setError(err.message);
      setState('error');
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#00AEEF]/10 via-[var(--surface)] to-purple-500/10 border border-[var(--border)] rounded-xl p-5 mb-6">
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#00AEEF]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="relative z-10">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00AEEF] to-purple-500 flex items-center justify-center">
              <Sparkles size={15} className="text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold">AI Insights</h3>
              <p className="text-xs text-[var(--text-faint)]">Auto-generated summary of the last 14 days</p>
            </div>
          </div>
          <button
            onClick={generate}
            disabled={state === 'loading'}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#00AEEF] hover:bg-[#E8A23D] text-black transition-colors disabled:opacity-60"
          >
            <RefreshCw size={12} className={state === 'loading' ? 'animate-spin' : ''} />
            {state === 'loading' ? 'Thinking…' : insights ? 'Regenerate' : 'Generate insights'}
          </button>
        </div>

        {state === 'error' && <p className="text-sm text-red-400 mt-4">{error}</p>}

        {state === 'idle' && (
          <p className="text-sm text-[var(--text-dim)] mt-4">
            Get an instant, plain-English read on your leads and traffic — trends, standouts, and what to do about them.
          </p>
        )}

        {insights && state === 'ready' && (
          <div className="mt-4">
            <p className="text-sm leading-relaxed">{insights.headline}</p>
            {insights.actions.length > 0 && (
              <ul className="mt-3 space-y-1.5">
                {insights.actions.map((a, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-[#00AEEF] mt-0.5">▸</span>
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            )}
            <p className="text-[10px] text-[var(--text-faint)] mt-3">
              Generated {new Date(insights.generatedAt).toLocaleString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIInsights;
