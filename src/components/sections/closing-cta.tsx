import Link from "next/link";
import { Button } from "@/components/ui/button";

export function ClosingCTA() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-24">
      <div className="relative overflow-hidden glass-strong rounded-card p-10 md:p-16 text-center bg-aurora">
        <h2 className="font-display text-3xl md:text-4xl font-bold max-w-2xl mx-auto">
          Your next room — or your next flatmate — is a match score away.
        </h2>
        <p className="mt-4 text-ink-muted max-w-lg mx-auto">
          Free to join. No spam in your DMs. Chat opens only once both sides say yes.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/register">
            <Button size="lg">Create your profile</Button>
          </Link>
          <Link href="/listings">
            <Button size="lg" variant="glass">
              Browse listings
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
