"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface BrandSectionProps {
  brand: {
    selectedName: string
    nameOptions: string[]
    brandStory: string
    voiceAndTone: string
    competitorPositioning: string
    coreValues: string[]
  }
}

export default function BrandSection({ brand }: BrandSectionProps) {
  return (
    <div className="space-y-8">
      {/* Brand Story - Główna narracja */}
      <div>
        <h3 className="text-2xl font-bold mb-3">Brand Story</h3>
        <p className="text-lg text-muted-foreground leading-relaxed">
          {brand.brandStory}
        </p>
      </div>

      {/* Brand Naming - Brandbook style */}
      <div>
        <h3 className="text-2xl font-bold mb-2">Naming Strategy</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Proces kreacji nazwy marki uwzględniający pozycjonowanie, łatwość
          zapamiętania i potencjał komunikacyjny
        </p>
        <div className="bg-muted/30 border rounded-lg p-6">
          <p className="text-sm font-semibold text-muted-foreground mb-3">
            Wybrana nazwa:
          </p>
          <p className="text-3xl font-bold mb-6">{brand.selectedName}</p>
          <p className="text-sm font-semibold text-muted-foreground mb-3">
            Alternatywne propozycje:
          </p>
          <div className="flex flex-wrap gap-2">
            {brand.nameOptions
              .filter((name) => name !== brand.selectedName)
              .map((name, idx) => (
                <Badge
                  key={idx}
                  variant="outline"
                  className="text-base px-4 py-2"
                >
                  {name}
                </Badge>
              ))}
          </div>
        </div>
      </div>

      {/* Voice & Tone + Positioning - Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-bold mb-2">Voice & Tone</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Sposób komunikacji marki z odbiorcami
          </p>
          <p className="text-base text-muted-foreground leading-relaxed">
            {brand.voiceAndTone}
          </p>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-2">Market Positioning</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Wyróżniki konkurencyjne i pozycjonowanie
          </p>
          <p className="text-base text-muted-foreground leading-relaxed">
            {brand.competitorPositioning}
          </p>
        </div>
      </div>

      {/* Core Values */}
      <div>
        <h3 className="text-xl font-bold mb-2">Core Values</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Fundamentalne wartości stanowiące fundament kultury marki
        </p>
        <div className="flex flex-wrap gap-3">
          {brand.coreValues.map((value, idx) => (
            <div
              key={idx}
              className="bg-primary/10 border border-primary/20 rounded-lg px-5 py-3"
            >
              <p className="font-semibold text-lg">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
