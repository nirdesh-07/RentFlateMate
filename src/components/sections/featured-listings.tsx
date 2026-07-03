import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ListingCard } from "@/components/sections/listing-card";
import { listings } from "@/lib/mock-data";

export function FeaturedListings() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-xs uppercase tracking-wider text-violet-soft mb-2">Fresh today</p>
          <h2 className="font-display text-3xl font-bold">Featured listings near you</h2>
        </div>
        <Link href="/listings" className="hidden sm:inline-flex items-center gap-1 text-sm text-ink-muted hover:text-ink">
          View all <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {listings.map((listing, i) => (
          <ListingCard key={listing.id} listing={listing} index={i} />
        ))}
      </div>
    </section>
  );
}
