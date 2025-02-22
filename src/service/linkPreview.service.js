export const tryMakeMetadata = async (url) => {
  const websiteContent = await getHttpContent(url);
  return {
    title: getTitleMetaTag(websiteContent) || getTitleFromHTML(websiteContent),
    description: getDescriptionMetaTag(websiteContent),
    images: [getImageMetaTag(websiteContent)],
    siteName: getSiteNameMetaTag(websiteContent),
    favicons: [getFaviconMetaTag(websiteContent)],
  };
};

const getHttpContent = async (url) => {
  const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  return response.ok ? await response.text() : '';
};

const getMetaTagByProperty = (content, property) => {
  const regex = new RegExp(`<meta[^>]+property=["']${property}["'][^>]+content=["'](.*?)["']`, 'i');
  const match = content.match(regex);
  return match ? match[1] : '';
};

const getMetaTagByName = (content, name) => {
  const regex = new RegExp(`<meta[^>]+name=["']${name}["'][^>]+content=["'](.*?)["']`, 'i');
  const match = content.match(regex);
  return match ? match[1] : '';
};

const getMetaTagByRel = (content, rel) => {
  const regex = new RegExp(`<link[^>]+rel=["']${rel}["'][^>]+href=["'](.*?)["']`, 'i');
  const match = content.match(regex);
  return match ? match[1] : '';
};

const getTitleMetaTag = (content) => {
  return getMetaTagByProperty(content, 'og:title') || getMetaTagByName(content, 'twitter:title');
};

const getTitleFromHTML = (content) => {
  const match = content.match(/<title>(.*?)<\/title>/i);
  return match ? match[1] : '';
};

const getDescriptionMetaTag = (content) => {
  return (
    getMetaTagByProperty(content, 'og:description') ||
    getMetaTagByName(content, 'description') ||
    getMetaTagByName(content, 'twitter:description')
  );
};

const getImageMetaTag = (content) => {
  return (
    getMetaTagByProperty(content, 'og:image') ||
    getMetaTagByProperty(content, 'og:image:url') ||
    getMetaTagByProperty(content, 'twitter:image') ||
    getMetaTagByProperty(content, 'twitter:image:src')
  );
};

const getSiteNameMetaTag = (content) => {
  return getMetaTagByProperty(content, 'og:site_name') || getMetaTagByProperty(content, 'og:siteName');
};

const getFaviconMetaTag = (content) => {
  return (
    getMetaTagByRel(content, 'icon') ||
    getMetaTagByRel(content, 'shortcut icon') ||
    getMetaTagByRel(content, 'apple-touch-icon') ||
    getMetaTagByRel(content, 'apple-touch-icon-precomposed')
  );
};
