import React from 'react';
import DiagramRings from './DiagramRings';
import { HeadsetIcon, TagIcon, ShieldCheckIcon, BoltIcon, TowerIcon, TrendUpIcon } from './CardIcons';

const ICONS = {
  headset: HeadsetIcon,
  tag: TagIcon,
  shield: ShieldCheckIcon,
  bolt: BoltIcon,
  tower: TowerIcon,
  trend: TrendUpIcon,
};

// reason: the full entry from data/whyUs.js (needs .icon and .color, both
// already defined there for the card badges — reused here for consistency).
const WhyUsIllustration = ({ reason }) => {
  const Icon = ICONS[reason.icon] || ShieldCheckIcon;
  return <DiagramRings color={reason.color} accent="#00AEEF" icon={<Icon className="w-8 h-8" />} />;
};

export default WhyUsIllustration;
