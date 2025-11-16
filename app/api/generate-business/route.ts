import { NextRequest, NextResponse } from "next/server"

export const runtime = "edge"
export const maxDuration = 60

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

async function callGroqAgent(
  systemPrompt: string,
  userPrompt: string,
  apiKey: string
) {
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
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.9,
        max_tokens: 3000,
        response_format: { type: "json_object" },
      }),
    }
  )

  if (!response.ok) {
    throw new Error(`Groq API error: ${response.status}`)
  }

  const data = await response.json()
  return JSON.parse(data.choices[0]?.message?.content || "{}")
}

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

    // 🤖 AGENT 1: Brand Strategist
    const brandPrompt = `Jesteś strategiem marki z agencji reklamowej. Myślisz o emocjach, storytellingu i pozycjonowaniu.

Dla biznesu: "${prompt}"

STWÓRZ:
1. 5 zapadających w pamięć nazw (krótkie, łatwe, unikalne)
2. Wybierz najlepszą
3. Brand Story (2-3 zdania): Dlaczego ta marka powstaje? Jaką emocję wywołuje?
4. Voice & Tone: Jak marka się komunikuje?
5. Competitor Positioning: Czym wyróżnia się na rynku?
6. Core Values: 3 wartości (każda 1-2 słowa)

JSON:
{
  "selectedName": "...",
  "nameOptions": ["..."],
  "brandStory": "...",
  "voiceAndTone": "...",
  "competitorPositioning": "...",
  "coreValues": ["..."]
}`

    const brandResult = await callGroqAgent(brandPrompt, prompt, apiKey)

    // 🤖 AGENT 2: Creative Director
    const designPrompt = `Jesteś dyrektorem kreatywnym. Tworzysz wizualną tożsamość marek.

Marka: "${brandResult.selectedName}"
Story: "${brandResult.brandStory}"

STWÓRZ:
1. Logo Description: Szczegółowy opis koncepcji (2-3 zdania) - jaki symbol, styl, metafora?
2. Logo Variations: 3 różne kierunki wizualne (po 1 zdaniu)
3. Color Palette: 3 kolory hex + uzasadnienie
4. Typography: heading font + body font (z opisem stylu)
5. Design Principles: 3 zasady design systemu
6. Key Screens: 3 kluczowe ekrany (nazwa + opis layoutu)
7. Personas: 3 persony z emotional drivers i motivacjami (NIE tech pain points!)

JSON:
{
  "logoDescription": "...",
  "logoVariations": ["Wariant 1", "Wariant 2", "Wariant 3"],
  "colorPalette": {
    "primary": "#hex (uzasadnienie)",
    "secondary": "#hex",
    "accent": "#hex"
  },
  "typography": {
    "heading": "Font + opis",
    "body": "Font + opis"
  },
  "designPrinciples": ["Zasada 1", "2", "3"],
  "keyScreens": [
    {"screen": "Homepage", "description": "Opis layoutu"},
    {"screen": "Dashboard", "description": "..."},
    {"screen": "Feature Page", "description": "..."}
  ],
  "personas": [
    {
      "name": "Imię",
      "age": "28-35",
      "occupation": "Zawód",
      "emotionalDrivers": ["Chce czuć się...", "Boi się..."],
      "motivations": ["Dąży do...", "Marzy o..."]
    }
  ]
}`

    const designResult = await callGroqAgent(
      designPrompt,
      brandResult.selectedName,
      apiKey
    )

    // 🤖 AGENT 3: Product Strategist
    const productPrompt = `Jesteś strategiem produktu. Nie myślisz o tech stacku, tylko o VALUE PROPOSITION.

Marka: "${brandResult.selectedName}"
Persony: ${JSON.stringify(designResult.personas)}

STWÓRZ:
1. Problem Statement: Jaki realny problem rozwiązujemy? (2 zdania)
2. Solution: Jak nasz produkt to rozwiązuje? (2 zdania)
3. Key Benefits: 5 benefitów dla użytkownika (NIE funkcji, tylko korzyści!)
4. Unique Value Proposition: 1 zdanie - dlaczego my, a nie konkurencja?
5. Pricing Strategy: Jak monetyzujemy?
6. Revenue Model: Skąd przychody?

JSON:
{
  "problemStatement": "...",
  "solution": "...",
  "keyBenefits": ["Benefit 1", "2", "3", "4", "5"],
  "uniqueValueProposition": "...",
  "pricingStrategy": "...",
  "revenueModel": "..."
}`

    const productResult = await callGroqAgent(
      productPrompt,
      brandResult.selectedName,
      apiKey
    )

    // 🤖 AGENT 4: Marketing Director
    const marketingPrompt = `Jesteś dyrektorem marketingu. Planujesz kampanie, nie piszesz generycznych tekstów.

Marka: "${brandResult.selectedName}"
UVP: "${productResult.uniqueValueProposition}"

STWÓRZ:
1. Launch Campaign: Plan 4 tygodni (co robimy każdego tygodnia - konkretnie!)
2. Content Pillars: 4 tematy treści
3. Influencer Strategy: Kogo zaangażować i jak?
4. Paid Ads Copy: 3 kreacje (Facebook, Google, LinkedIn) - headline + body
5. PR Strategy: Jak zdobyć media coverage?

JSON:
{
  "launchCampaign": {
    "week1": "Tydzień 1: ...",
    "week2": "...",
    "week3": "...",
    "week4": "..."
  },
  "contentPillars": ["Temat 1", "2", "3", "4"],
  "influencerStrategy": "...",
  "paidAdsCopy": [
    {"platform": "Facebook Ads", "headline": "...", "body": "..."},
    {"platform": "Google Ads", "headline": "...", "body": "..."},
    {"platform": "LinkedIn Ads", "headline": "...", "body": "..."}
  ],
  "prStrategy": "..."
}`

    const marketingResult = await callGroqAgent(
      marketingPrompt,
      brandResult.selectedName,
      apiKey
    )

    // 🤖 AGENT 5: Tech Lead
    const techPrompt = `Jesteś tech leadem. Dajesz minimalny overview - nie rozpisuj się!

Produkt: "${brandResult.selectedName}"
Benefits: ${JSON.stringify(productResult.keyBenefits)}

STWÓRZ:
1. Stack: 1 zdanie opisujące cały stack (np. "Next.js + Supabase + Vercel dla szybkiego MVP")
2. MVP Timeline: Ile czasu zajmie zbudowanie (realistycznie)
3. Estimated Budget: Przybliżony koszt MVP (zakres kwoty)
4. Technical Risks: 3 główne ryzyka techniczne

JSON:
{
  "stack": "1 zdanie z całym stackiem",
  "mvpTimeline": "X tygodni/miesięcy",
  "estimatedBudget": "$X - $Y",
  "technicalRisks": ["Ryzyko 1", "2", "3"]
}`

    const techResult = await callGroqAgent(
      techPrompt,
      brandResult.selectedName,
      apiKey
    )

    // 🎉 Merge
    const genesisResponse: GenesisResponse = {
      brand: brandResult,
      design: designResult,
      product: productResult,
      marketing: marketingResult,
      tech: techResult,
    }

    return NextResponse.json(genesisResponse)
  } catch (error) {
    console.error("Orchestrator error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Nieznany błąd" },
      { status: 500 }
    )
  }
}
