"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import Image from "next/image"

interface DesignSectionProps {
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
}

// Helper funkcja do parsowania kolorów
function parseColor(colorString: string) {
  const parts = colorString.split("|")
  return {
    hex: parts[0] || "#000000",
    name: parts[1] || "",
    description: parts[2] || "",
  }
}

// Helper funkcja do parsowania fontów
function parseFont(fontString: string) {
  const parts = fontString.split("|")
  return {
    name: parts[0] || "Inter",
    url: parts[1] || "",
    description: parts[2] || "",
  }
}

// Helper do parsowania typescale
function parseTypeScale(scaleString: string) {
  const parts = scaleString.split("|")
  return {
    size: parts[0] || "16px/1rem",
    weight: parts[1] || "font-weight: 400",
    lineHeight: parts[2] || "line-height: 1.5",
  }
}

export default function DesignSection({ design }: DesignSectionProps) {
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null)

  const primaryColor = parseColor(design.colorPalette.primary)
  const secondaryColor = parseColor(design.colorPalette.secondary)
  const accentColor = design.colorPalette.accent
    ? parseColor(design.colorPalette.accent)
    : null

  const headingFont = parseFont(design.typography.heading)
  const bodyFont = parseFont(design.typography.body)

  // Dynamiczne ładowanie Google Fonts
  useEffect(() => {
    const loadGoogleFont = (fontName: string) => {
      const fontId = `google-font-${fontName.replace(/\s+/g, "-")}`
      if (document.getElementById(fontId)) return

      const fontUrlName = fontName.replace(/\s+/g, "+")
      const link = document.createElement("link")
      link.id = fontId
      link.rel = "stylesheet"
      link.href = `https://fonts.googleapis.com/css2?family=${fontUrlName}:wght@400;600;700&display=swap`
      document.head.appendChild(link)
    }

    loadGoogleFont(headingFont.name)
    loadGoogleFont(bodyFont.name)
  }, [headingFont.name, bodyFont.name])

  const generateLogo = async (conceptPrompt: string) => {
    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch("/api/generate-logo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          logoDescription: conceptPrompt,
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

  const copyPrompt = (prompt: string, id: string) => {
    navigator.clipboard.writeText(prompt)
    setCopiedPrompt(id)
    setTimeout(() => setCopiedPrompt(null), 2000)
  }

  return (
    <div className="space-y-8">
      {/* Wygenerowane Logo */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">
              🎨 Logo / Sygnet
            </CardTitle>
            {logoUrl && <Badge variant="secondary">AI Generated</Badge>}
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-muted rounded-md p-8 flex items-center justify-center min-h-[300px]">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt="Generated logo"
                width={512}
                height={512}
                className="max-w-full h-auto rounded-md"
              />
            ) : (
              <div className="text-center max-w-md">
                <div className="text-5xl mb-4">🎨</div>
                <p className="text-sm font-semibold mb-2">
                  Kliknij "Generuj" przy jednej z koncepcji poniżej
                </p>
                <p className="text-xs text-muted-foreground">
                  Używamy FLUX.1-dev (Hugging Face) - lepsza jakość
                </p>
                {error && (
                  <p className="text-xs text-destructive mt-3">{error}</p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Koncepcje Logo */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            💡 Koncepcje Logo (3 Propozycje)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Koncepcja A */}
          <div className="border rounded-md p-4">
            <div className="mb-3">
              <h4 className="font-semibold mb-2">Koncepcja A (Główna)</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {design.logoConceptA}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyPrompt(design.logoConceptA, "conceptA")}
              >
                {copiedPrompt === "conceptA"
                  ? "✓ Skopiowano"
                  : "📋 Kopiuj Prompt"}
              </Button>
              <Button
                size="sm"
                onClick={() => generateLogo(design.logoConceptA)}
                disabled={isGenerating}
              >
                {isGenerating ? "⏳ Generuję..." : "✨ Generuj"}
              </Button>
            </div>
          </div>

          {/* Koncepcja B */}
          <div className="border rounded-md p-4">
            <div className="mb-3">
              <h4 className="font-semibold mb-2">Koncepcja B (Alternatywna)</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {design.logoConceptB}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyPrompt(design.logoConceptB, "conceptB")}
              >
                {copiedPrompt === "conceptB"
                  ? "✓ Skopiowano"
                  : "📋 Kopiuj Prompt"}
              </Button>
              <Button
                size="sm"
                onClick={() => generateLogo(design.logoConceptB)}
                disabled={isGenerating}
              >
                {isGenerating ? "⏳ Generuję..." : "✨ Generuj"}
              </Button>
            </div>
          </div>

          {/* Koncepcja C */}
          <div className="border rounded-md p-4">
            <div className="mb-3">
              <h4 className="font-semibold mb-2">Koncepcja C (Kreatywna)</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {design.logoConceptC}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyPrompt(design.logoConceptC, "conceptC")}
              >
                {copiedPrompt === "conceptC"
                  ? "✓ Skopiowano"
                  : "📋 Kopiuj Prompt"}
              </Button>
              <Button
                size="sm"
                onClick={() => generateLogo(design.logoConceptC)}
                disabled={isGenerating}
              >
                {isGenerating ? "⏳ Generuję..." : "✨ Generuj"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Paleta Kolorystyczna */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">
              🌈 Paleta Kolorystyczna
            </CardTitle>
            <Badge>{design.colorScheme}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground mb-4">
            Schemat: <strong>{design.colorScheme}</strong> - bazuje na teorii
            koła kolorów
          </p>

          {/* Primary Color */}
          <div className="border rounded-md p-4">
            <div className="flex items-center gap-4 mb-3">
              <div
                className="w-20 h-20 rounded-md border-4 border-background shadow-lg flex-shrink-0"
                style={{ backgroundColor: primaryColor.hex }}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold">Kolor Główny</h4>
                  <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                    {primaryColor.hex}
                  </code>
                </div>
                <p className="text-xs text-muted-foreground">
                  {primaryColor.name}
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {primaryColor.description}
            </p>
          </div>

          {/* Secondary Color */}
          <div className="border rounded-md p-4">
            <div className="flex items-center gap-4 mb-3">
              <div
                className="w-20 h-20 rounded-md border-4 border-background shadow-lg flex-shrink-0"
                style={{ backgroundColor: secondaryColor.hex }}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold">Kolor Wspierający</h4>
                  <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                    {secondaryColor.hex}
                  </code>
                </div>
                <p className="text-xs text-muted-foreground">
                  {secondaryColor.name}
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {secondaryColor.description}
            </p>
          </div>

          {/* Accent Color (Optional) */}
          {accentColor && (
            <div className="border rounded-md p-4">
              <div className="flex items-center gap-4 mb-3">
                <div
                  className="w-20 h-20 rounded-md border-4 border-background shadow-lg flex-shrink-0"
                  style={{ backgroundColor: accentColor.hex }}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">Kolor Akcentujący</h4>
                    <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                      {accentColor.hex}
                    </code>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {accentColor.name}
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {accentColor.description}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* System Typograficzny */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            🅰️ System Typograficzny
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Typography Scale */}
          <div className="border rounded-md p-4">
            <h4 className="font-semibold mb-4">Skala Typograficzna</h4>
            <div className="space-y-4 bg-muted/30 p-4 rounded-md">
              {Object.entries(design.typography.scale).map(([key, value]) => {
                const scale = parseTypeScale(value)
                const fontFamily =
                  key === "body" || key === "small"
                    ? bodyFont.name
                    : headingFont.name
                const fontWeight =
                  key === "body" || key === "small" ? "400" : "700"

                return (
                  <div
                    key={key}
                    className="border-b border-muted pb-3 last:border-0"
                  >
                    <div className="flex items-baseline justify-between mb-2">
                      <code className="text-xs font-mono font-semibold">
                        {key.toUpperCase()}
                      </code>
                      <div className="flex gap-3 text-xs text-muted-foreground">
                        <span>{scale.size.split("|")[0]}</span>
                        <span>{scale.weight.split(":")[1]?.trim()}</span>
                        <span>{scale.lineHeight.split(":")[1]?.trim()}</span>
                      </div>
                    </div>
                    <p
                      style={{
                        fontFamily: fontFamily,
                        fontSize:
                          key === "h1"
                            ? "3rem"
                            : key === "h2"
                            ? "2.25rem"
                            : key === "h3"
                            ? "1.875rem"
                            : key === "h4"
                            ? "1.5rem"
                            : key === "h5"
                            ? "1.25rem"
                            : key === "h6"
                            ? "1rem"
                            : key === "small"
                            ? "0.875rem"
                            : "1rem",
                        fontWeight: fontWeight,
                      }}
                    >
                      The quick brown fox jumps over the lazy dog
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Font Details */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="border rounded-md p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">Nagłówki</h4>
                {headingFont.url && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(headingFont.url, "_blank")}
                  >
                    🔗 Google Fonts
                  </Button>
                )}
              </div>
              <p
                className="text-lg font-bold mb-2"
                style={{ fontFamily: headingFont.name }}
              >
                {headingFont.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {headingFont.description}
              </p>
            </div>

            <div className="border rounded-md p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">Treść</h4>
                {bodyFont.url && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(bodyFont.url, "_blank")}
                  >
                    🔗 Google Fonts
                  </Button>
                )}
              </div>
              <p className="text-lg mb-2" style={{ fontFamily: bodyFont.name }}>
                {bodyFont.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {bodyFont.description}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Przykładowe Komponenty UI */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            🧩 Komponenty UI (Shadcn/ui)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-sm text-muted-foreground">
            Przykładowe komponenty z zastosowaniem palety kolorów i typografii
          </p>

          {/* Buttons */}
          <div className="border rounded-md p-4">
            <h4
              className="font-semibold mb-4"
              style={{ fontFamily: headingFont.name }}
            >
              Przyciski
            </h4>
            <div className="flex flex-wrap gap-3">
              <Button
                style={{
                  backgroundColor: primaryColor.hex,
                  fontFamily: bodyFont.name,
                }}
              >
                Primary Button
              </Button>
              <Button
                variant="outline"
                style={{
                  borderColor: primaryColor.hex,
                  color: primaryColor.hex,
                  fontFamily: bodyFont.name,
                }}
              >
                Outline Button
              </Button>
              <Button
                variant="secondary"
                style={{
                  backgroundColor: secondaryColor.hex,
                  fontFamily: bodyFont.name,
                }}
              >
                Secondary Button
              </Button>
              {accentColor && (
                <Button
                  style={{
                    backgroundColor: accentColor.hex,
                    fontFamily: bodyFont.name,
                  }}
                >
                  Accent CTA
                </Button>
              )}
            </div>
          </div>

          {/* Cards */}
          <div className="border rounded-md p-4">
            <h4
              className="font-semibold mb-4"
              style={{ fontFamily: headingFont.name }}
            >
              Karty
            </h4>
            <div className="grid sm:grid-cols-2 gap-4">
              <Card
                style={{
                  borderColor: primaryColor.hex,
                  borderWidth: "2px",
                }}
              >
                <CardHeader>
                  <CardTitle
                    style={{
                      fontFamily: headingFont.name,
                      color: primaryColor.hex,
                    }}
                  >
                    Feature Card
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p
                    className="text-sm text-muted-foreground"
                    style={{ fontFamily: bodyFont.name }}
                  >
                    Przykładowa karta z zastosowaniem koloru primary w bordera i
                    tytule.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader
                  style={{ backgroundColor: `${primaryColor.hex}15` }}
                >
                  <CardTitle
                    style={{
                      fontFamily: headingFont.name,
                    }}
                  >
                    Tinted Card
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p
                    className="text-sm text-muted-foreground"
                    style={{ fontFamily: bodyFont.name }}
                  >
                    Karta z subtelnym tłem w kolorze marki (15% opacity).
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Badges */}
          <div className="border rounded-md p-4">
            <h4
              className="font-semibold mb-4"
              style={{ fontFamily: headingFont.name }}
            >
              Etykiety (Badges)
            </h4>
            <div className="flex flex-wrap gap-3">
              <Badge
                style={{
                  backgroundColor: primaryColor.hex,
                  fontFamily: bodyFont.name,
                }}
              >
                Primary
              </Badge>
              <Badge
                variant="secondary"
                style={{
                  backgroundColor: secondaryColor.hex,
                  fontFamily: bodyFont.name,
                }}
              >
                Secondary
              </Badge>
              <Badge
                variant="outline"
                style={{
                  borderColor: primaryColor.hex,
                  color: primaryColor.hex,
                  fontFamily: bodyFont.name,
                }}
              >
                Outline
              </Badge>
              {accentColor && (
                <Badge
                  style={{
                    backgroundColor: accentColor.hex,
                    fontFamily: bodyFont.name,
                  }}
                >
                  Accent
                </Badge>
              )}
            </div>
          </div>

          {/* Inputs */}
          <div className="border rounded-md p-4">
            <h4
              className="font-semibold mb-4"
              style={{ fontFamily: headingFont.name }}
            >
              Pola formularza
            </h4>
            <div className="space-y-3 max-w-md">
              <Input
                placeholder="Email address"
                style={{
                  fontFamily: bodyFont.name,
                }}
                className="focus-visible:ring-offset-0"
                onFocus={(e) => {
                  e.target.style.borderColor = primaryColor.hex
                  e.target.style.boxShadow = `0 0 0 1px ${primaryColor.hex}`
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = ""
                  e.target.style.boxShadow = ""
                }}
              />
              <div className="flex gap-2">
                <Input
                  placeholder="Wpisz tekst..."
                  style={{ fontFamily: bodyFont.name }}
                />
                <Button
                  style={{
                    backgroundColor: primaryColor.hex,
                    fontFamily: bodyFont.name,
                  }}
                >
                  Wyślij
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Zasady Projektowe */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Heurystyki Design Systemu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {design.designPrinciples.map((principle, idx) => (
              <div
                key={idx}
                className="border-l-4 pl-4"
                style={{ borderColor: primaryColor.hex }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                    style={{
                      backgroundColor: `${primaryColor.hex}20`,
                      color: primaryColor.hex,
                    }}
                  >
                    {idx + 1}
                  </div>
                  <p className="text-sm leading-relaxed pt-1">{principle}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
