import React from 'react';
import DiagramRings from './DiagramRings';
import {
  BankIcon, BriefcaseIcon, ServerIcon, GraduationCapIcon, PulseIcon,
  BellConciergeIcon, CodeBracketsIcon, GearIcon, PlayCircleIcon, TenantBuildingIcon,
  DerrickIcon, CapsuleIcon, PowerBoltIcon, HouseKeyIcon, ApartmentIcon,
  ShoppingBagIcon, SignalTowerIcon, SpoolIcon, CarIcon, BasketIcon,
} from './IndustryIcons';

// industries.js only carries a Tailwind color *name* (cyan, blue, rose...)
// for the hover-glow classes — this maps the same names to the hex values
// the SVG diagrams need for stroke/fill/glow.
export const INDUSTRY_HEX = {
  cyan: '#00AEEF', blue: '#3B82F6', purple: '#00AEEF', emerald: '#00AEEF',
  rose: '#00AEEF', green: '#22C55E', indigo: '#6366F1', orange: '#F97316',
  pink: '#EC4899', teal: '#14B8A6', lime: '#84CC16', sky: '#0EA5E9',
  violet: '#00AEEF', fuchsia: '#D946EF', red: '#EF4444',
};

const ICONS = {
  banking: BankIcon,
  corporates: BriefcaseIcon,
  'data-centers': ServerIcon,
  'educational-institutes': GraduationCapIcon,
  'healthcare-hospitals': PulseIcon,
  'hotels-hospitality': BellConciergeIcon,
  'it-services': CodeBracketsIcon,
  manufacturing: GearIcon,
  'media-entertainment': PlayCircleIcon,
  'multi-tenant-facilities': TenantBuildingIcon,
  'oil-gas': DerrickIcon,
  pharmaceuticals: CapsuleIcon,
  'power-energy': PowerBoltIcon,
  'real-estate': HouseKeyIcon,
  'residential-premises': ApartmentIcon,
  retail: ShoppingBagIcon,
  telecom: SignalTowerIcon,
  'textile-industries': SpoolIcon,
  automobiles: CarIcon,
  fmcg: BasketIcon,
};

// industry: the full entry from data/industries.js (needs .slug and .color)
const IndustryIllustration = ({ industry }) => {
  const Icon = ICONS[industry.slug] || BriefcaseIcon;
  const color = INDUSTRY_HEX[industry.color] || '#00AEEF';
  return <DiagramRings color={color} accent="#00AEEF" icon={<Icon className="w-8 h-8" />} />;
};

export default IndustryIllustration;
