import { Cable as Cube, Shield, Eye, Zap } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const features = [
  {
    icon: Cube,
    title: "Decentralization",
    description: "No single entity controls the system. Your 3D creations are truly yours, stored on the blockchain.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Shield,
    title: "Security",
    description: "Encrypted and tamper-proof NFTs. Your digital assets are protected by blockchain technology.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Eye,
    title: "Transparency",
    description: "Public, accountable transactions. Every NFT mint and transfer is visible and verifiable on-chain.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Zap,
    title: "Efficiency",
    description: "Faster, cost-effective processes. Mint and trade 3D room NFTs with minimal gas fees.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
]

export function Features() {
  return (
    <section id="features" className="py-20 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Why <span className="text-primary neon-text">3D NFTs</span>?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            3D NFTs are redefining trust in the digital world. Here's why it matters.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card
                key={index}
                className="bg-card border-border/50 hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20 group"
              >
                <CardContent className="p-6 text-center">
                  <div
                    className={`${feature.bgColor} w-16 h-16 rounded-xl flex items-center justify-center mb-4 mx-auto transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/30 border border-primary/20`}
                  >
                    <Icon className={`h-8 w-8 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 transition-colors duration-300 group-hover:text-primary">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
