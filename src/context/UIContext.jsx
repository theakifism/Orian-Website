import React, { createContext, lazy, Suspense, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { track } from '../utils/analytics';

const CommandBar = lazy(() => import('../components/o2/CommandBar'));
const LeadDialog = lazy(() => import('../components/o2/LeadDialog'));

const UIContext = createContext({ openLead: () => {}, openCommand: () => {} });

/**
 * App-wide dialogs. Both are code-split: nothing loads until first opened.
 *  - Ctrl/Cmd+K opens the AI command bar on every page.
 *  - openLead('source') opens the "Talk to us" form (hero area + nav).
 */
export const UIProvider = ({ children }) => {
  const [cmdOpen, setCmdOpen] = useState(false);
  const [leadOpen, setLeadOpen] = useState(false);
  const [leadSource, setLeadSource] = useState('');
  const [cmdQuestion, setCmdQuestion] = useState('');

  // openCommand() just opens the bar; openCommand('How fast can I go live?') opens it and asks that question.
  const openCommand = useCallback((question) => {
    setCmdQuestion(typeof question === 'string' ? question : '');
    setCmdOpen(true);
    track('command_bar_open', { prefilled: typeof question === 'string' });
  }, []);
  const openLead = useCallback((source = 'unknown') => { setLeadSource(source); setLeadOpen(true); track('lead_dialog_open', { source }); }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (window.location.pathname.startsWith('/admin')) return; // admin keeps its own shortcuts
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCmdQuestion('');
        setCmdOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const value = useMemo(() => ({ openLead, openCommand }), [openLead, openCommand]);

  return (
    <UIContext.Provider value={value}>
      {children}
      {(cmdOpen || leadOpen) && (
        <Suspense fallback={null}>
          {cmdOpen && <CommandBar question={cmdQuestion} onClose={() => setCmdOpen(false)} />}
          {leadOpen && <LeadDialog source={leadSource} onClose={() => setLeadOpen(false)} />}
        </Suspense>
      )}
    </UIContext.Provider>
  );
};

export const useUI = () => useContext(UIContext);
