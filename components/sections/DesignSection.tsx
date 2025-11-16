"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import Image from "next/image"

interface DesignSectionProps {
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
}

export default function DesignSection({ design }: DesignSectionProps) {
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateLogo = async () => {
    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch("/api/generate-logo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          logoDescription: design.logoDescription,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Błąd generowania logo")
      }

      const data = await response.json()
      setLogoUrl(data.imageUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nieznany błąd")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-10">
      {/* Logo Concept - Wzbogacona sekcja */}
      <div>
        <div className="flex items-baseline gap-3 mb-3">
          <h3 className="text-3xl font-bold">Koncepcja Logo</h3>
          <Badge variant="secondary">Identyfikacja wizualna</Badge>
        </div>
        <p className="text-muted-foreground mb-6 text-lg">
          Wizualna tożsamość marki zaprojektowana przez Creative Director AI
        </p>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Logo Preview */}
          <div className="bg-gradient-to-br from-muted/50 to-muted/30 border-2 rounded-xl p-8 sm:p-12 flex items-center justify-center min-h-[300px] relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

            {logoUrl ? (
              <div className="relative z-10 w-full h-full flex items-center justify-center">
                <Image
                  src={logoUrl}
                  alt="Generated logo"
                  width={400}
                  height={400}
                  className="max-w-full h-auto rounded-lg shadow-xl"
                />
              </div>
            ) : (
              <div className="text-center z-10">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-4xl">🎨</span>
                </div>
                <p className="text-sm font-semibold mb-3">
                  Generowanie logo AI
                </p>
                <p className="text-xs text-muted-foreground max-w-xs mb-4">
                  Logo zostanie wygenerowane przez model Flux AI na podstawie
                  opisu
                </p>
                <Button
                  onClick={generateLogo}
                  disabled={isGenerating}
                  className="shadow-lg"
                >
                  {isGenerating ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Generuję logo...
                    </>
                  ) : (
                    <>✨ Wygeneruj logo</>
                  )}
                </Button>
                {error && (
                  <p className="text-xs text-destructive mt-3">{error}</p>
                )}
              </div>
            )}
          </div>

          {/* Logo Description */}
          <div className="space-y-4">
            <div className="bg-muted/30 border rounded-xl p-6">
              <p className="text-sm font-semibold text-muted-foreground mb-3">
                📝 Główna koncepcja
              </p>
              <p className="text-base leading-relaxed">
                {design.logoDescription}
              </p>
            </div>

            <div className="bg-muted/30 border rounded-xl p-6">
              <p className="text-sm font-semibold text-muted-foreground mb-4">
                🎯 Alternatywne kierunki
              </p>
              <div className="space-y-3">
                {design.logoVariations.map((variation, idx) => (
                  <div key={idx} className="flex gap-3 items-start">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                      {idx + 1}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                      {variation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Color Palette - Full width na mobile, Spotify style */}
      <div>
        <div className="flex items-baseline gap-3 mb-3">
          <h3 className="text-3xl font-bold">Paleta Kolorów</h3>
          <Badge variant="secondary">System kolorystyczny</Badge>
        </div>
        <p className="text-muted-foreground mb-6 text-lg">
          Strategicznie dobrana paleta z uzasadnieniem psychologii kolorów
        </p>

        <div className="grid gap-4">
          {Object.entries(design.colorPalette).map(
            ([name, colorWithDesc], idx) => {
              const parts = colorWithDesc.split(" ")
              const colorValue = parts[0]
              const description = parts
                .slice(1)
                .join(" ")
                .replace(/^\(|\)$/g, "")

              const polishNames: Record<string, string> = {
                primary: "Główny",
                secondary: "Współrzędny",
                accent: "Akcentujący",
              }

              return (
                <div
                  key={name}
                  className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 bg-gradient-to-r from-muted/40 to-muted/20 border-2 rounded-xl p-5 sm:p-6 hover:border-primary/50 transition-colors"
                >
                  {/* Color swatch */}
                  <div className="w-full sm:w-auto flex sm:block gap-4 items-center">
                    <div
                      className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl border-4 border-background shadow-xl flex-shrink-0"
                      style={{ backgroundColor: colorValue }}
                    />
                    <div className="sm:hidden flex-1">
                      <p className="font-bold text-xl mb-1">
                        {polishNames[name] || name}
                      </p>
                      <code className="text-sm text-muted-foreground font-mono bg-background px-2 py-1 rounded">
                        {colorValue}
                      </code>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="flex-1 w-full sm:w-auto">
                    <div className="hidden sm:flex items-baseline gap-3 mb-2">
                      <p className="font-bold text-2xl">
                        {polishNames[name] || name}
                      </p>
                      <code className="text-sm text-muted-foreground font-mono bg-background px-3 py-1 rounded">
                        {colorValue}
                      </code>
                    </div>
                    {description && (
                      <p className="text-base text-muted-foreground leading-relaxed mt-2">
                        {description}
                      </p>
                    )}
                    {!description && (
                      <p className="text-sm text-muted-foreground italic">
                        Kolor {polishNames[name]?.toLowerCase()} w identyfikacji
                        wizualnej
                      </p>
                    )}
                  </div>
                </div>
              )
            }
          )}
        </div>
      </div>

      {/* Typography - Wzbogacona */}
      <div>
        <div className="flex items-baseline gap-3 mb-3">
          <h3 className="text-3xl font-bold">Typografia</h3>
          <Badge variant="secondary">Fonty marki</Badge>
        </div>
        <p className="text-muted-foreground mb-6 text-lg">
          Starannie dobrany system typograficzny dla spójnej komunikacji
        </p>

        <div className="grid sm:grid-cols-2 gap-5">
          <div className="bg-gradient-to-br from-muted/40 to-muted/20 border-2 rounded-xl p-6 hover:border-primary/50 transition-colors">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="text-xl font-bold">Aa</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-muted-foreground">
                  Nagłówki
                </p>
                <p className="text-xs text-muted-foreground">Heading Font</p>
              </div>
            </div>
            <p className="text-base leading-relaxed bg-background/50 p-4 rounded-lg">
              {design.typography.heading}
            </p>
          </div>

          <div className="bg-gradient-to-br from-muted/40 to-muted/20 border-2 rounded-xl p-6 hover:border-primary/50 transition-colors">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="text-xl">ab</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-muted-foreground">
                  Treść
                </p>
                <p className="text-xs text-muted-foreground">Body Font</p>
              </div>
            </div>
            <p className="text-base leading-relaxed bg-background/50 p-4 rounded-lg">
              {design.typography.body}
            </p>
          </div>
        </div>
      </div>

      {/* Design Principles - Ulepszone */}
      <div>
        <div className="flex items-baseline gap-3 mb-3">
          <h3 className="text-3xl font-bold">Zasady Projektowe</h3>
          <Badge variant="secondary">Design System</Badge>
        </div>
        <p className="text-muted-foreground mb-6 text-lg">
          Fundamentalne zasady kierujące wszystkimi decyzjami projektowymi
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {design.designPrinciples.map((principle, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-br from-muted/40 to-muted/20 border-2 rounded-xl p-6 hover:border-primary/50 transition-all hover:shadow-lg"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg shadow">
                  {idx + 1}
                </div>
                <p className="text-base font-semibold flex-1 leading-snug pt-1">
                  Zasada {idx + 1}
                </p>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {principle}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
