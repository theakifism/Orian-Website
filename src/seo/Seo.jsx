import React from 'react';
import { Head } from 'vite-react-ssg';
import { SITE_NAME, OG_IMAGE_ALT, LOCALE, buildUrl, ogImageFor } from './siteConfig';
import { breadcrumbSchema } from './jsonld';

/**
 * Drop this once near the top of every page component to set that page's
 * <title>, meta description, canonical URL, Open Graph / Twitter Card tags,
 * and (optionally) one or more JSON-LD structured-data blocks.
 *
 * `path` should be the route path (e.g. '/services/bulk-sms-otp-gateways')
 * so the canonical/OG URLs are built consistently from SITE_URL in one place.
 * `jsonLd` accepts a single schema object or an array of them.
 * `noindex` is for utility pages (404) that shouldn't be indexed.
 */
const Seo = ({
  title,
  description,
  path = '/',
  image,
  type = 'website',
  jsonLd,
  noindex = false,
}) => {
  const url = buildUrl(path);
  const ogImage = image || ogImageFor(path);
  const given = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];
  const crumbs = noindex ? null : breadcrumbSchema(path, title);
  const schemas = [...given, ...(crumbs ? [crumbs] : [])];

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      {!noindex && <link rel="canonical" href={url} />}
      {noindex ? (
        <meta name="robots" content="noindex, follow" />
      ) : (
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      )}
      <link rel="alternate" hrefLang="en-IN" href={url} />
      <link rel="alternate" hrefLang="x-default" href={url} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content={LOCALE} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:alt" content={OG_IMAGE_ALT} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={OG_IMAGE_ALT} />

      {schemas.map((schema, idx) => (
        <script key={idx} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Head>
  );
};

export default Seo;
