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
  }
  product: {
    problemStatement: string
    solution: string
    keyBenefits: string[]
    uniqueValueProposition: string
    pricingStrategy: string
    revenueModel: string
    websiteStructure: Array<{ page: string; content: string }>
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
      {/* Hero Section - Ultra minimalistyczny jak GPT */}
      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-20 max-w-3xl">
        <div className="mb-10 sm:mb-14">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 tracking-tight">
            Genesis
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-3">
            Kompleksowa aplikacja generująca pomysł na Twój brand.
          </p>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Od strategii i designu po gotowe koncepcje marketingowe — nie
            potrzebujesz agencji reklamowej, żeby rozpocząć swój biznes.
          </p>
        </div>

        {/* Input - Prosty i responsywny */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Opisz swój pomysł na biznes..."
              disabled={loading}
              className="h-12 sm:h-14 text-base sm:text-lg flex-1 px-4 rounded-xl"
            />
            <Button
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              className="h-12 sm:h-14 px-8 sm:px-10 text-base sm:text-lg font-semibold rounded-xl w-full sm:w-auto"
            >
              {loading ? "Generuję..." : "Generuj"}
            </Button>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          {loading && (
            <p className="text-sm text-muted-foreground">
              Orkiestrator AI pracuje nad Twoim biznesem...
            </p>
          )}
        </div>
      </div>

      {/* Results - Klasyczny grid layout, left-aligned */}
      {result && (
        <div className="border-t bg-muted/20">
          <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 max-w-6xl">
            {/* Project Header - Wyrównanie do lewej */}
            <div className="mb-10 sm:mb-14">
              <h2 className="text-4xl sm:text-5xl font-bold mb-4">
                {result.brand.selectedName}
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl leading-relaxed">
                {result.brand.brandStory}
              </p>

              {/* Color Palette - Horizontal, left-aligned */}
              <div className="flex flex-wrap gap-2 sm:gap-3 mt-6">
                {result.design.colorPalette &&
                  Object.entries(result.design.colorPalette).map(
                    ([key, color]) => {
                      const colorValue = color.split(" ")[0]
                      return (
                        <div
                          key={key}
                          className="flex items-center gap-2 bg-background border rounded-lg px-3 py-2"
                        >
                          <div
                            className="w-8 h-8 rounded border-2 flex-shrink-0"
                            style={{ backgroundColor: colorValue }}
                          />
                          <div>
                            <p className="text-xs font-semibold capitalize">
                              {key}
                            </p>
                            <code className="text-xs text-muted-foreground">
                              {colorValue}
                            </code>
                          </div>
                        </div>
                      )
                    }
                  )}
              </div>
            </div>

            {/* Tabs - Scrollable na mobile */}
            <Tabs defaultValue="brand" className="w-full">
              <div className="overflow-x-auto pb-2 mb-6 -mx-4 px-4">
                <TabsList className="inline-flex h-12 w-auto gap-1 bg-transparent">
                  <TabsTrigger
                    value="brand"
                    className="px-4 sm:px-6 data-[state=active]:bg-background data-[state=active]:shadow"
                  >
                    <span className="mr-2">🎯</span>
                    <span className="hidden sm:inline">Brand</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="design"
                    className="px-4 sm:px-6 data-[state=active]:bg-background data-[state=active]:shadow"
                  >
                    <span className="mr-2">🎨</span>
                    <span className="hidden sm:inline">Design</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="product"
                    className="px-4 sm:px-6 data-[state=active]:bg-background data-[state=active]:shadow"
                  >
                    <span className="mr-2">📱</span>
                    <span className="hidden sm:inline">Produkt</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="marketing"
                    className="px-4 sm:px-6 data-[state=active]:bg-background data-[state=active]:shadow"
                  >
                    <span className="mr-2">📢</span>
                    <span className="hidden sm:inline">Marketing</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="tech"
                    className="px-4 sm:px-6 data-[state=active]:bg-background data-[state=active]:shadow"
                  >
                    <span className="mr-2">⚙️</span>
                    <span className="hidden sm:inline">Tech</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="brand" className="mt-0">
                <BrandSection brand={result.brand} />
              </TabsContent>

              <TabsContent value="design" className="mt-0">
                <DesignSection design={result.design} />
              </TabsContent>

              <TabsContent value="product" className="mt-0">
                <ProductSection product={result.product} />
              </TabsContent>

              <TabsContent value="marketing" className="mt-0">
                <MarketingSection marketing={result.marketing} />
              </TabsContent>

              <TabsContent value="tech" className="mt-0">
                <TechSection tech={result.tech} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
    </main>
  )
}
