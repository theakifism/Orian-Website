import React from 'react';
import Dialog from './Dialog';
import LeadForm from './LeadForm';
import { useLang } from '../../context/LangContext';

const LeadDialog = ({ source, requirementType, initialMessage, open, onClose }) => {
  const { t } = useLang();
  return (
    <Dialog title={t('form.title')} onClose={onClose} open={open}>
      <p className="o2-lead" style={{ marginBottom: '1.2rem' }}>{t('form.lead')}</p>
      <LeadForm source={source} requirementType={requirementType} initialMessage={initialMessage} idPrefix="dlg" />
    </Dialog>
  );
};

export default LeadDialog;
