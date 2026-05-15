import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: string;
  keywords?: string;
}

export function SEO({
  title = "Curated Smart Tech & Home Excellence",
  description = "Discover hand-picked premium gadgets, home essentials, and innovative tech finds. Verified for quality and value by our expert team.",
  image = "https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=1200&auto=format&fit=crop",
  url = typeof window !== 'undefined' ? window.location.href : "https://smartlivingfinds.com",
  type = "website",
  keywords = "smart home tech, tech deals, curated tech, best gadget finds, Pinterest gadgets"
}: SEOProps) {
  const siteName = "Smart Living Finds";
  const fullTitle = `${title} | ${siteName}`;

  return (
    <Helmet>
      {/* Standard Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content="index, follow" />

      {/* Google / Search Engine Tags */}
      <meta itemProp="name" content={fullTitle} />
      <meta itemProp="description" content={description} />
      <meta itemProp="image" content={image} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Pinterest Optimized Meta Tags */}
      <meta name="pinterest-rich-pin" content="true" />
      <meta name="pinterest:title" content={fullTitle} />
      <meta name="pinterest:description" content={description} />
      <meta name="pinterest:image" content={image} />
      
      {/* Product-specific tags for Pinterest (handled via type) */}
      {type === 'product' && (
        <>
          <meta property="og:price:amount" content="19.99" />
          <meta property="og:price:currency" content="USD" />
          <meta property="product:brand" content={siteName} />
          <meta property="product:availability" content="instock" />
          <meta property="product:condition" content="new" />
        </>
      )}

      {/* Canonical Link */}
      <link rel="canonical" href={url} />
    </Helmet>
  );
}
