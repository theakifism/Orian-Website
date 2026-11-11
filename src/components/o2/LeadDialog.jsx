import React from 'react';
import Dialog from './Dialog';
import LeadForm from './LeadForm';
import { useLang } from '../../context/LangContext';

const LeadDialog = ({ source, onClose }) => {
  const { t } = useLang();
  return (
    <Dialog title={t('form.title')} onClose={onClose}>
      <p className="o2-lead" style={{ marginBottom: '1.2rem' }}>{t('form.lead')}</p>
      <LeadForm source={source} idPrefix="dlg" />
    </Dialog>
  );
};

export default LeadDialog;
