import { GoogleGenAI } from '@google/genai';
import { generateContentWithRetry, isGeminiOverloaded } from '../gemini.js';
import { requireAdmin } from '../auth.js';
import { requireSupabase } from '../supabase.js';
import { daysAgoIso } from '../dates.js';

const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const SYSTEM_INSTRUCTION = `
You are an analytics assistant summarizing internal business data for the Orian Teleservices
admin dashboard. You will be given raw JSON stats about leads (requests) and website visitors.

Write a short, sharp executive briefing:
- 2-3 sentences of plain-English headline takeaways (trends, anything notable/unusual).
- A "Suggested actions" list of 2-4 concrete, specific next steps for the team (e.g. which lead
  types to follow up on, which pages/sources are driving the most traffic).
- No generic filler ("keep up the good work"). If the data is too thin to say anything
  meaningful, say so plainly instead of inventing a story.
- Output plain text only, no markdown headers, using this exact structure:

Headline: <2-3 sentences>

Suggested actions:
- <action 1>
- <action 2>
`.trim();

// This endpoint is on-demand (button click), not polled automatically, to
// keep Gemini API usage inside the free tier — insights are cheap to
// generate but there's no reason to burn quota on data nobody is viewing.
export default requireAdmin(async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!ai) {
    return res.status(500).json({ error: 'AI insights are not configured (GEMINI_API_KEY missing).' });
  }

  let supabase;
  try {
    supabase = requireSupabase();
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: 'Server is not configured.' });
  }

  const since = daysAgoIso(14);

  const [requestsRes, statusBreakdownRes, typeBreakdownRes, visitsRes] = await Promise.all([
    supabase.from('requests').select('id', { count: 'exact', head: true }).gte('created_at', since),
    supabase.from('requests').select('status').gte('created_at', since),
    supabase.from('requests').select('requirement_type').gte('created_at', since),
    supabase.from('visits').select('path, device, country').gte('created_at', since).limit(3000),
  ]);

  const firstError = [requestsRes, statusBreakdownRes, typeBreakdownRes, visitsRes].find((r) => r.error);
  if (firstError) {
    console.error('Failed to gather stats for AI insights:', firstError.error.message);
    return res.status(500).json({ error: 'Could not gather data for insights.' });
  }

  const countBy = (rows, key) => {
    const counts = {};
    for (const row of rows) {
      const v = row[key] || 'Unspecified';
      counts[v] = (counts[v] || 0) + 1;
    }
    return counts;
  };

  const stats = {
    period: 'last 14 days',
    newLeads: requestsRes.count || 0,
    leadsByStatus: countBy(statusBreakdownRes.data || [], 'status'),
    leadsByRequirementType: countBy(typeBreakdownRes.data || [], 'requirement_type'),
    totalVisits: (visitsRes.data || []).length,
    visitsByPage: countBy(visitsRes.data || [], 'path'),
    visitsByDevice: countBy(visitsRes.data || [], 'device'),
    visitsByCountry: countBy(visitsRes.data || [], 'country'),
  };

  try {
    const response = await generateContentWithRetry(ai, {
      model: 'gemini-3.6-flash',
      contents: [{ role: 'user', parts: [{ text: JSON.stringify(stats) }] }],
      config: { systemInstruction: SYSTEM_INSTRUCTION },
    });

    const text = response.text ?? 'Not enough data yet to generate insights.';
    return res.status(200).json({ text, generatedAt: new Date().toISOString(), stats });
  } catch (err) {
    console.error('Gemini insights error:', err);
    if (isGeminiOverloaded(err)) {
      return res.status(503).json({ error: 'Gemini is getting a lot of requests right now — please try again in a moment.' });
    }
    return res.status(500).json({ error: 'Failed to generate insights. Please try again shortly.' });
  }
});
