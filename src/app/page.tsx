import { Hero } from "@/components/sections/hero";
import { FeaturedListings } from "@/components/sections/featured-listings";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Testimonials } from "@/components/sections/testimonials";
import { FAQ } from "@/components/sections/faq";
import { ClosingCTA } from "@/components/sections/closing-cta";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedListings />
      <HowItWorks />
      <Testimonials />
      <FAQ />
      <ClosingCTA />
    </>
  );
}
