import "./globals.css";

/* eslint-disable @next/next/no-page-custom-font -- App Router root layout loads these fonts site-wide. */

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: "Aura Jewels | Rang Mahal Temple Necklace Set",
  description: "A brass temple necklace set with gold-tone finish and colourful accents. Order from Aura Jewels with Cash on Delivery in Nepal.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Aura Jewels | Rang Mahal Temple Necklace Set",
    description: "A traditional temple necklace set with matching earrings. Order on Cash on Delivery.",
    type: "website",
    images: ["/temple-set-01.png"],
  },
  icons: { icon: "/aura-jewels-mark.svg", shortcut: "/aura-jewels-mark.svg", apple: "/aura-jewels-mark.svg" },
};

export default function RootLayout({ children }) {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Aura Jewels",
    url: siteUrl,
    email: process.env.BUSINESS_EMAIL || undefined,
  };

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }} />
      </body>
    </html>
  );
}
