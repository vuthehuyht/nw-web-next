/* eslint-disable */
import { useEffect } from "react";
import ErrorPage from "next/error";
// import Seo from '@components/elements/seo';
import { useRouter } from "next/router";
import _isEmpty from "lodash/isEmpty";
import { getStrapiURL, getPageData } from "providers/cms-actions";
import Sections from "components/Sections";

const DynamicPage = ({
  sections,
  preview,
  previewData = {},
  showHeaderFooter,
  className
}) => {
  const router = useRouter();

  useEffect(() => {
    if (!_isEmpty(previewData) && `/${previewData.slug}` !== router.asPath) {
      router.push(
        `/api/exit-preview?redirect=${encodeURIComponent(router.asPath)}`
      );
    }
  }, [previewData]);

  // Check if the required data was provided
  if (!router.isFallback && !sections?.length) {
    return <ErrorPage statusCode={404} />;
  }

  // Loading screen (only possible in preview mode)
  if (router.isFallback) {
    return <div className="container">Loading...</div>;
  }
  return (
    <>
      {/* Add meta tags for SEO */}
      {/* <Seo metadata={metadata} /> */}
      {/* Display content sections */}
      <Sections
        className={className}
        sections={sections}
        preview={preview}
        showHeaderFooter={showHeaderFooter}
      />
    </>
  );
};

export async function getStaticPaths() {
  // Get all pages from Strapi
  const response = await fetch(getStrapiURL("/pages"));
  const pages = await response.json();

  const paths = [];
  if (pages && pages.length > 0) {
    if (Array.isArray(pages)) {
      pages.map((page) => {
        // Decompose the slug that was saved in Strapi
        const slugArray = page.slug.split("__");
        paths.push({
          params: { slug: slugArray },
        });
      })
    }
  }
  return { paths, fallback: true };
}

export async function getStaticProps({
  params,
  preview = null,
  previewData = {},
}) {
  // Find the page data for the current slug
  let chainedSlugs;
  if (params === {} || !params.slug) {
    // To get the homepage, find the only page where slug is an empty string
    chainedSlugs = ``;
  } else {
    // Otherwise find a page with a matching slug
    // Recompose the slug that was saved in Strapi
    chainedSlugs = params.slug.join("__");
  }

  // Fetch pages. Include drafts if preview mode is on
  const pageData = await getPageData(chainedSlugs, preview);

  if (pageData == null) {
    // Giving the page no props will trigger a 404 page
    return { props: {}, revalidate: 1 };
  }
  // console.log('pageData: ', pageData);

  // We have the required page data, pass it to the page component
  const { contentSections, metadata = {}, showHeaderFooter, slug } = pageData;
  return {
    props: {
      preview,
      sections: contentSections,
      metadata,
      previewData: _isEmpty(previewData) ? {} : previewData,
      showHeaderFooter,
      className: slug
    },
    // we will attempt to re-generate the page:
    // - when a request comes in
    // - at most once every second
    revalidate: 1,
  };
}

export default DynamicPage;
