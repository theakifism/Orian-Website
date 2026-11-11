import { LayoutDashboard, Kanban, ChartColumn, Megaphone, ShieldCheck, Settings } from 'lucide-react';

// The admin sections, in navigation order.
export const TABS = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'leads', label: 'Leads', icon: Kanban },
  { key: 'analytics', label: 'Analytics', icon: ChartColumn },
  { key: 'site', label: 'Site', icon: Megaphone },
  { key: 'system', label: 'System', icon: ShieldCheck },
  { key: 'settings', label: 'Settings', icon: Settings },
];
