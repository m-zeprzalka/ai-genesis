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
          {
            role: "system",
            content:
              systemPrompt +
              "\n\nWAŻNE: Odpowiedz TYLKO poprawnym JSON. Bez dodatkowego tekstu przed lub po JSON.",
          },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.8,
        max_tokens: 3000,
      }),
    }
  )

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Groq API error: ${response.status} - ${errorText}`)
  }

  const data = await response.json()
  const content = data.choices[0]?.message?.content || "{}"

  // Usuń markdown code blocks jeśli są
  const cleanContent = content
    .replace(/```json\n?/g, "")
    .replace(/```\n?/g, "")
    .trim()

  try {
    return JSON.parse(cleanContent)
  } catch (e) {
    console.error("JSON parse error:", cleanContent)
    throw new Error("AI nie zwróciło poprawnego JSON")
  }
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
    const brandPrompt = `Jesteś strategiem marki. Dla biznesu: "${prompt}"

Odpowiedz TYLKO w formacie JSON (bez żadnego tekstu poza JSON):
{
  "selectedName": "wybrana nazwa marki",
  "nameOptions": ["nazwa1", "nazwa2", "nazwa3", "nazwa4", "nazwa5"],
  "brandStory": "2-3 zdania dlaczego ta marka powstaje",
  "voiceAndTone": "jak marka się komunikuje",
  "competitorPositioning": "czym się wyróżnia",
  "coreValues": ["wartość1", "wartość2", "wartość3"]
}`

    const brandResult = await callGroqAgent(brandPrompt, prompt, apiKey)

    // 🤖 AGENT 2: Creative Director
    const designPrompt = `Jesteś dyrektorem kreatywnym. Marka: "${brandResult.selectedName}"

Odpowiedz TYLKO w formacie JSON (bez żadnego tekstu poza JSON):
{
  "logoDescription": "szczegółowy opis logo 2-3 zdania",
  "logoVariations": ["wariant 1 opis", "wariant 2 opis", "wariant 3 opis"],
  "colorPalette": {
    "primary": "#HEXKOD (psychologia koloru dla tej marki)",
    "secondary": "#HEXKOD (wspiera komunikację poprzez...)",
    "accent": "#HEXKOD (akcentuje CTA)"
  },
  "typography": {
    "heading": "Nazwa fontu - dlaczego pasuje",
    "body": "Nazwa fontu - dlaczego czytelny"
  },
  "designPrinciples": ["zasada 1", "zasada 2", "zasada 3"]
}

WAŻNE: Kolory muszą być UNIKALNE (nie #3B82F6, #10B981), dopasowane do branży i psychologii.`

    const designResult = await callGroqAgent(
      designPrompt,
      brandResult.selectedName,
      apiKey
    )

    // 🤖 AGENT 3: Product Strategist
    const productPrompt = `Jesteś strategiem produktu. Marka: "${brandResult.selectedName}"

Odpowiedz TYLKO w formacie JSON:
{
  "problemStatement": "jaki problem rozwiązujemy 2 zdania",
  "solution": "jak produkt to rozwiązuje 2 zdania",
  "keyBenefits": ["benefit1", "benefit2", "benefit3", "benefit4", "benefit5"],
  "uniqueValueProposition": "1 zdanie - dlaczego my a nie konkurencja",
  "pricingStrategy": "jak monetyzujemy",
  "revenueModel": "skąd przychody",
  "websiteStructure": [
    {"page": "Strona Główna", "content": "co na homepage"},
    {"page": "O Nas / Usługi", "content": "treść sekcji"},
    {"page": "Kontakt / CTA", "content": "jak zachęcić"}
  ]
}`

    const productResult = await callGroqAgent(
      productPrompt,
      brandResult.selectedName,
      apiKey
    )

    // 🤖 AGENT 4: Marketing Director
    const marketingPrompt = `Jesteś dyrektorem marketingu. Marka: "${brandResult.selectedName}"

Odpowiedz TYLKO w formacie JSON:
{
  "launchCampaign": {
    "week1": "Tydzień 1: co robimy",
    "week2": "Tydzień 2: co robimy",
    "week3": "Tydzień 3: co robimy",
    "week4": "Tydzień 4: co robimy"
  },
  "contentPillars": ["temat1", "temat2", "temat3", "temat4"],
  "influencerStrategy": "kogo zaangażować i jak",
  "paidAdsCopy": [
    {"platform": "Facebook Ads", "headline": "nagłówek", "body": "treść"},
    {"platform": "Google Ads", "headline": "nagłówek", "body": "treść"},
    {"platform": "LinkedIn Ads", "headline": "nagłówek", "body": "treść"}
  ],
  "prStrategy": "jak zdobyć media coverage"
}`

    const marketingResult = await callGroqAgent(
      marketingPrompt,
      brandResult.selectedName,
      apiKey
    )

    // 🤖 AGENT 5: Tech Lead
    const techPrompt = `Jesteś tech leadem. Produkt: "${brandResult.selectedName}"

Odpowiedz TYLKO w formacie JSON:
{
  "stack": "1 zdanie z całym stackiem np Next.js + Supabase",
  "mvpTimeline": "ile czasu zająć budowa MVP",
  "estimatedBudget": "przybliżony koszt MVP",
  "technicalRisks": ["ryzyko1", "ryzyko2", "ryzyko3"]
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
