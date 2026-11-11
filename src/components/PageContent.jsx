import React from 'react';
import { Head } from 'vite-react-ssg';
import { pageContent } from '../data/pageContent';
import { renderInline } from '../utils/inlineLinks';
import { faqSchema } from '../seo/jsonld';

/** Supporting copy + FAQs for hub and utility pages. FAQ text is also emitted as FAQPage JSON-LD. */
const PageContent = ({ id }) => {
  const c = pageContent[id];
  if (!c) return null;
  return (
    <section className="o2 o2-sec" data-section={`${id}-detail`}>
      {c.faqs?.length > 0 && (
        <Head>
          <script type="application/ld+json">{JSON.stringify(faqSchema(c.faqs))}</script>
        </Head>
      )}
      <div className="o2-wrap">
        <article className="o2-prose" style={{ maxWidth: '46rem' }}>
          {c.sections?.map((s) => (
            <React.Fragment key={s.title}>
              <h2>{s.title}</h2>
              {s.p && <p>{renderInline(s.p)}</p>}
              {s.ul && <ul>{s.ul.map((x) => <li key={x}>{renderInline(x)}</li>)}</ul>}
            </React.Fragment>
          ))}
          {c.faqs?.length > 0 && (
            <>
              <h2>{c.faqTitle || 'Frequently asked questions'}</h2>
              {c.faqs.map((f) => (
                <React.Fragment key={f.q}>
                  <h3>{f.q}</h3>
                  <p>{f.a}</p>
                </React.Fragment>
              ))}
            </>
          )}
        </article>
      </div>
    </section>
  );
};

export default PageContent;
