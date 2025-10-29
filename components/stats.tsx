import { Cable as Cube, Users, Zap, Globe } from "lucide-react"

const stats = [
  {
    icon: Cube,
    value: "10,000+",
    label: "3D Rooms Built",
    color: "text-primary",
  },
  {
    icon: Zap,
    value: "5,000+",
    label: "NFTs Minted",
    color: "text-secondary",
  },
  {
    icon: Users,
    value: "2,000+",
    label: "Active Creators",
    color: "text-accent",
  },
  {
    icon: Globe,
    value: "50+",
    label: "Countries",
    color: "text-primary",
  },
]

export function Stats() {
  return (
    <section className="py-20 bg-card/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div
                key={index}
                className={`text-center p-6 rounded-xl bg-background/50 border border-border hover:border-primary/50 transition-all duration-500 hover:neon-glow hover-lift animate-fade-in-up delay-${(index + 1) * 100} group`}
              >
                <Icon
                  className={`h-10 w-10 mx-auto mb-4 ${stat.color} transition-all duration-500 group-hover:rotate-[360deg] group-hover:scale-125`}
                />
                <div className="text-3xl font-bold mb-2 neon-text transition-all duration-300 group-hover:scale-110">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
