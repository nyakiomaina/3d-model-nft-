import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function CTA() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-12 border border-primary/20">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-balance">
            Ready to Build Your <span className="text-primary neon-text">Digital Universe</span>?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
            Choose the plan that fits your needs and start exploring the power of 3D NFTs today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="neon-glow bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 py-6 text-lg group rounded-full"
            >
              <Link href="/create">
                Get Started with 3D NFTs
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-2 border-primary/50 hover:border-primary px-8 py-6 text-lg font-bold bg-transparent hover:bg-primary/10 rounded-full"
            >
              <Link href="/explore">Discover How It Works</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
