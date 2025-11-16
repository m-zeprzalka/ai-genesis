"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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
  return (
    <div className="space-y-8">
      {/* Logo Concept */}
      <div>
        <h3 className="text-2xl font-bold mb-2">Logo Concept</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Wizualna koncepcja tożsamości marki
        </p>
        <div className="bg-muted/30 border rounded-lg p-6 sm:p-8">
          {/* TODO: Tutaj będzie generowany obraz logo przez AI */}
          <div className="bg-background border-2 border-dashed rounded-lg p-12 mb-6 flex items-center justify-center min-h-[200px]">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Logo generation coming soon
              </p>
              <p className="text-xs text-muted-foreground">
                AI-generated logo based on description below
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="font-semibold mb-2">Główna koncepcja:</p>
              <p className="text-muted-foreground leading-relaxed">
                {design.logoDescription}
              </p>
            </div>

            <div>
              <p className="font-semibold mb-3">Alternatywne kierunki:</p>
              <div className="space-y-2">
                {design.logoVariations.map((variation, idx) => (
                  <div key={idx} className="flex gap-3">
                    <span className="text-primary font-semibold flex-shrink-0">
                      {idx + 1}.
                    </span>
                    <p className="text-muted-foreground">{variation}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Color Palette - Spotify style, left-aligned */}
      <div>
        <h3 className="text-2xl font-bold mb-2">Color Palette</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Paleta kolorów marki z uzasadnieniem wyboru
        </p>
        <div className="space-y-3">
          {Object.entries(design.colorPalette).map(([name, colorWithDesc]) => {
            const parts = colorWithDesc.split(" ")
            const colorValue = parts[0]
            const description = parts
              .slice(1)
              .join(" ")
              .replace(/^\(|\)$/g, "")

            return (
              <div
                key={name}
                className="flex items-start gap-4 bg-muted/30 border rounded-lg p-4 sm:p-5"
              >
                <div
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg border-2 shadow-lg flex-shrink-0"
                  style={{ backgroundColor: colorValue }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-3 mb-1">
                    <p className="font-bold text-lg capitalize">{name}</p>
                    <code className="text-sm text-muted-foreground font-mono">
                      {colorValue}
                    </code>
                  </div>
                  {description && (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {description}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Typography */}
      <div>
        <h3 className="text-2xl font-bold mb-2">Typography</h3>
        <p className="text-sm text-muted-foreground mb-4">
          System typograficzny marki
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-muted/30 border rounded-lg p-5">
            <p className="text-sm font-semibold text-muted-foreground mb-2">
              Heading Font
            </p>
            <p className="text-base leading-relaxed">
              {design.typography.heading}
            </p>
          </div>
          <div className="bg-muted/30 border rounded-lg p-5">
            <p className="text-sm font-semibold text-muted-foreground mb-2">
              Body Font
            </p>
            <p className="text-base leading-relaxed">
              {design.typography.body}
            </p>
          </div>
        </div>
      </div>

      {/* Design Principles */}
      <div>
        <h3 className="text-2xl font-bold mb-2">Design Principles</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Fundamentalne zasady systemu projektowego
        </p>
        <div className="space-y-3">
          {design.designPrinciples.map((principle, idx) => (
            <div
              key={idx}
              className="flex gap-4 bg-muted/30 border rounded-lg p-4"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                {idx + 1}
              </div>
              <p className="text-base flex-1 leading-relaxed">{principle}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
