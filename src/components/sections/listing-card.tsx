"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CompatibilityRing } from "@/components/ui/compatibility-ring";
import { formatRupees } from "@/lib/utils";
import type { Listing } from "@/lib/mock-data";

export function ListingCard({ listing, index = 0 }: { listing: Listing; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
    >
      <Card className="group overflow-hidden hover:border-white/20 transition-colors h-full flex flex-col">
        <div className="relative h-44 w-full overflow-hidden">
          <Image
            src={listing.image}
            alt={listing.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-base-deep/80 via-transparent to-transparent" />
          <div className="absolute top-3 right-3">
            <CompatibilityRing score={listing.score} size={56} strokeWidth={5} />
          </div>
          <div className="absolute bottom-3 left-3">
            <Badge variant="violet">{listing.roomType}</Badge>
          </div>
        </div>

        <div className="p-5 flex flex-col gap-3 flex-1">
          <h3 className="font-display font-semibold leading-snug line-clamp-2">{listing.title}</h3>

          <div className="flex items-center gap-1.5 text-sm text-ink-muted">
            <MapPin className="h-3.5 w-3.5" />
            {listing.locality}, {listing.city}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {listing.amenities.slice(0, 3).map((a) => (
              <Badge key={a}>{a}</Badge>
            ))}
          </div>

          <p className="text-xs text-ink-faint leading-relaxed">{listing.scoreExplanation}</p>

          <div className="mt-auto pt-3 border-t border-glass-border flex items-end justify-between">
            <div>
              <div className="font-data text-lg font-semibold text-ink">
                {formatRupees(listing.rent)}
                <span className="text-xs font-normal text-ink-faint">/mo</span>
              </div>
              <div className="text-[11px] text-ink-faint">Deposit {formatRupees(listing.deposit)}</div>
            </div>
            <div className="flex items-center gap-1 text-xs text-ink-muted">
              <Users className="h-3.5 w-3.5" />
              {listing.occupancy.current}/{listing.occupancy.max}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
