import loginHandler from '../_lib/admin/login.js';
import logoutHandler from '../_lib/admin/logout.js';
import meHandler from '../_lib/admin/me.js';
import teamHandler from '../_lib/admin/team.js';
import requestsHandler from '../_lib/admin/requests.js';
import visitorsHandler from '../_lib/admin/visitors.js';
import contentHandler from '../_lib/admin/content.js';
import documentsHandler from '../_lib/admin/documents.js';
import announcementsHandler from '../_lib/admin/announcements.js';
import changePasswordHandler from '../_lib/admin/change-password.js';
import aiInsightsHandler from '../_lib/admin/ai-insights.js';

const ROUTES = {
  login: loginHandler,
  logout: logoutHandler,
  me: meHandler,
  team: teamHandler,
  requests: requestsHandler,
  visitors: visitorsHandler,
  content: contentHandler,
  documents: documentsHandler,
  announcements: announcementsHandler,
  'change-password': changePasswordHandler,
  'ai-insights': aiInsightsHandler,
};

export default async function handler(req, res) {
  const { action } = req.query;
  const routeHandler = ROUTES[action];

  if (!routeHandler) {
    return res.status(404).json({ error: 'Not found' });
  }

  return routeHandler(req, res);
}