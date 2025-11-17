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

// Enhanced AI caller with retry logic and better error handling
async function callAIAgent(
  systemPrompt: string,
  userPrompt: string,
  apiKey: string,
  temperature: number = 0.8,
  maxRetries: number = 2
) {
  let lastError: Error | null = null

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
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
            temperature,
            max_tokens: 3000,
          }),
        }
      )

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`API error: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      const content = data.choices[0]?.message?.content || "{}"

      // Clean markdown artifacts
      const cleanContent = content
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim()

      const parsed = JSON.parse(cleanContent)
      return parsed
    } catch (e) {
      lastError = e instanceof Error ? e : new Error("Unknown error")

      // Don't retry on JSON parse errors - bad prompt
      if (e instanceof SyntaxError) {
        console.error("JSON parse failed:", e)
        throw new Error("AI zwróciło niepoprawny JSON")
      }

      // Retry on network/API errors
      if (attempt < maxRetries) {
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * (attempt + 1))
        )
        continue
      }
    }
  }

  throw lastError || new Error("Max retries exceeded")
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
    // Focus: Naming, storytelling, emotional connection
    const brandPrompt = `Jesteś ekspertem od brandingu z 15-letnim doświadczeniem. Tworzysz marki, które ludzie PAMIĘTAJĄ i z którymi się IDENTYFIKUJĄ.

POMYSŁ KLIENTA: "${prompt}"

ZADANIE:
Stwórz fundament marki, która:
- Ma nazwę zapadającą w pamięć (krótką, wymawialną, unikalną)
- Opowiada emocjonalną historię (dlaczego ta marka MUSI istnieć?)
- Ma wyraźny charakter (jak mówi? jaka jest jej osobowość?)
- Wyróżnia się na rynku (czym jest INNA niż konkurencja?)

PRZYKŁADY DOBRYCH NAZW:
- Airbnb (air + bed & breakfast) - proste, opisowe
- Spotify (spot + identify) - łatwe do zapamiętania
- Stripe (paski płatnicze) - wizualne, tech

Odpowiedz TYLKO poprawnym JSON (bez markdown, bez komentarzy):
{
  "selectedName": "Najlepsza nazwa z 5 opcji",
  "nameOptions": ["nazwa1", "nazwa2", "nazwa3", "nazwa4", "nazwa5"],
  "brandStory": "2-3 zdania: Dlaczego ta marka powstaje? Jaki problem zauważyliśmy? Jaką zmianę chcemy wprowadzić?",
  "voiceAndTone": "Opis w 2 zdaniach: Czy marka jest formalna czy casualowa? Poważna czy playful? Expert czy buddy?",
  "competitorPositioning": "1-2 zdania: Czym KONKRETNIE różnimy się od konkurencji? Co robimy lepiej/inaczej?",
  "coreValues": ["wartość1 (1-2 słowa)", "wartość2", "wartość3"]
}`

    const brandResult = await callAIAgent(brandPrompt, prompt, apiKey, 0.9)

    // 🤖 AGENT 2: Creative Director
    // Focus: Visual identity, colors psychology, typography
    // KONTEKST: Widzi nazwę marki i brand story
    const designPrompt = `Jesteś creative directorem ze specjalizacją w identyfikacji wizualnej. Projektowałeś dla startupów, które później stały się unicornami.

KONTEKST PROJEKTU:
Marka: "${brandResult.selectedName}"
Historia: "${brandResult.brandStory}"
Charakter: ${brandResult.voiceAndTone}

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
- NIE UŻYWAJ: #3B82F6, #10B981, #EF4444 (zbyt powszechne!)

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
