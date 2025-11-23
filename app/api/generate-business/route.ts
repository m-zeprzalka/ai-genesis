import { NextRequest, NextResponse } from "next/server"

export const runtime = "edge"
export const maxDuration = 60

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

// AI Provider configuration with automatic failover
const AI_PROVIDERS = [
  {
    name: "Groq",
    endpoint: "https://api.groq.com/openai/v1/chat/completions",
    model: "llama-3.3-70b-versatile",
    getKey: () => process.env.GROQ_API_KEY,
  },
  {
    name: "Cerebras",
    endpoint: "https://api.cerebras.ai/v1/chat/completions",
    model: "llama3.1-70b",
    getKey: () => process.env.CEREBRAS_API_KEY,
  },
]

// Enhanced AI caller with multi-provider failover
async function callAIAgent(
  systemPrompt: string,
  userPrompt: string,
  _apiKey: string, // Legacy param, now using env-based providers
  temperature: number = 0.8,
  maxRetries: number = 2
) {
  let lastError: Error | null = null

  // Try each provider in order
  for (const provider of AI_PROVIDERS) {
    const apiKey = provider.getKey()
    if (!apiKey) {
      console.log(`⏭️ Skipping ${provider.name} (no API key)`)
      continue
    }

    console.log(`🔄 Trying ${provider.name}...`)

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      let content = ""
      let cleanContent = ""

      try {
        const response = await fetch(provider.endpoint, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: provider.model,
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt },
            ],
            temperature,
            max_tokens: 3000,
          }),
        })

        if (!response.ok) {
          const errorText = await response.text()
          // Check if it's HTML error page (Cloudflare 500)
          if (errorText.includes("<!DOCTYPE html>")) {
            throw new Error(
              `${provider.name} server error (${response.status})`
            )
          }
          throw new Error(`API error: ${response.status} - ${errorText}`)
        }

        const data = await response.json()
        content = data.choices[0]?.message?.content || "{}"

        // Agresywne czyszczenie JSON
        cleanContent = content.trim()

        // Usuń markdown code blocks
        cleanContent = cleanContent.replace(/```json\n?/gi, "")
        cleanContent = cleanContent.replace(/```\n?/g, "")
        cleanContent = cleanContent.trim()

        // Usuń tekst przed pierwszym {
        const firstBrace = cleanContent.indexOf("{")
        if (firstBrace > 0) {
          cleanContent = cleanContent.substring(firstBrace)
        }

        // Usuń tekst po ostatnim }
        const lastBrace = cleanContent.lastIndexOf("}")
        if (lastBrace > -1 && lastBrace < cleanContent.length - 1) {
          cleanContent = cleanContent.substring(0, lastBrace + 1)
        }

        const parsed = JSON.parse(cleanContent)
        console.log(`✅ ${provider.name} succeeded`)
        return parsed
      } catch (e) {
        lastError = e instanceof Error ? e : new Error("Unknown error")

        // Don't retry on JSON parse errors - bad prompt
        if (e instanceof SyntaxError) {
          console.error(`❌ ${provider.name} JSON parse failed`)
          console.error("Raw response:", content)
          console.error("After cleaning:", cleanContent)
          console.error("Error:", e.message)
          // Try next provider instead of throwing
          break
        }

        // Retry on network/API errors
        if (attempt < maxRetries) {
          console.log(`⏳ ${provider.name} retry ${attempt + 1}/${maxRetries}`)
          await new Promise((resolve) =>
            setTimeout(resolve, 1000 * (attempt + 1))
          )
          continue
        } else {
          console.log(`❌ ${provider.name} failed after ${maxRetries} retries`)
          break // Try next provider
        }
      }
    }
  }

  throw lastError || new Error("All AI providers failed")
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

    // 🤖 AGENT 1: Brand Strategist (Enterprise Edition v2)
    // Focus: Pełna tożsamość marki - naming, archetyp, misja, persona + głęboka strategia
    const brandPrompt = `Jesteś Senior Brand strategiem. Tworzysz kompleksowe fundamenty marek dla startupów.

POMYSŁ: "${prompt}"

ZWRÓĆ PEŁNĄ TOŻSAMOŚĆ MARKI w JSON:
{
  "selectedName": "Główna nazwa marki",
  "nameOptions": ["alternatywa1", "alternatywa2", "alternatywa3", "alternatywa4"],
  "nameRationale": "1-2 zdania: DLACZEGO 'selectedName' jest idealna (np. gra słów, metafora, łatwość zapamiętania)",
  "slogan": "Chwytliwy slogan/tagline (max kilka słów, ZEWNĘTRZNY, dla klienta)",
  "archetype": {
    "name": "Archetyp (wybierz 1 z 12: Mędrzec, Odkrywca, Bohater, Buntownik, Mag, Twórca, Władca, Opiekun, Kochanek, Blazen, Zwykły Człowiek, Niewinny)",
    "icon": "Emoji ikona archetypu (np. 🧙 dla Mędrca, 🎯 dla Bohatera)",
    "description": "1-2 zdania dlaczego ten archetyp pasuje do marki"
  },
  "brandMantra": "Mantra marki (3-5 słów, WEWNĘTRZNY kompas dla zespołu, np. 'Autentyczne Sportowe Osiągi')",
  "mission": "Krótka misja (CO robimy TERAZ) - 1-2 zdania",
  "vision": "Inspirująca wizja (GDZIE chcemy być za 5 lat) - 1-2 zdania",
  "brandStory": "Gotowa historia 'O nas' (3 akapity, ~150 słów) - emocjonalna, autentyczna, inspirująca",
  "voiceAndTone": {
    "voice": "Głos marki (np. Ekspercki, Przyjacielski, Inspirujący)",
    "tone": "Ton komunikacji (np. Profesjonalny, Ludzki, Bezpośredni)",
    "examples": [
      "Przykład 1: Jak powitać klienta na stronie",
      "Przykład 2: Jak odpowiedzieć na negatywny komentarz",
      "Przykład 3: Jak ogłosić nową funkcję na social media"
    ]
  },
  "positioningStatement": "Statement pozycjonujący wg formuły: 'Dla [Grupa Docelowa], [Nazwa Marki] jest [Kategoria Rynkowa], która [Kluczowa Korzyść/UVP], ponieważ [Powód, by Wierzyć].'",
  "coreValues": ["Wartość1", "Wartość2", "Wartość3"],
  "persona": {
    "name": "Imię i nazwisko idealnego klienta",
    "age": 35,
    "demographics": "Szczegóły: zawód, dochód, lokalizacja, styl życia",
    "painPoints": [
      "Ból 1: Konkretny problem klienta",
      "Ból 2",
      "Ból 3"
    ],
    "goals": [
      "Cel 1: Co klient chce osiągnąć",
      "Cel 2",
      "Cel 3"
    ],
    "howWeHelp": "2-3 zdania: JAK KONKRETNIE nasz produkt rozwiązuje bóle i pomaga osiągnąć cele"
  }
}

PRZYKŁADY:
- Nazwy: Airbnb (air+bnb), Stripe (payment stripes)
- Slogan: Nike "Just Do It", Apple "Think Different"
- Archetyp: Apple = Twórca, Nike = Bohater, Volvo = Opiekun
- Mantra: Nike "Authentic Athletic Performance", Disney "Fun Family Entertainment"
- Positioning Statement: "Dla zapracowanych profesjonalistów, Slack jest platformą do komunikacji, która zastępuje e-mail i przyspiesza pracę, ponieważ łączy wszystkie rozmowy i narzędzia w jednym miejscu."

Odpowiedz TYLKO poprawnym JSON (bez markdown, bez komentarzy):`

    const brandResult = await callAIAgent(brandPrompt, prompt, apiKey, 0.9)

    // 🤖 AGENT 2: Creative Director
    // Focus: Visual identity, colors psychology, typography
    // KONTEKST: Widzi nazwę marki, slogan i archetyp
    const designPrompt = `Jesteś creative directorem ze specjalizacją w identyfikacji wizualnej. Projektowałeś dla startupów, które później stały się unicornami.

KONTEKST PROJEKTU:
Marka: "${brandResult.selectedName}"
Slogan: "${brandResult.slogan}"
Archetyp: ${brandResult.archetype.name} - ${brandResult.archetype.description}
Historia: "${brandResult.brandStory}"
Głos & Ton: ${brandResult.voiceAndTone.voice} / ${brandResult.voiceAndTone.tone}

ZADANIE:
Zaprojektuj spójną identyfikację wizualną, która:
- Logo: ma KONKRETNY symbol/metaforę (nie ogólniki!)
- Kolory: psychologicznie dopasowane do branży i emocji marki
- Typography: odzwierciedla charakter (modern/classic, bold/elegant)

KLUCZOWE ZASADY KOLORÓW:
- Fintech/SaaS: niebieski (zaufanie), fiolet (innowacja)
- Food/Wellness: zielony (natura), pomarańcz (energia)
- Luxury: czerń, złoto, burgund
- Creative/Art: jasne kolory, wysokie saturacje

PRZYKŁAD DOBREGO OPISU LOGO:
"Stylizowana litera S tworząca nieskończoną pętlę, symbolizująca ciągły rozwój i iterację. Minimalistyczny, geometric style. Monochrom dla uniwersalności."

Odpowiedz TYLKO poprawnym JSON:
{
  "logoDescription": "Szczegółowy opis: Jaki SYMBOL/KSZTAŁT? Jaki STYL (flat/3d/geometric)? Jaka METAFORA? (3-4 zdania)",
  "logoVariations": [
    "Wariant 1: [Konkretny opis alternatywnego podejścia]",
    "Wariant 2: [Inny styl, inna metafora]",
    "Wariant 3: [Trzecia opcja wizualna]"
  ],
  "colorPalette": {
    "primary": "#HEXCODE (Nazwa koloru + psychologia: dlaczego TEN kolor dla tej branży?)",
    "secondary": "#HEXCODE (Inny odcień/barwa + jak wspiera primary?)",
    "accent": "#HEXCODE (Kontrastowy kolor + do czego służy: CTA/highlights)"
  },
  "typography": {
    "heading": "Nazwa fontu (np. Inter, Playfair Display) - dlaczego pasuje do charakteru marki?",
    "body": "Nazwa fontu (np. Inter, Source Sans) - czemu czytelny i spójny z headingiem?"
  },
  "designPrinciples": [
    "Zasada 1 (konkretna dla marki, np. 'Always leave whitespace')",
    "Zasada 2",
    "Zasada 3"
  ]
}`

    const designResult = await callAIAgent(
      designPrompt,
      `Marka: ${brandResult.selectedName}\nStory: ${brandResult.brandStory}`,
      apiKey,
      0.85
    )

    // 🤖 AGENT 3: Product Strategist
    // Focus: Value proposition, business model, website structure
    // KONTEKST: Widzi brand + design DNA
    const productPrompt = `Jesteś product strategiem. Pomagałeś zbudować MVP dla 50+ startupów. Myślisz o VALUE, nie o features.

KONTEKST:
Marka: "${brandResult.selectedName}"
Problem/Wizja: "${brandResult.brandStory}"
Pozycjonowanie: "${brandResult.competitorPositioning}"

ZADANIE:
Zdefiniuj KONKRETNY produkt/usługę:
- Problem: co boli użytkowników? (nie wymyślaj - bazuj na realnej potrzebie)
- Solution: jak TEN produkt rozwiązuje problem? (mechanizm, nie buzzwords)
- Benefits: co REALNIE zyskuje użytkownik? (nie features, tylko outcomes)
- UVP: dlaczego klient wybierze NAS, a nie konkurencję?

PRZYKŁAD DOBREGO UVP:
❌ "Najlepsza platforma do zarządzania projektami"
✅ "Zarządzaj projektami bez meetingów - wszystko w jednym miejscu, 10 minut dziennie"

STRUKTURA STRONY:
- Homepage: Hero (UVP) + Benefits + Social Proof + CTA
- O Nas/Usługi: Szczegółowy opis rozwiązania
- Kontakt: Formularz + FAQ + Pricing (jeśli B2C)

Odpowiedz TYLKO poprawnym JSON:
{
  "problemStatement": "2-3 zdania: KONKRETNY problem użytkownika. Używaj liczb jeśli możliwe (np. '73% małych firm...')",
  "solution": "2-3 zdania: JAK dokładnie rozwiązujemy problem? Jaki mechanizm/proces?",
  "keyBenefits": [
    "Benefit 1: OUTCOME dla użytkownika (np. 'Oszczędzasz 5h tygodniowo')",
    "Benefit 2",
    "Benefit 3",
    "Benefit 4",
    "Benefit 5"
  ],
  "uniqueValueProposition": "1 zdanie w formacie: [CO] + [DLA KOGO] + [DLACZEGO LEPSZE]. Konkretne, mierzalne.",
  "pricingStrategy": "Np. Freemium, Subskrypcja, One-time payment, Pay-per-use. UZASADNIJ wybór 1 zdaniem.",
  "revenueModel": "Główne źródło przychodów + potencjalne dodatkowe (np. subscriptions + marketplace fee)",
  "websiteStructure": [
    {
      "page": "Strona Główna",
      "content": "Sekcje: 1) Hero z UVP 2) Problem/Solution 3) Key Benefits 4) Social Proof 5) Pricing/CTA"
    },
    {
      "page": "O Nas / Usługi",
      "content": "Szczegóły: Jak działa produkt? Proces krok po kroku. Case studies."
    },
    {
      "page": "Kontakt / Pricing",
      "content": "Formularz kontaktowy, FAQ, opcjonalnie cennik (jeśli B2C)"
    }
  ]
}`

    const productResult = await callAIAgent(
      productPrompt,
      `Marka: ${brandResult.selectedName}\nProblem: ${brandResult.brandStory}`,
      apiKey,
      0.75
    )

    // 🤖 AGENT 4: Marketing Director
    // Focus: Go-to-market strategy, content, paid ads
    // KONTEKST: Pełny obraz marki + produktu
    const marketingPrompt = `Jesteś marketing directorem z doświadczeniem w growth hackingu. Uruchomiłeś 100+ kampanii dla startupów w fazie MVP.

PEŁNY KONTEKST:
Marka: "${brandResult.selectedName}"
UVP: "${productResult.uniqueValueProposition}"
Target: Klient opisany w "${prompt}"
Budget: Zakładamy mały/średni startup budget (do $5k miesięcznie)

ZADANIE:
Stwórz 4-tygodniowy launch plan:
- Tydzień 1: Przygotowanie (landing page, content, social media setup)
- Tydzień 2: Soft launch (early adopters, beta users, feedback loop)
- Tydzień 3: Public launch (Product Hunt, social media blitz, PR push)
- Tydzień 4: Optimization (retargeting, testimonials, case studies)

CONTENT PILLARS - muszą być KONKRETNE dla branży:
❌ "Edukacja, Inspiracja, Produkty"
✅ "How-to guides (SEO), Customer stories (trust), Industry insights (thought leadership)"

REKLAMY - pisz KONKRETNE copy (nie placeholdery):
❌ "Nagłówek: Sprawdź naszą ofertę"
✅ "Nagłówek: Zarządzaj 10 projektami w czasie 1 - bez meetingów"

Odpowiedz TYLKO poprawnym JSON:
{
  "launchCampaign": {
    "week1": "Pre-launch: [Konkretne akcje] np. 'Build landing page + email waitlist, create 10 LinkedIn posts, prepare Product Hunt assets'",
    "week2": "Soft launch: [Konkretne akcje] np. 'Onboard 50 beta users via personal outreach, collect testimonials, iterate on feedback'",
    "week3": "Public launch: [Konkretne akcje] np. 'Product Hunt launch, LinkedIn/Twitter announcement, reach out to 20 micro-influencers'",
    "week4": "Growth: [Konkretne akcje] np. 'Retarget website visitors, publish first case study, optimize conversion funnel'"
  },
  "contentPillars": [
    "Pilar 1: [Typ contentu] + [Cel biznesowy] (np. 'SEO blog posts - organic traffic')",
    "Pilar 2",
    "Pilar 3",
    "Pilar 4"
  ],
  "influencerStrategy": "2-3 zdania: JACY influencerzy (micro/macro/nano)? GDZIE ich znaleźć? JAK ich zaangażować (paid/partnership/gifting)?",
  "paidAdsCopy": [
    {
      "platform": "Facebook Ads",
      "headline": "[KONKRETNY headline z UVP - max 40 znaków]",
      "body": "[KONKRETNY copy z benefitem i CTA - max 125 znaków]"
    },
    {
      "platform": "Google Ads",
      "headline": "[KONKRETNY headline z keyword - max 30 znaków]",
      "body": "[KONKRETNY copy - max 90 znaków]"
    },
    {
      "platform": "LinkedIn Ads",
      "headline": "[KONKRETNY headline B2B-focused]",
      "body": "[KONKRETNY copy professional tone]"
    }
  ],
  "prStrategy": "2-3 zdania: Jakie media targetować? Jaki angle (np. 'disrupting industry X')? Jak zdobyć attention (np. unique data/research)?"
}`

    const marketingResult = await callAIAgent(
      marketingPrompt,
      `Marka: ${brandResult.selectedName}\nUVP: ${productResult.uniqueValueProposition}\nPomysł: ${prompt}`,
      apiKey,
      0.8
    )

    // 🤖 AGENT 5: Tech Lead
    // Focus: Technical stack, timeline, budget, risks
    // KONTEKST: Product requirements
    const techPrompt = `Jesteś tech leadem z doświadczeniem w budowaniu MVP. Wiesz, że SZYBKOŚĆ > PERFEKCJA na starcie.

KONTEKST:
Produkt: "${brandResult.selectedName}"
Funkcjonalność: ${JSON.stringify(productResult.websiteStructure)}
Revenue model: ${productResult.revenueModel}

ZADANIE:
Zaproponuj MINIMALNY stack technologiczny dla MVP:
- Priorytet: szybkość wdrożenia + niski koszt
- No-code/low-code OK jeśli sensowne
- Skalowalne (ale nie over-engineered)

PRZYKŁADY STACKÓW:
- Landing page: Webflow/Framer (no-code, szybko)
- SaaS MVP: Next.js + Supabase + Vercel (full-stack, darmowe do startu)
- E-commerce: Shopify (fastest time-to-market)
- Mobile app: React Native + Expo (cross-platform)

TIMELINE - bądź REALISTYCZNY:
- Prosta landing page: 1-2 tygodnie
- SaaS MVP (CRUD + auth): 4-8 tygodni
- Marketplace: 8-12 tygodni
- Mobile app: 8-16 tygodni

BUDGET - uwzględnij:
- Development (freelancer vs agency vs in-house)
- Infrastructure (hosting, databases, APIs)
- Third-party services (auth, payments, email)

Odpowiedz TYLKO poprawnym JSON:
{
  "stack": "KONKRETNY stack: Frontend + Backend + Database + Hosting. Np. 'Next.js 15 + Supabase (auth, DB) + Stripe + Vercel'. Uzasadnij wybór 1 zdaniem.",
  "mvpTimeline": "Realistyczny czas: X tygodni. Rozbij na fazy: 'Week 1-2: Design + Setup, Week 3-6: Core features, Week 7-8: Testing + Launch'",
  "estimatedBudget": "Zakres kosztów z rozbiciem: 'Development: $X, Infrastructure: $Y/month, Services: $Z/month. Total MVP: $A-$B'",
  "technicalRisks": [
    "Ryzyko 1: [Konkretne] + [Jak mitygować]",
    "Ryzyko 2: [Konkretne] + [Jak mitygować]",
    "Ryzyko 3: [Konkretne] + [Jak mitygować]"
  ]
}`

    const techResult = await callAIAgent(
      techPrompt,
      `Produkt: ${brandResult.selectedName}\nModel: ${productResult.revenueModel}`,
      apiKey,
      0.7
    )

    // 🎉 Merge all agent results
    const genesisResponse: GenesisResponse = {
      brand: brandResult,
      design: designResult,
      product: productResult,
      marketing: marketingResult,
      tech: techResult,
    }

    return NextResponse.json(genesisResponse)
  } catch (error) {
    console.error("Genesis orchestrator error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Nieznany błąd",
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    )
  }
}
