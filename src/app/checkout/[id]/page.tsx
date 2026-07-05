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

  return <CheckoutClient service={service} />;
}
