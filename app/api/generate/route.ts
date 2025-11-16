import { NextRequest, NextResponse } from "next/server"

export const runtime = "edge"

interface VentureResponse {
  // Brand Identity
  brand: {
    projectName: string
    tagline: string
    mission: string
    logoIdea: string
    colorPalette: string[]
  }

  // Target Audience
  audience: {
    primaryPersona: {
      name: string
      age: string
      occupation: string
      painPoints: string[]
      goals: string[]
    }
    secondaryPersona: {
      name: string
      age: string
      occupation: string
      painPoints: string[]
      goals: string[]
    }
  }

  // Features
  features: {
    mvp: Array<{ name: string; desc: string }>
    phase2: Array<{ name: string; desc: string }>
  }

  // Marketing & Copy
  marketing: {
    landingPageHeadline: string
    subheadline: string
    cta: string
    howItWorks: Array<{ step: string; desc: string }>
    socialPosts: Array<{ platform: string; content: string }>
    elevatorPitch: string
  }

  // Tech Architecture
  tech: {
    stack: {
      frontend: string
      backend: string
      database: string
      authentication: string
      hosting: string
    }
    diagram: string
  }

  // UX Flow
  ux: {
    onboarding: string[]
    coreLoop: string[]
    retention: string[]
  }

  // Business Model
  business: {
    model: string
    pricing: string
    revenue: string[]
    competitors: string[]
  }
}

const SYSTEM_PROMPT = `Jesteś ekspertem od tworzenia startupów i produktów cyfrowych (Venture Studio AI).
Twoim zadaniem jest transformacja pomysłu użytkownika w kompletny, gotowy do realizacji koncept biznesowy.
Zawsze odpowiadasz **WYŁĄCZNIE** w formacie JSON, bez żadnego dodatkowego tekstu.

SCHEMAT JSON (wszystkie pola wymagane):
{
  "brand": {
    "projectName": "Kreatywna, zapadająca w pamięć nazwa (1-2 słowa)",
    "tagline": "Chwytliwy slogan (max 10 słów)",
    "mission": "Misja produktu - dlaczego istnieje (1-2 zdania)",
    "logoIdea": "Opis koncepcji logo (np. 'Minimalistyczna ikona mózgu z symbolem rakiety')",
    "colorPalette": ["#hex1", "#hex2", "#hex3"] // 3 kolory
  },
  "audience": {
    "primaryPersona": {
      "name": "Imię persony (np. 'Anna Kowalska')",
      "age": "Wiek (np. '28-35')",
      "occupation": "Zawód (np. 'Marketing Manager w startupi')",
      "painPoints": ["Problem 1", "Problem 2", "Problem 3"],
      "goals": ["Cel 1", "Cel 2"]
    },
    "secondaryPersona": {
      "name": "Imię drugiej persony",
      "age": "Wiek",
      "occupation": "Zawód",
      "painPoints": ["Problem 1", "Problem 2"],
      "goals": ["Cel 1", "Cel 2"]
    }
  },
  "features": {
    "mvp": [
      { "name": "Funkcja MVP 1", "desc": "Opis (1 zdanie)" },
      { "name": "Funkcja MVP 2", "desc": "Opis" },
      { "name": "Funkcja MVP 3", "desc": "Opis" }
    ],
    "phase2": [
      { "name": "Funkcja Phase 2 #1", "desc": "Opis" },
      { "name": "Funkcja Phase 2 #2", "desc": "Opis" }
    ]
  },
  "marketing": {
    "landingPageHeadline": "Główny headline landing page (max 12 słów)",
    "subheadline": "Subheadline wyjaśniający value proposition (max 20 słów)",
    "cta": "Call-to-action button text (np. 'Zacznij za darmo')",
    "howItWorks": [
      { "step": "Krok 1", "desc": "Opis kroku (1 zdanie)" },
      { "step": "Krok 2", "desc": "Opis" },
      { "step": "Krok 3", "desc": "Opis" }
    ],
    "socialPosts": [
      { "platform": "Twitter/X", "content": "Tweet 280 znaków promujący produkt" },
      { "platform": "LinkedIn", "content": "Post LinkedIn (2-3 zdania)" },
      { "platform": "Instagram", "content": "Caption Instagram (krótki, z emoji)" }
    ],
    "elevatorPitch": "Pitch 30-sekundowy (2-3 zdania)"
  },
  "tech": {
    "stack": {
      "frontend": "Technologia frontend",
      "backend": "Technologia backend",
      "database": "Baza danych",
      "authentication": "System auth",
      "hosting": "Hosting/infrastructure"
    },
    "diagram": "Kod Mermaid.js (graph TD). TYLKO składnia -->. Min 5 węzłów."
  },
  "ux": {
    "onboarding": ["Krok onboardingu 1", "Krok 2", "Krok 3"],
    "coreLoop": ["Akcja użytkownika 1", "Akcja 2", "Akcja 3"],
    "retention": ["Mechanika retencyjna 1", "2", "3"]
  },
  "business": {
    "model": "Model biznesowy (np. 'Freemium', 'Subscription', 'Marketplace')",
    "pricing": "Strategia cenowa (np. 'Free tier + $19/mo Pro')",
    "revenue": ["Źródło przychodu 1", "Źródło 2"],
    "competitors": ["Konkurent 1", "Konkurent 2", "Konkurent 3"]
  }
}

PRZYKŁAD diagramu Mermaid:
graph TD
    A[User] -->|sign up| B[Auth]
    B -->|create profile| C[Dashboard]
    C -->|use feature| D[Core Engine]
    D -->|store data| E[Database]

Przeanalizuj pomysł i zwróć **TYLKO** JSON.`

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json()

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Prompt jest wymagany" },
        { status: 400 }
      )
    }

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: "GROQ_API_KEY nie jest skonfigurowany" },
        { status: 500 }
      )
    }

    // Wywołanie Groq API (kompatybilne z OpenAI API)
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: SYSTEM_PROMPT,
            },
            {
              role: "user",
              content: `Pomysł: "${prompt}"`,
            },
          ],
          temperature: 0.8,
          max_tokens: 4096,
          response_format: { type: "json_object" },
        }),
      }
    )

    if (!response.ok) {
      const errorData = await response.text()
      console.error("Groq API Error:", errorData)
      return NextResponse.json(
        { error: `Groq API zwrócił błąd: ${response.status}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content

    if (!content) {
      return NextResponse.json(
        { error: "Brak odpowiedzi z AI" },
        { status: 500 }
      )
    }

    // Parsowanie JSON z odpowiedzi
    const venture: VentureResponse = JSON.parse(content)

    return NextResponse.json(venture)
  } catch (error) {
    console.error("Error in /api/generate:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Nieznany błąd" },
      { status: 500 }
    )
  }
}
