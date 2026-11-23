import React from 'react';
import SpecialRequirement from '../SpecialRequirement';

/** Uses the site's persisted, consent-based enquiry flow for every sales form. */
const LeadForm = ({ source = 'page', requirementType = 'General Enquiry', initialMessage = '' }) => (
  <SpecialRequirement embedded initialRequirementType={requirementType} initialMessage={initialMessage} source={source} />
);

export default LeadForm;
