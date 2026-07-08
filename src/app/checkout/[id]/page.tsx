import { services } from "@/data/services";
import CheckoutClient from "./CheckoutClient";
import { notFound } from "next/navigation";

// Generate static params for GitHub Pages static export
export function generateStaticParams() {
  return services.map((service) => ({
    id: service.id,
  }));
}

export default async function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const service = services.find((s) => s.id === resolvedParams.id);
  
  if (!service) {
    notFound();
  }

  // Construct dynamic Product Schema for search engine indexing
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": service.name,
    "image": service.logoUrl.startsWith("http") ? service.logoUrl : `https://langgananyuk.web.id${service.logoUrl}`,
    "description": service.description || `Patungan akun premium ${service.name} legal & murah di Indonesia.`,
    "offers": {
      "@type": "Offer",
      "priceCurrency": "IDR",
      "price": service.sharedPrice,
      "availability": "https://schema.org/InStock",
      "url": `https://langgananyuk.web.id/checkout/${service.id}`
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <CheckoutClient service={service} />
    </>
  );
}
