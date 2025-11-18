"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface VoiceAndTone {
  voice: string
  tone: string
  examples: string[]
}

interface Archetype {
  name: string
  icon: string
  description: string
}

interface Persona {
  name: string
  age: number
  demographics: string
  painPoints: string[]
  goals: string[]
  howWeHelp: string
}

interface BrandData {
  selectedName: string
  nameOptions: string[]
  nameRationale: string
  slogan: string
  archetype: Archetype
  brandMantra: string
  mission: string
  vision: string
  brandStory: string
  voiceAndTone: VoiceAndTone
  positioningStatement: string
  coreValues: string[]
  persona: Persona
}

interface BrandSectionProps {
  brand: BrandData
}

export default function BrandSection({ brand }: BrandSectionProps) {
  return (
    <div className="space-y-8">
      {/* Hero Naming - Minimalistyczny */}
      <Card>
        <CardContent>
          <div className="space-y-4">
            <div className="inline-block px-3 py-1 bg-muted rounded-md mb-2">
              <span className="text-xs font-medium text-muted-foreground">
                Nazwa Marki
              </span>
            </div>
            <h2 className="text-4xl font-bold tracking-tight">
              {brand.selectedName}
            </h2>
            <p className="text-base text-muted-foreground">
              {brand.nameRationale}
            </p>
            <p className="text-lg text-muted-foreground italic pt-2">
              &ldquo;{brand.slogan}&rdquo;
            </p>

            {/* Alternative Names */}
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-3">
                Alternatywne nazwy:
              </p>
              <div className="flex flex-wrap gap-2">
                {brand.nameOptions.map((name, i) => (
                  <Badge
                    key={i}
                    variant="outline"
                    className="px-3 py-1.5 text-sm font-normal"
                  >
                    {name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Archetyp Marki */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <span className="text-2xl">{brand.archetype.icon}</span>
            <span>Archetyp: {brand.archetype.name}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            {brand.archetype.description}
          </p>
        </CardContent>
      </Card>

      {/* Filar Strategiczny - NOWA SEKCJA */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Filar Strategiczny
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Brand Mantra */}
          <div>
            <h4 className="font-semibold mb-2 text-sm">
              Mantra Marki (Wewnętrzna)
            </h4>
            <p className="p-4 bg-muted rounded-md text-base italic font-medium">
              &ldquo;{brand.brandMantra}&rdquo;
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Twój wewnętrzny kompas. Używaj do podejmowania decyzji
              biznesowych.
            </p>
          </div>

          {/* Positioning Statement */}
          <div>
            <h4 className="font-semibold mb-2 text-sm">
              Statement Pozycjonujący
            </h4>
            <div className="p-4 bg-muted rounded-md">
              <p className="text-muted-foreground leading-relaxed">
                {brand.positioningStatement}
              </p>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Fundament Twojego marketingu. Używaj w tekstach reklamowych i na
              stronie.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Misja & Wizja */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Misja</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed text-sm">
              {brand.mission}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Wizja</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed text-sm">
              {brand.vision}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Brand Story */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Nasza Historia (About Us)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground leading-relaxed whitespace-pre-line text-sm">
            {brand.brandStory}
          </div>
        </CardContent>
      </Card>

      {/* Voice & Tone */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Głos i Ton Komunikacji
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="font-semibold mb-2 text-sm">Głos Marki</h4>
              <p className="text-muted-foreground text-sm">
                {brand.voiceAndTone.voice}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-sm">Ton</h4>
              <p className="text-muted-foreground text-sm">
                {brand.voiceAndTone.tone}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-muted-foreground">
              Przykłady użycia:
            </h4>
            {brand.voiceAndTone.examples.map((example, i) => (
              <div key={i} className="p-3 bg-muted rounded-md">
                <p className="text-sm text-muted-foreground">{example}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Customer Persona */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Idealny Klient (Customer Persona)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Imię</p>
              <p className="font-semibold">{brand.persona.name}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Wiek</p>
              <p className="font-semibold">{brand.persona.age} lat</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Profil</p>
              <p className="text-sm">{brand.persona.demographics}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3 text-sm">Pain Points</h4>
              <ul className="space-y-2">
                {brand.persona.painPoints.map((pain, i) => (
                  <li
                    key={i}
                    className="text-sm text-muted-foreground flex items-start gap-2"
                  >
                    <span className="mt-0.5">•</span>
                    <span>{pain}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3 text-sm">Cele</h4>
              <ul className="space-y-2">
                {brand.persona.goals.map((goal, i) => (
                  <li
                    key={i}
                    className="text-sm text-muted-foreground flex items-start gap-2"
                  >
                    <span className="mt-0.5">•</span>
                    <span>{goal}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="p-4 bg-muted rounded-md border">
            <h4 className="font-semibold mb-2 text-sm">Jak Im Pomagamy</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {brand.persona.howWeHelp}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Core Values */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Wartości</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {brand.coreValues.map((value, i) => (
              <Badge
                key={i}
                variant="secondary"
                className="px-3 py-1.5 font-normal"
              >
                {value}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
