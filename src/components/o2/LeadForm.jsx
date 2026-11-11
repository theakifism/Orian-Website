import React from 'react';
import SpecialRequirement from '../SpecialRequirement';

/** Uses the site's persisted, consent-based enquiry flow for every sales form. */
const LeadForm = ({ source = 'page' }) => (
  <SpecialRequirement embedded initialRequirementType="Bulk SMS & OTP Gateway" source={source} />
);

export default LeadForm;
