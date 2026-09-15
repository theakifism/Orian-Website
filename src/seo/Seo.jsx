import React from 'react';
import { Head } from 'vite-react-ssg';
import { SITE_NAME, DEFAULT_OG_IMAGE, buildUrl } from './siteConfig';

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
  image = DEFAULT_OG_IMAGE,
  type = 'website',
  jsonLd,
  noindex = false,
}) => {
  const url = buildUrl(path);
  const schemas = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {schemas.map((schema, idx) => (
        <script key={idx} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Head>
  );
};

export default Seo;
