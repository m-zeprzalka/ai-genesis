"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import BrandSection from "@/components/sections/BrandSection"
import DesignSection from "@/components/sections/DesignSection"
import ProductSection from "@/components/sections/ProductSection"
import MarketingSection from "@/components/sections/MarketingSection"
import TechSection from "@/components/sections/TechSection"

interface GenesisResponse {
  brand: {
    selectedName: string
    nameOptions: string[]
    brandStory: string
    voiceAndTone: string
    competitorPositioning: string
    coreValues: string[]
  }
  design: {
    logoDescription: string
    logoVariations: string[]
    colorPalette: {
      primary: string
      secondary: string
      accent: string
    }
    typography: {
      heading: string
      body: string
    }
    designPrinciples: string[]
    keyScreens: Array<{ screen: string; description: string }>
    personas: Array<{
      name: string
      age: string
      occupation: string
      emotionalDrivers: string[]
      motivations: string[]
    }>
  }
  product: {
    problemStatement: string
    solution: string
    keyBenefits: string[]
    uniqueValueProposition: string
    pricingStrategy: string
    revenueModel: string
  }
  marketing: {
    launchCampaign: {
      week1: string
      week2: string
      week3: string
      week4: string
    }
    contentPillars: string[]
    influencerStrategy: string
    paidAdsCopy: Array<{ platform: string; headline: string; body: string }>
    prStrategy: string
  }
  tech: {
    stack: string
    mvpTimeline: string
    estimatedBudget: string
    technicalRisks: string[]
  }
}

export default function Home() {
  const [prompt, setPrompt] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<GenesisResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Opisz swój pomysł na biznes")
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch("/api/generate-business", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Błąd API")
      }

      const data: GenesisResponse = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nieznany błąd")
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleGenerate()
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto py-12 px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-3 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Projekt Genesis
          </h1>
          <p className="text-2xl text-muted-foreground mb-2">
            AI Agency Core • Kompletny Biznes w 60 sekund
          </p>
          <p className="text-sm text-muted-foreground">
            5 Działów AI: Strategia • Design • Produkt • Marketing • Tech
          </p>
        </div>

        {/* Input Section */}
        <Card className="mb-12 border-2">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <Input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Opisz swój pomysł na biznes... (np. 'Platforma do wymiany książek w Warszawie')"
                disabled={loading}
                className="text-base h-12"
              />
              <Button
                onClick={handleGenerate}
                disabled={loading || !prompt.trim()}
                size="lg"
                className="px-8"
              >
                {loading ? "🔮 Orkiestruję Agentów..." : "✨ Generuj Biznes"}
              </Button>
            </div>
            {error && (
              <p className="text-sm text-destructive mt-3 font-semibold">
                {error}
              </p>
            )}
            {loading && (
              <p className="text-sm text-muted-foreground mt-3">
                Agent 1 (Brand Chief) → Agent 2 (Creative Director) → Agent 3
                (Product Owner) → Agent 4 (Growth Hacker) → Agent 5
                (Architect)...
              </p>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <div className="space-y-8">
            {/* Project Header */}
            <div className="text-center py-12 border-2 rounded-lg bg-gradient-to-br from-background to-muted/20">
              <h2 className="text-5xl font-bold mb-3">
                {result.brand.selectedName}
              </h2>
              <p className="text-xl text-muted-foreground italic mb-6">
                &ldquo;{result.brand.brandStory}&rdquo;
              </p>
              <div className="flex justify-center gap-3">
                {result.design.colorPalette &&
                  Object.entries(result.design.colorPalette).map(
                    ([key, color]) => {
                      const colorValue = color.split(" ")[0]
                      return (
                        <div
                          key={key}
                          className="w-12 h-12 rounded-lg border-2 shadow-lg"
                          style={{ backgroundColor: colorValue }}
                          title={color}
                        />
                      )
                    }
                  )}
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="brand" className="w-full">
              <TabsList className="grid w-full grid-cols-5 h-12">
                <TabsTrigger value="brand" className="text-sm">
                  🎯 Brand
                </TabsTrigger>
                <TabsTrigger value="design" className="text-sm">
                  🎨 Design
                </TabsTrigger>
                <TabsTrigger value="product" className="text-sm">
                  📱 Produkt
                </TabsTrigger>
                <TabsTrigger value="marketing" className="text-sm">
                  📢 Marketing
                </TabsTrigger>
                <TabsTrigger value="tech" className="text-sm">
                  ⚙️ Tech
                </TabsTrigger>
              </TabsList>

              <TabsContent value="brand" className="mt-6">
                <BrandSection brand={result.brand} />
              </TabsContent>

              <TabsContent value="design" className="mt-6">
                <DesignSection design={result.design} />
              </TabsContent>

              <TabsContent value="product" className="mt-6">
                <ProductSection product={result.product} />
              </TabsContent>

              <TabsContent value="marketing" className="mt-6">
                <MarketingSection marketing={result.marketing} />
              </TabsContent>

              <TabsContent value="tech" className="mt-6">
                <TechSection tech={result.tech} />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </main>
  )
}
