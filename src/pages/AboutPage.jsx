import PageHeader from '../components/PageHeader';
import Seo from '../seo/Seo';
import { pageMeta } from '../seo/pageMeta';
import About from '../components/About';
import PageContent from '../components/PageContent';

const AboutPage = () => {
  return (
    <>
      <Seo title={pageMeta.about.title} description={pageMeta.about.description} path={pageMeta.about.path} />
      <PageHeader
        eyebrow="About Orian"
        title="Business messaging"
        gradientWord="with Orian."
        subtitle="Meaningful communication for brands that value precision, credibility and long-term growth."
        breadcrumbs={[{ label: 'About' }]}
      />

      <About variant="full" />

    <PageContent id="about" />
    </>
  );
};

export default AboutPage;
