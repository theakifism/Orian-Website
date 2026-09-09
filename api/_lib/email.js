import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY || '';
const resend = resendApiKey ? new Resend(resendApiKey) : null;

const FROM_NAME = process.env.FROM_NAME || 'Orian Teleservices';
// Must be an address on a domain you've verified in Resend
// (https://resend.com/domains) — e.g. requests@yourdomain.com. Until then,
// Resend will only deliver to the email address your Resend account itself
// was signed up with — every other recipient (including real customers)
// gets rejected. There is no code-level workaround for this; it's enforced
// by Resend's servers. Verify your domain to lift the restriction.
const FROM_EMAIL_ADDRESS = process.env.RESEND_FROM_EMAIL || '';
const FROM_EMAIL = FROM_EMAIL_ADDRESS ? `${FROM_NAME} <${FROM_EMAIL_ADDRESS}>` : '';

const TEAM_NOTIFY_EMAILS = (process.env.TEAM_NOTIFY_EMAILS || '')
  .split(',')
  .map((e) => e.trim())
  .filter(Boolean);

// Wraps every send so a failure never throws — it just reports
// { ok: false, reason }. Callers use this to decide what to record in the
// database, but should NEVER fail the user's form submission over it.
async function safeSend(payload) {
  if (!resend) {
    console.error('Email not sent: RESEND_API_KEY is missing.');
    return { ok: false, reason: 'not_configured' };
  }
  if (!FROM_EMAIL_ADDRESS) {
    console.error('Email not sent: RESEND_FROM_EMAIL is missing.');
    return { ok: false, reason: 'not_configured' };
  }
  try {
    const { data, error } = await resend.emails.send({ from: FROM_EMAIL, ...payload });
    if (error) {
      const isQuota =
        error.statusCode === 429 ||
        /quota|exceeded|rate limit|too many/i.test(error.message || '');
      console.error('Resend error:', error.message || error);
      return { ok: false, reason: isQuota ? 'quota_exceeded' : 'send_failed' };
    }
    return { ok: true, id: data?.id };
  } catch (err) {
    console.error('Resend error:', err.message || err);
    return { ok: false, reason: 'send_failed' };
  }
}

export async function sendClientThankYou(submission) {
  return safeSend({
    to: submission.email,
    subject: 'Thanks for reaching out to Orian Teleservices',
    html: `
      <div style="font-family: Arial, sans-serif; color: #111; line-height: 1.6;">
        <p>Hi ${escapeHtml(submission.name)},</p>
        <p>
          Thank you for telling us about your requirement — we've received your
          request and a member of our team will get back to you within
          24 hours.
        </p>
        <p style="margin: 16px 0; padding: 12px 16px; background: #f4f6f8; border-radius: 8px;">
          <strong>What you shared:</strong><br/>
          Requirement type: ${escapeHtml(submission.requirementType || 'Not specified')}<br/>
          Message: ${escapeHtml(submission.message)}
        </p>
        <p>In the meantime, feel free to reply directly to this email with any additional details.</p>
        <p>Warm regards,<br/>Orian Teleservices</p>
      </div>
    `,
  });
}

export async function sendTeamAlert(submission) {
  if (TEAM_NOTIFY_EMAILS.length === 0) {
    console.error('Email not sent: TEAM_NOTIFY_EMAILS is empty.');
    return { ok: false, reason: 'not_configured' };
  }
  return safeSend({
    to: TEAM_NOTIFY_EMAILS,
    subject: `New requirement request: ${submission.name}${submission.company ? ` (${submission.company})` : ''}`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #111; line-height: 1.6;">
        <p>A new Special Requirement submission just came in.</p>
        <ul>
          <li><strong>Name:</strong> ${escapeHtml(submission.name)}</li>
          <li><strong>Email:</strong> ${escapeHtml(submission.email)}</li>
          <li><strong>Contact:</strong> ${escapeHtml(submission.contact)}</li>
          <li><strong>Company:</strong> ${escapeHtml(submission.company || '—')}</li>
          <li><strong>Requirement type:</strong> ${escapeHtml(submission.requirementType || '—')}</li>
        </ul>
        <p><strong>Message:</strong><br/>${escapeHtml(submission.message)}</p>
        <p>View it in the admin panel for full details.</p>
      </div>
    `,
  });
}

// Sent to the whole team (not just the targeted account) the moment an
// admin account auto-locks from repeated failed sign-ins, so someone
// notices fast if it looks like an actual break-in attempt rather than a
// colleague fumbling their own password.
export async function sendAccountLockAlert({ targetName, targetEmail, attempts, lockMinutes, ip, region, device }) {
  if (TEAM_NOTIFY_EMAILS.length === 0) {
    console.error('Email not sent: TEAM_NOTIFY_EMAILS is empty.');
    return { ok: false, reason: 'not_configured' };
  }
  return safeSend({
    to: TEAM_NOTIFY_EMAILS,
    subject: `Security alert: ${targetName}'s admin account was locked`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #111; line-height: 1.6;">
        <p><strong>${escapeHtml(targetEmail)}</strong> was locked out of the Orian admin panel after
        ${attempts} wrong password attempts in a row.</p>
        <ul>
          <li><strong>IP address:</strong> ${escapeHtml(ip || 'unknown')}</li>
          <li><strong>Region:</strong> ${escapeHtml(region || 'unknown')}</li>
          <li><strong>Device:</strong> ${escapeHtml(device || 'unknown')}</li>
        </ul>
        <p>The account unlocks itself automatically in ${lockMinutes} minutes. If this was
        ${escapeHtml(targetName)} mistyping their own password, no action is needed. If this
        doesn't look right, consider resetting that account's password right away.</p>
      </div>
    `,
  });
}

export async function sendWeeklyDigest(stats) {
  if (TEAM_NOTIFY_EMAILS.length === 0) {
    console.error('Weekly digest not sent: TEAM_NOTIFY_EMAILS is empty.');
    return { ok: false, reason: 'not_configured' };
  }

  const statusRows = Object.entries(stats.leadsByStatus)
    .map(([status, count]) => `<li><strong>${escapeHtml(status)}:</strong> ${count}</li>`)
    .join('');

  const topPageRows = stats.topPages
    .map((p) => `<li>${escapeHtml(p.value)} — ${p.count} visit${p.count === 1 ? '' : 's'}</li>`)
    .join('');

  return safeSend({
    to: TEAM_NOTIFY_EMAILS,
    subject: `Orian weekly digest: ${stats.newLeads} new lead${stats.newLeads === 1 ? '' : 's'}, ${stats.totalVisits} visits`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #111; line-height: 1.6; max-width: 560px;">
        <h2 style="margin-bottom: 4px;">Weekly digest</h2>
        <p style="color: #666; margin-top: 0;">${escapeHtml(stats.rangeLabel)}</p>

        <div style="display: flex; gap: 16px; margin: 20px 0;">
          <div style="background:#f4f6f8; border-radius:8px; padding:14px 18px;">
            <div style="font-size:12px; color:#666; text-transform:uppercase;">New leads</div>
            <div style="font-size:28px; font-weight:bold;">${stats.newLeads}</div>
          </div>
          <div style="background:#f4f6f8; border-radius:8px; padding:14px 18px;">
            <div style="font-size:12px; color:#666; text-transform:uppercase;">Website visits</div>
            <div style="font-size:28px; font-weight:bold;">${stats.totalVisits}</div>
          </div>
          <div style="background:#f4f6f8; border-radius:8px; padding:14px 18px;">
            <div style="font-size:12px; color:#666; text-transform:uppercase;">Unique visitors</div>
            <div style="font-size:28px; font-weight:bold;">${stats.uniqueVisitors}</div>
          </div>
        </div>

        <p><strong>Leads by status:</strong></p>
        <ul>${statusRows || '<li>No leads this week.</li>'}</ul>

        <p><strong>Top pages this week:</strong></p>
        <ul>${topPageRows || '<li>No visits recorded.</li>'}</ul>

        <p style="margin-top: 24px;">View full details in the <a href="${escapeHtml(stats.dashboardUrl)}">admin panel</a>.</p>
      </div>
    `,
  });
}

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
