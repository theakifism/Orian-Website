import loginHandler from '../_lib/admin/login.js';
import logoutHandler from '../_lib/admin/logout.js';
import meHandler from '../_lib/admin/me.js';
import teamHandler from '../_lib/admin/team.js';
import teamManageHandler from '../_lib/admin/team-manage.js';
import requestsHandler from '../_lib/admin/requests.js';
import visitorsHandler from '../_lib/admin/visitors.js';
import documentsHandler from '../_lib/admin/documents.js';
import announcementsHandler from '../_lib/admin/announcements.js';
import changePasswordHandler from '../_lib/admin/change-password.js';
import aiInsightsHandler from '../_lib/admin/ai-insights.js';
import replyHandler from '../_lib/admin/reply.js';
import overviewHandler from '../_lib/admin/overview.js';
import analyticsHandler from '../_lib/admin/analytics.js';
import activityHandler from '../_lib/admin/activity.js';
import securityHandler from '../_lib/admin/security.js';
import healthHandler from '../_lib/admin/health.js';

const ROUTES = {
  login: loginHandler,
  logout: logoutHandler,
  me: meHandler,
  team: teamHandler,
  'team-manage': teamManageHandler,
  requests: requestsHandler,
  visitors: visitorsHandler,
  documents: documentsHandler,
  announcements: announcementsHandler,
  'change-password': changePasswordHandler,
  'ai-insights': aiInsightsHandler,
  reply: replyHandler,
  overview: overviewHandler,
  analytics: analyticsHandler,
  activity: activityHandler,
  security: securityHandler,
  health: healthHandler,
};

export default async function handler(req, res) {
  const { action } = req.query;
  const routeHandler = ROUTES[action];

  if (!routeHandler) {
    return res.status(404).json({ error: 'Not found' });
  }

  return routeHandler(req, res);
}