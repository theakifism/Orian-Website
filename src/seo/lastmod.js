// Shared "last modified" rule for guides, used by the sitemap (<lastmod>) and the Article
// JSON-LD (dateModified) so the two can never disagree. Set `modified: 'YYYY-MM-DD'` on a
// guide in src/data/guides.js when you materially update it; otherwise its publish date is used.
export const guideModified = (guide) => guide.modified || guide.date;
