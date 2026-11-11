import { requireAdmin } from '../auth.js';
import { requireSupabase } from '../supabase.js';
import { isMissingSchema } from '../schema-error.js';

// Each check returns { status: 'ok' | 'warn' | 'fail' | 'info', detail, hint? }.
// Only whether a secret is SET is ever reported - never its value.
const DAY = 86400000;
const set = (name) => Boolean(process.env[name] && String(process.env[name]).trim());

async function timed(fn) {
  const t = Date.now();
  const out = await fn();
  return { ...out, ms: Date.now() - t };
}

const CHECKS = [
  {
    id: 'database', label: 'Database',
    run: async (sb) => {
      const { error, ms } = await timed(async () => sb.from('requests').select('id', { head: true, count: 'exact' }).limit(1));
      return error
        ? { status: 'fail', detail: 'Could not reach Supabase.', hint: 'Check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY, and that the project is not paused.' }
        : { status: ms > 1500 ? 'warn' : 'ok', detail: `Responding in ${ms} ms.` };
    },
  },
  {
    id: 'migration', label: 'Database updates',
    run: async (sb) => {
      const probes = await Promise.all([
        sb.from('audit_log').select('id', { head: true, count: 'exact' }).limit(1),
        sb.from('blocked_entries').select('id', { head: true, count: 'exact' }).limit(1),
        sb.from('requests').select('follow_up_at').limit(1),
      ]);
      const missing = probes.some((p) => p.error && isMissingSchema(p.error));
      return missing
        ? { status: 'warn', detail: 'The latest database update has not been applied.', hint: 'Run db/008_admin_toolkit.sql in the Supabase SQL editor.' }
        : { status: 'ok', detail: 'All tables and columns are in place.' };
    },
  },
  {
    id: 'storage', label: 'Document storage',
    run: async (sb) => {
      const { data, error } = await sb.storage.getBucket('documents');
      return error || !data
        ? { status: 'fail', detail: 'The "documents" storage bucket was not found.', hint: 'Run db/003_cms_and_announcements.sql, which creates it.' }
        : { status: 'ok', detail: 'The documents bucket is available.' };
    },
  },
  {
    id: 'email', label: 'Email sending',
    run: async () => {
      if (!set('RESEND_API_KEY') || !set('RESEND_FROM_EMAIL')) {
        return { status: 'fail', detail: 'Email is not configured.', hint: 'Set RESEND_API_KEY and RESEND_FROM_EMAIL (an address on a domain verified in Resend).' };
      }
      return set('TEAM_NOTIFY_EMAILS')
        ? { status: 'ok', detail: 'Sending is configured and the team alert list is set.' }
        : { status: 'warn', detail: 'Sending works, but nobody is set to receive new-lead alerts.', hint: 'Set TEAM_NOTIFY_EMAILS to a comma-separated list of addresses.' };
    },
  },
  {
    id: 'delivery', label: 'Email delivery (last 14 days)',
    run: async (sb) => {
      const { data, error } = await sb
        .from('requests').select('client_email_sent, team_email_sent')
        .gte('created_at', new Date(Date.now() - 14 * DAY).toISOString()).limit(2000);
      if (error) return { status: 'info', detail: 'Could not read recent requests.' };
      if (data.length === 0) return { status: 'info', detail: 'No requests in the last 14 days yet.' };
      const failed = data.filter((r) => !r.client_email_sent || !r.team_email_sent).length;
      return failed === 0
        ? { status: 'ok', detail: `All ${data.length} request(s) sent their emails.` }
        : { status: 'warn', detail: `${failed} of ${data.length} request(s) had an email that did not send.`, hint: 'Check your Resend domain verification and monthly limit.' };
    },
  },
  {
    id: 'form', label: 'Contact form',
    run: async (sb) => {
      const [last, visits] = await Promise.all([
        sb.from('requests').select('created_at').order('created_at', { ascending: false }).limit(1).maybeSingle(),
        sb.from('visits').select('id', { head: true, count: 'exact' }).gte('created_at', new Date(Date.now() - 7 * DAY).toISOString()),
      ]);
      if (last.error) return { status: 'fail', detail: 'Could not read requests.' };
      if (!last.data) return { status: 'info', detail: 'No request has been received yet.' };
      const days = Math.floor((Date.now() - new Date(last.data.created_at).getTime()) / DAY);
      const traffic = visits.count || 0;
      if (days >= 14 && traffic >= 100) {
        return { status: 'warn', detail: `No request for ${days} days despite ${traffic} visits this week.`, hint: 'Submit the form yourself to confirm it still works.' };
      }
      return { status: 'ok', detail: days === 0 ? 'Last request came in today.' : `Last request ${days} day${days === 1 ? '' : 's'} ago.` };
    },
  },
  {
    id: 'tracking', label: 'Visitor tracking',
    run: async (sb) => {
      const { count, error } = await sb.from('visits').select('id', { head: true, count: 'exact' }).gte('created_at', new Date(Date.now() - DAY).toISOString());
      if (error) return { status: 'fail', detail: 'Could not read visits.' };
      return count > 0
        ? { status: 'ok', detail: `${count} page view(s) recorded in the last 24 hours.` }
        : { status: 'warn', detail: 'No page views recorded in the last 24 hours.', hint: 'Open the site in a private window and check this again in a minute.' };
    },
  },
  {
    id: 'spam', label: 'Spam protection',
    run: async () =>
      set('TURNSTILE_SECRET_KEY')
        ? { status: 'ok', detail: 'Turnstile verification is switched on.' }
        : { status: 'warn', detail: 'Turnstile is not configured, so forms and admin sign-in are not bot-checked.', hint: 'Set TURNSTILE_SECRET_KEY and VITE_TURNSTILE_SITE_KEY.' },
  },
  {
    id: 'ai', label: 'AI assistant',
    run: async () =>
      set('GROQ_API_KEY')
        ? { status: 'ok', detail: 'The AI assistant key is set.' }
        : { status: 'warn', detail: 'GROQ_API_KEY is missing, so the AI assistant cannot answer.', hint: 'Add GROQ_API_KEY to your environment variables.' },
  },
  {
    id: 'secrets', label: 'Security settings',
    run: async () => {
      const jwtOk = set('JWT_SECRET') && process.env.JWT_SECRET.length >= 16;
      if (!jwtOk) return { status: 'fail', detail: 'JWT_SECRET is missing or too short.', hint: 'Set a long random value (32+ characters).' };
      return set('CRON_SECRET')
        ? { status: 'ok', detail: 'Session secret and scheduled-job secret are set.' }
        : { status: 'warn', detail: 'CRON_SECRET is not set, so daily reminders and cleanup will refuse to run.', hint: 'Set CRON_SECRET in your Vercel environment variables.' };
    },
  },
  {
    id: 'schedule', label: 'Scheduled jobs',
    run: async (sb) => {
      const { data, error } = await sb.from('audit_log').select('created_at').eq('action', 'system.daily-run').order('created_at', { ascending: false }).limit(1).maybeSingle();
      if (error) return { status: 'info', detail: 'Run history is not available yet.' };
      if (!data) return { status: 'info', detail: 'No scheduled run recorded yet. The first one is logged after the next 9:00 run.' };
      const days = (Date.now() - new Date(data.created_at).getTime()) / DAY;
      return days > 3
        ? { status: 'warn', detail: `The daily job last ran ${Math.floor(days)} days ago.`, hint: 'Check the Cron Jobs tab in Vercel and that CRON_SECRET is set.' }
        : { status: 'ok', detail: 'The daily job ran recently.' };
    },
  },
];

// GET -> { checks: [...], summary }. Every check is isolated: one failing never hides the rest.
export default requireAdmin(async (req, res) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method not allowed' });
  }
  let supabase;
  try {
    supabase = requireSupabase();
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: 'Server is not configured.' });
  }

  const checks = await Promise.all(
    CHECKS.map(async ({ id, label, run }) => {
      try {
        return { id, label, ...(await run(supabase)) };
      } catch (err) {
        console.error(`Health check ${id} crashed:`, err.message || err);
        return { id, label, status: 'fail', detail: 'This check could not run.' };
      }
    }),
  );
  const count = (s) => checks.filter((c) => c.status === s).length;
  return res.status(200).json({
    checks,
    summary: { ok: count('ok'), warn: count('warn'), fail: count('fail'), info: count('info') },
    checkedAt: new Date().toISOString(),
  });
});
