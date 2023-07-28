import { useRouter } from "next/router";
import clsx from "clsx";
import Container from "@material-ui/core/Container";
import Layout from "components/Layout";
import HeroSection from "./sections/hero";
import RichTextSection from "./sections/rich-text";
import BannerSection from "./sections/banner";
import StepsSection from "./sections/steps-section";

// Map Strapi sections to section components
const sectionComponents = {
  "sections.hero": HeroSection,
  "sections.rich-text": RichTextSection,
  "sections.banner": BannerSection,
  "sections.steps-section": StepsSection,
};
/* eslint-disable no-underscore-dangle */
// Display a section individually
const Section = ({ sectionData }) => {
  // Prepare the component
  const SectionComponent = sectionComponents[sectionData.__component];

  if (!SectionComponent) {
    return null;
  }

  // Display the section
  return <SectionComponent data={sectionData} />;
};

const PreviewModeBanner = () => {
  const router = useRouter();

  return (
    <div className="py-4 bg-red-600 text-red-100 font-semibold uppercase tracking-wide">
      <div className="container">
        Preview mode is on.{" "}
        <a
          className="underline"
          href={`/api/exit-preview?redirect=${router.asPath}`}
        >
          Turn off
        </a>
      </div>
    </div>
  );
};

// Display the list of sections
const Sections = ({ sections, preview, showHeaderFooter, className }) => (
  <Layout hiddenHeader={!showHeaderFooter} hiddenFooter={!showHeaderFooter}>
    <div className={clsx("flex flex-col", { "static-page": showHeaderFooter })}>
      {showHeaderFooter && (
        <Container>
          {/* Show a banner if preview mode is on */}
          {preview && <PreviewModeBanner />}

          <div className={`static-page-inner ${className}`}>
            {/* Show the actual sections */}
            {sections.map((section) => (
              <Section
                sectionData={section}
                key={`${section.__component}${section.id}`}
              />
            ))}
          </div>
        </Container>
      )}

      {!showHeaderFooter && (
        <>
          {/* Show a banner if preview mode is on */}
          {preview && <PreviewModeBanner />}

          <div className="static-page-inner">
            {/* Show the actual sections */}
            {sections.map((section) => (
              <Section
                sectionData={section}
                key={`${section.__component}${section.id}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  </Layout>
);

export default Sections;
