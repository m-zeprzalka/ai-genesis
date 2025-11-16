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
    keyScreens: Array<{ screen: string; description: string }>
    personas: Array<{
      name: string
      age: string
      occupation: string
      emotionalDrivers: string[]
      motivations: string[]
    }>
  }
}

export default function DesignSection({ design }: DesignSectionProps) {
  return (
    <div className="space-y-6">
      {/* Logo Description */}
      <Card>
        <CardHeader>
          <CardTitle>Logo Concept</CardTitle>
          <p className="text-sm text-muted-foreground">
            Wizualna koncepcja zaprojektowana przez Creative Director AI
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg leading-relaxed">{design.logoDescription}</p>
          <div>
            <h4 className="font-semibold mb-3">Alternatywne kierunki:</h4>
            <div className="space-y-2">
              {design.logoVariations.map((variation, idx) => (
                <div key={idx} className="flex gap-2">
                  <Badge variant="outline">{idx + 1}</Badge>
                  <p className="text-muted-foreground">{variation}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Color Palette */}
      <Card>
        <CardHeader>
          <CardTitle>Paleta Kolorów</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(design.colorPalette).map(
              ([name, colorWithDesc]) => {
                const colorValue = colorWithDesc.split(" ")[0]
                return (
                  <div key={name} className="text-center">
                    <div
                      className="w-full aspect-square rounded-lg border-2 shadow-lg mb-2"
                      style={{ backgroundColor: colorValue }}
                    />
                    <p className="text-sm font-semibold capitalize">{name}</p>
                    <code className="text-xs text-muted-foreground block">
                      {colorValue}
                    </code>
                    <p className="text-xs text-muted-foreground mt-1">
                      {colorWithDesc.substring(colorValue.length + 1)}
                    </p>
                  </div>
                )
              }
            )}
          </div>
        </CardContent>
      </Card>

      {/* Typography */}
      <Card>
        <CardHeader>
          <CardTitle>Typography</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold mb-2">Heading Font</h4>
            <p className="text-muted-foreground">{design.typography.heading}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Body Font</h4>
            <p className="text-muted-foreground">{design.typography.body}</p>
          </div>
        </CardContent>
      </Card>

      {/* Design Principles */}
      <Card>
        <CardHeader>
          <CardTitle>Design Principles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {design.designPrinciples.map((principle, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <Badge className="mt-1">{idx + 1}</Badge>
                <p className="text-muted-foreground flex-1">{principle}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Screens */}
      <Card>
        <CardHeader>
          <CardTitle>Key Screens</CardTitle>
          <p className="text-sm text-muted-foreground">
            Główne ekrany aplikacji z opisem layoutu
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {design.keyScreens.map((screen, idx) => (
              <div key={idx} className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">{screen.screen}</h4>
                <p className="text-sm text-muted-foreground">
                  {screen.description}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Personas */}
      <div>
        <h3 className="text-2xl font-bold mb-4">User Personas</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {design.personas.map((persona, idx) => (
            <Card key={idx}>
              <CardHeader>
                <Badge className="w-fit mb-2">Persona {idx + 1}</Badge>
                <CardTitle>{persona.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {persona.age} • {persona.occupation}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 text-sm">
                    Emotional Drivers
                  </h4>
                  <ul className="space-y-1">
                    {persona.emotionalDrivers.map((driver, i) => (
                      <li
                        key={i}
                        className="text-sm text-muted-foreground flex items-start gap-2"
                      >
                        <span className="text-purple-600 mt-1">♡</span>
                        <span>{driver}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 text-sm">Motivations</h4>
                  <ul className="space-y-1">
                    {persona.motivations.map((motivation, i) => (
                      <li
                        key={i}
                        className="text-sm text-muted-foreground flex items-start gap-2"
                      >
                        <span className="text-green-600 mt-1">★</span>
                        <span>{motivation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
