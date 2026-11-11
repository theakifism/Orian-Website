import React from 'react';
import Dialog from './Dialog';
import AiAssistant from '../AiAssistant';
import AiOrb from './AiOrb';


/** Ctrl/Cmd+K: the AI assistant as a command bar, available on every page. */
const CommandBar = ({ onClose, question = '' }) => (
  <Dialog
    title="Ask Orian AI"
    onClose={onClose}
    wide
    className="is-ai"
    icon={<AiOrb size={36} />}
    subtitle="Ask a question about Orian services"
  >
    <AiAssistant embedded initialQuestion={question} />
  </Dialog>
);

export default CommandBar;
