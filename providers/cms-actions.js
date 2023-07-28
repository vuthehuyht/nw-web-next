export function getStrapiURL(path) {
  return `${
    process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337"
  }${path}`;
}

// Helper to make GET requests to Strapi
export async function fetchAPI(path) {
  const requestUrl = getStrapiURL(path);
  const response = await fetch(requestUrl);
  let data;
  try {
    data = await response.json();
  } catch (error) {
    data = null;
  }
  return data;
}

export async function getPageData(slug, preview = false) {
  // Find the pages that match this slug
  let pagesData;
  if (!preview) {
    pagesData = await fetchAPI(
      `/pages?slug=${slug}&status=published${preview ? "&status=draft" : ""}`
    );
  } else {
    pagesData = await fetchAPI(`/pages-draft?slug=${slug || ``}`);
  }

  // Make sure we found something, otherwise return null
  if (pagesData == null || pagesData.length === 0) {
    return null;
  }

  // Return the first item since there should only be one result per slug
  return pagesData[0];
}

// Get site data from Strapi (metadata, navbar, footer...)
export async function getGlobalData() {
  const global = fetchAPI("/global");
  return global;
}
