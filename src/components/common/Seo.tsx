export const SITE_NAME = 'Window Seat';
export const SITE_URL = 'https://www.windowseattrails.com';
const DEFAULT_DESCRIPTION = 'Window Seat Trails crafts fully customizable travel itineraries across India — pick your hotel, transport, and activities, and get a real-time quote in minutes.';
const DEFAULT_IMAGE = `${SITE_URL}/logo2.png`;

interface SeoProps {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  noindex?: boolean;
}

/**
 * React 19 hoists <title>/<meta>/<link> rendered anywhere in the tree into <head>,
 * so this can be dropped directly into any page component — no portal/helmet needed.
 */
export function Seo({ title, description = DEFAULT_DESCRIPTION, path = '', image = DEFAULT_IMAGE, noindex = false }: SeoProps) {
  const url = `${SITE_URL}${path}`;

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </>
  );
}
