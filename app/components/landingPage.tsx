import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Zap, Globe, DollarSign, Users, ArrowUpRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100/50">
      <header className="fixed top-0 w-full border-b bg-white/80 backdrop-blur-sm z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold">UZAR</span>
          </div>
          <nav className="hidden md:flex space-x-8">
            <Link href="#features" className="text-sm font-medium hover:text-blue-600 transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium hover:text-blue-600 transition-colors">
              How it Works
            </Link>
            <Link href="#use-cases" className="text-sm font-medium hover:text-blue-600 transition-colors">
              Use Cases
            </Link>
          </nav>
          <Button>Get Started</Button>
        </div>
      </header>

      <div className="lg:pt-[10rem] p-6">
        <div>
        <section className="relative overflow-hidden py-20 sm:py-32 lg:pb-32 xl:pb-36">
          <div className="container">
            <div className="lg:grid lg:grid-cols-12 lg:gap-x-8 lg:gap-y-20">
              <div className="relative z-10 mx-auto max-w-2xl lg:col-span-7 lg:max-w-none lg:pt-6 xl:col-span-6">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                  Bridging the Gap with <span className="text-blue-600">UZAR</span>
                </h1>
                <p className="mt-6 text-lg text-gray-600">
                  A groundbreaking stablecoin solution designed to revolutionize Africa's remittance landscape, making
                  transfers faster, cheaper, and more accessible.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                    Start Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button size="lg" variant="outline">
                    Learn More
                  </Button>
                </div>
                <div className="mt-10 grid grid-cols-3 gap-4 sm:mt-12">
                  {[
                    ["24/7 Transfers", "Instant"],
                    ["Transaction Fee", "< 0.1%"],
                    ["Global Access", "200+ Countries"],
                  ].map(([label, value]) => (
                    <div key={label} className="border rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">{value}</div>
                      <div className="mt-1 text-sm text-gray-600">{label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative mt-10 sm:mt-20 lg:col-span-5 lg:row-span-2 lg:mt-0 xl:col-span-6">
                <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
                  <Image
                    src="/placeholder.svg?height=600&width=600"
                    width={600}
                    height={600}
                    alt="UZAR Platform Interface"
                    className="rounded-2xl shadow-xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        </div>
        <section className="py-20 bg-white">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">Why UZAR Matters</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: DollarSign,
                  title: "High Costs",
                  description:
                    "Traditional remittance methods often involve hefty fees and unfavorable exchange rates.",
                },
                {
                  icon: Users,
                  title: "Lack of Accessibility",
                  description:
                    "Many people in Africa lack access to reliable banking services, making it difficult to receive remittances.",
                },
                {
                  icon: Zap,
                  title: "Lengthy Transfer Times",
                  description: "Cross-border transactions can take days or even weeks to complete.",
                },
              ].map((item) => (
                <div key={item.title} className="relative group">
                  <div className="absolute inset-0 rounded-2xl bg-blue-50 transform transition-transform group-hover:scale-105" />
                  <div className="relative p-6">
                    <item.icon className="h-12 w-12 text-blue-600 mb-4" />
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

