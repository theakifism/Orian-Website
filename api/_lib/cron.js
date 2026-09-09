// Vercel automatically sends `Authorization: Bearer <CRON_SECRET>` on every
// request it makes to a Cron-configured endpoint, as long as CRON_SECRET is
// set in your project's environment variables. Checking it here stops
// anyone else from hitting these URLs directly and triggering a cleanup or
// a mass email send on demand.
// Docs: https://vercel.com/docs/cron-jobs/manage-cron-jobs#securing-cron-jobs
export function requireCron(handler) {
  return async (req, res) => {
    const secret = process.env.CRON_SECRET;
    if (!secret) {
      console.error('CRON_SECRET is not set — refusing to run scheduled job.');
      return res.status(500).json({ error: 'Server is not configured.' });
    }
    const auth = req.headers.authorization || '';
    if (auth !== `Bearer ${secret}`) {
      return res.status(401).json({ error: 'Not authorized.' });
    }
    return handler(req, res);
  };
}
