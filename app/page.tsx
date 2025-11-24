"use client"

import { useState, useRef, useEffect } from "react"
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
    nameRationale: string
    slogan: string
    archetype: {
      name: string
      icon: string
      description: string
    }
    brandMantra: string
    mission: string
    vision: string
    brandStory: string
    voiceAndTone: {
      voice: string
      tone: string
      examples: string[]
    }
    positioningStatement: string
    coreValues: string[]
    persona: {
      name: string
      age: number
      demographics: string
      painPoints: string[]
      goals: string[]
      howWeHelp: string
    }
  }
  design: {
    logoConceptA: string
    logoConceptB: string
    logoConceptC: string
    colorScheme: string
    colorPalette: {
      primary: string
      secondary: string
      accent?: string
    }
    typography: {
      heading: string
      body: string
      scale: {
        h1: string
        h2: string
        h3: string
        h4: string
        h5: string
        h6: string
        body: string
        small: string
      }
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
  const resultsRef = useRef<HTMLDivElement>(null)

  // Płynne scrollowanie do wyników po wygenerowaniu
  useEffect(() => {
    if (result && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }, 100)
    }
  }, [result])

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
      {/* Hero Section */}
      <div className="container mx-auto p-4 sm:p-6 max-w-3xl min-h-[80vh] flex items-center">
        <div className="w-full">
          <div className="mb-6 sm:mb-12 space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-medium">AI Business Generator</span>
            </div>

            {/* Main heading with gradient */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Genesis
              </span>
              <br />
              <span className="text-muted-foreground">Business Maker</span>
            </h1>

            {/* Description with better typography */}
            <div className="space-y-3 max-w-2xl">
              <p className="text-xl sm:text-2xl font-semibold leading-relaxed">
                Zamień pomysł w gotowy biznes — w 60 sekund
              </p>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                Od strategii i designu po gotowe koncepcje marketingowe.
                <br className="hidden sm:block" />
                Nie potrzebujesz agencji reklamowej, żeby rozpocząć swój biznes.
              </p>
            </div>
          </div>

          {/* Input - Enhanced design */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Input
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Opisz swój pomysł na biznes..."
                  disabled={loading}
                  className="h-14 sm:h-16 py-4 text-base sm:text-lg px-5 rounded-2xl border-2 focus-visible:ring-2 focus-visible:ring-offset-1 bg-background/50 backdrop-blur-sm"
                />
              </div>
              <Button
                onClick={handleGenerate}
                disabled={loading || !prompt.trim()}
                size="lg"
                className="h-14 sm:h-16 px-8 sm:px-12 text-base sm:text-lg font-semibold rounded-2xl w-full sm:w-auto shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Tworzę...
                  </span>
                ) : (
                  "Stwórz Biznes"
                )}
              </Button>
            </div>

            {/* Error & Loading states */}
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <span className="text-sm text-destructive font-medium">
                  {error}
                </span>
              </div>
            )}
            {loading && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/10">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <p className="text-sm text-muted-foreground">
                  Orkiestrator AI analizuje Twój pomysł...
                </p>
              </div>
            )}
          </div>

          {/* Feature pills - Enhanced */}
          <div className="flex flex-wrap gap-2 pt-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border text-sm">
              <span>🎯</span>
              <span className="font-medium">Strategia Marki</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border text-sm">
              <span>🎨</span>
              <span className="font-medium">AI Logo</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border text-sm">
              <span>📈</span>
              <span className="font-medium">Plan Marketingowy</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border text-sm">
              <span>🌐</span>
              <span className="font-medium">Struktura Strony</span>
            </div>
          </div>
        </div>
      </div>

      {/* Results - Klasyczny grid layout, left-aligned */}
      {result && (
        <div ref={resultsRef} className="border-t bg-muted/10 scroll-mt-4">
          <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 max-w-3xl">
            {/* Project Header - Wyrównanie do lewej */}
            <div className="mb-10 sm:mb-14">
              <h2 className="text-4xl sm:text-5xl font-bold mb-4">
                {result.brand.selectedName}
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl leading-relaxed">
                {result.brand.brandStory}
              </p>

              {/* Paleta Kolorów - Full width na mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
                {result.design.colorPalette &&
                  Object.entries(result.design.colorPalette).map(
                    ([key, color]) => {
                      const colorValue = color.split(" ")[0]
                      return (
                        <div
                          key={key}
                          className="flex items-center gap-3 bg-background border rounded-lg px-4 py-3"
                        >
                          <div
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg border-2 flex-shrink-0 shadow"
                            style={{ backgroundColor: colorValue }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold capitalize">
                              {key === "primary"
                                ? "Główny"
                                : key === "secondary"
                                ? "Współrzędny"
                                : "Akcentujący"}
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

            {/* Tabs - Vertical na mobile, horizontal na desktop */}
            <Tabs defaultValue="brand" className="w-full">
              <div className="mb-6">
                <TabsList className="flex sm:inline-flex flex-col sm:flex-row h-auto sm:h-12 w-full sm:w-auto gap-2 sm:gap-1 bg-transparent p-0 sm:p-1">
                  <TabsTrigger
                    value="brand"
                    className="justify-start sm:justify-center px-4 py-3 sm:py-2 data-[state=active]:bg-background data-[state=active]:shadow-md w-full sm:w-auto"
                  >
                    <span className="mr-3 text-lg">🎯</span>
                    <div className="text-left sm:text-center flex-1 sm:flex-none">
                      <p className="font-semibold">Marka</p>
                      <p className="text-xs text-muted-foreground sm:hidden">
                        Strategia i tożsamość
                      </p>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger
                    value="design"
                    className="justify-start sm:justify-center px-4 py-3 sm:py-2 data-[state=active]:bg-background data-[state=active]:shadow-md w-full sm:w-auto"
                  >
                    <span className="mr-3 text-lg">🎨</span>
                    <div className="text-left sm:text-center flex-1 sm:flex-none">
                      <p className="font-semibold">Design</p>
                      <p className="text-xs text-muted-foreground sm:hidden">
                        Logo i paleta
                      </p>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger
                    value="product"
                    className="justify-start sm:justify-center px-4 py-3 sm:py-2 data-[state=active]:bg-background data-[state=active]:shadow-md w-full sm:w-auto"
                  >
                    <span className="mr-3 text-lg">📱</span>
                    <div className="text-left sm:text-center flex-1 sm:flex-none">
                      <p className="font-semibold">Produkt</p>
                      <p className="text-xs text-muted-foreground sm:hidden">
                        Wartość i struktura
                      </p>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger
                    value="marketing"
                    className="justify-start sm:justify-center px-4 py-3 sm:py-2 data-[state=active]:bg-background data-[state=active]:shadow-md w-full sm:w-auto"
                  >
                    <span className="mr-3 text-lg">📢</span>
                    <div className="text-left sm:text-center flex-1 sm:flex-none">
                      <p className="font-semibold">Marketing</p>
                      <p className="text-xs text-muted-foreground sm:hidden">
                        Kampania i reklamy
                      </p>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger
                    value="tech"
                    className="justify-start sm:justify-center px-4 py-3 sm:py-2 data-[state=active]:bg-background data-[state=active]:shadow-md w-full sm:w-auto"
                  >
                    <span className="mr-3 text-lg">⚙️</span>
                    <div className="text-left sm:text-center flex-1 sm:flex-none">
                      <p className="font-semibold">Technologia</p>
                      <p className="text-xs text-muted-foreground sm:hidden">
                        Stack i budżet
                      </p>
                    </div>
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
