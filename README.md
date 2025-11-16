# 🎨 Genesis – AI Business Maker

**Genesis** to kompleksowa aplikacja generująca pomysł na Twój brand. Od strategii i designu po gotowe koncepcje marketingowe. **Nie potrzebujesz agencji reklamowej, żeby rozpocząć swój biznes.**

Opisujesz pomysł w jednym zdaniu, a otrzymujesz:

- ✅ **Strategię Marki** – naming, brand story, positioning, wartości
- ✅ **Design** – AI-generated logo, paleta kolorów, typografia, zasady projektowe
- ✅ **Produkt** – value proposition, struktura strony, model biznesowy
- ✅ **Marketing** – 4-tygodniowa kampania, content pillars, reklamy
- ✅ **Technologia** – stack technologiczny, timeline, budżet

---

## 🚀 Dlaczego Genesis?

- **Multi-Agent AI** – 5 wyspecjalizowanych agentów pracujących sekwencyjnie
- **AI Logo Generator** – automatyczne generowanie logo przez Flux AI (Hugging Face)
- **Zero kosztów** – używa darmowego API Groq (Llama 3.3 70B) i Hugging Face
- **Mobile-first design** – responsywny UI dopracowany dla telefonów
- **100% po polsku** – wszystkie nazwy i opisy w języku polskim

---

## 📦 Instalacja i Uruchomienie

### 1. Sklonuj repozytorium

```bash
git clone https://github.com/m-zeprzalka/ai-genesis.git
cd ai-genesis/syntarch
```

### 2. Zainstaluj zależności

```bash
npm install
```

### 3. Zdobądź darmowe klucze API

#### Groq API (Wymagane)

1. Wejdź na [console.groq.com](https://console.groq.com)
2. Zarejestruj się (całkowicie za darmo)
3. Przejdź do **API Keys** i wygeneruj nowy klucz

#### Hugging Face API (Opcjonalne - dla generowania logo)

1. Wejdź na [huggingface.co](https://huggingface.co)
2. Zarejestruj się (całkowicie za darmo)
3. Przejdź do [Settings → Access Tokens](https://huggingface.co/settings/tokens)
4. Kliknij **New token** (typ: Read)

### 4. Skonfiguruj zmienne środowiskowe

Skopiuj plik `.env.local.example` na `.env.local`:

```bash
cp .env.local.example .env.local
```

Edytuj `.env.local` i wklej swoje klucze:

```env
GROQ_API_KEY=your_groq_api_key_here
HUGGINGFACE_API_KEY=your_huggingface_api_key_here
```

### 5. Uruchom aplikację

```bash
npm run dev
```

Otwórz [http://localhost:3000](http://localhost:3000) w przeglądarce.

---

## 🎯 Jak to działa?

### Multi-Agent AI Orchestration

**5 wyspecjalizowanych agentów AI** pracujących sekwencyjnie:

1. **Brand Strategist**

   - Nazwa marki, brand story, voice & tone
   - Market positioning, core values
   - Strategia nazewnictwa

2. **Creative Director**

   - Generowanie logo (Flux AI)
   - Unikalna paleta kolorów (dopasowana do branży)
   - Typografia (główne fonty)
   - Design principles

3. **Product Strategist**

   - Problem, solution, unique value proposition
   - Struktura strony (sekcje, CTA)
   - Model biznesowy

4. **Marketing Director**

   - 4-tygodniowa kampania marketingowa
   - Content pillars (LinkedIn, Instagram, TikTok)
   - Pomysły na reklamy
   - Strategia influencer marketing

5. **Tech Lead**
   - Rekomendowany stack technologiczny
   - Timeline wdrożenia
   - Budżet (wraz z uzasadnieniem)
   - Ryzyka techniczne

### AI Logo Generation

- **Model:** Stable Diffusion XL Base 1.0 (Hugging Face)
- **Czas generowania:** 5-10 sekund (po "zimnym starcie" modelu może zająć 15-30s)
- **Format:** PNG, base64 encoded
- **Koszt:** CAŁKOWICIE DARMOWE (Hugging Face Inference API)
- **Prompt engineering:** Automatycznie optymalizowany dla profesjonalnych wyników

Przykład: "Professional minimalist logo design for eco-friendly coffee shop. Clean, simple, modern, flat design, vector style, white background, high quality, professional branding"

---

## 🏗️ Architektura Projektu

```
syntarch/
├── app/
│   ├── api/
│   │   ├── generate-business/
│   │   │   └── route.ts          # Multi-agent orchestrator (Groq API)
│   │   └── generate-logo/
│   │       └── route.ts          # Logo generation (Replicate API)
│   ├── page.tsx                  # Main UI (Hero + Results)
│   └── layout.tsx                # Layout aplikacji
├── components/
│   ├── sections/
│   │   ├── BrandSection.tsx      # Sekcja Marka
│   │   ├── DesignSection.tsx     # Sekcja Design (z logo generation)
│   │   ├── ProductSection.tsx    # Sekcja Produkt
│   │   ├── MarketingSection.tsx  # Sekcja Marketing
│   │   └── TechSection.tsx       # Sekcja Technologia
│   └── ui/                       # Shadcn/ui components
├── .env.local                    # API keys (NIE commituj!)
├── .env.local.example            # Przykładowa konfiguracja
└── README.md                     # Ten plik
```

### Kluczowe Elementy:

- **`/api/generate-business`** – multi-agent orchestrator, sekwencyjnie uruchamia 5 agentów AI
- **`/api/generate-logo`** – integracja z Replicate Flux Schnell, polling mechanism
- **`page.tsx`** – główny UI z Hero input (h-14/h-16 mobile), vertical tabs, responsive grid
- **`DesignSection.tsx`** – komponent z integracją logo generation, gradient backgrounds, hover effects

### Stack Technologiczny:

- **Frontend:** Next.js 15 (App Router, React Server Components)
- **Styling:** Tailwind CSS + Shadcn/ui
- **AI Engine:** Groq API (Llama 3.3 70B Versatile)
- **Logo Generation:** Hugging Face Inference API (Stable Diffusion XL)
- **Runtime:** Edge Functions (60s max duration)
- **Deployment:** Vercel (rekomendowane)

---

## 🌐 Deployment na Vercel

### 1. Wypchnij kod na GitHub

```bash
git add .
git commit -m "Genesis MVP - AI Business Maker"
git push origin main
```

### 2. Połącz z Vercel

1. Wejdź na [vercel.com](https://vercel.com)
2. Kliknij **New Project**
3. Zaimportuj repozytorium `m-zeprzalka/ai-genesis`
4. W ustawieniach projektu dodaj zmienne środowiskowe:
   ```
   GROQ_API_KEY = twoj-groq-klucz
   HUGGINGFACE_API_KEY = twoj-huggingface-token
   ```
5. Kliknij **Deploy**

### 3. Gotowe!

Aplikacja działa globalnie na własnej domenie Vercel, **całkowicie za darmo** (free tier wystarczy dla MVP).

---

## 🐛 Troubleshooting

### Błąd: "GROQ_API_KEY nie jest skonfigurowany"

- Upewnij się, że plik `.env.local` istnieje
- Sprawdź, czy klucz jest poprawnie wklejony (bez spacji)
- Zrestartuj serwer dev (`Ctrl+C`, następnie `npm run dev`)

### Logo się nie generuje

- Sprawdź czy `HUGGINGFACE_API_KEY` jest poprawnie skonfigurowany
- Logo generation jest opcjonalne - aplikacja działa bez niego
- Sprawdź konsolę przeglądarki (`F12`) dla szczegółowych błędów
- Hugging Face modele mają "zimny start" - pierwsze generowanie może trwać 10-20s
- Jeśli błąd 503 - model się ładuje, spróbuj ponownie za chwilę

### Błąd 429 (Too Many Requests)

- Groq ma limity free tier (~30 requestów/minutę)
- Hugging Face ma limity free tier (rate limiting na popularnych modelach)
- Odczekaj chwilę i spróbuj ponownie

### Kolory się powtarzają

- Sprawdź prompt w `app/api/generate-business/route.ts`
- AI powinno mieć instrukcję: "nie używaj powtarzających się kolorów jak #3B82F6"
- Czasem model może zignorować instrukcję - spróbuj ponownie

### Tab menu nie działa na mobile

- Upewnij się, że używasz najnowszej wersji kodu
- Tabs powinny być `flex-col` na mobile, `inline-flex` na desktop
- Sprawdź responsive breakpoints w Tailwind (`sm:`, `md:`)

---

## 🎨 Customizacja

### Zmiana modelu AI

W `app/api/generate-business/route.ts` możesz zmienić model:

```typescript
model: 'llama-3.3-70b-versatile',  // Szybki, kreatywny (domyślny)
// lub
model: 'llama-3.1-70b-versatile',  // Stabilniejszy
// lub
model: 'mixtral-8x7b-32768',       // Alternatywa
```

### Zmiana modelu generowania logo

W `app/api/generate-logo/route.ts`:

```typescript
// Stable Diffusion XL (najstabilniejszy, darmowy) - domyślny
"https://router.huggingface.co/hf-inference/models/stabilityai/stable-diffusion-xl-base-1.0"

// Alternatywy (również darmowe):
// Stable Diffusion 2.1 (szybszy, mniejsza jakość)
"https://router.huggingface.co/hf-inference/models/stabilityai/stable-diffusion-2-1"

// Dreamshaper (artystyczny styl)
"https://router.huggingface.co/hf-inference/models/Lykon/dreamshaper-8"
```

**Uwaga:** Hugging Face zmienił endpoint - użyj `router.huggingface.co/hf-inference` zamiast starego `api-inference.huggingface.co`

### Dodanie własnej sekcji

1. Stwórz komponent w `components/sections/MySection.tsx`
2. Dodaj agenta w `app/api/generate-business/route.ts`
3. Dodaj tab w `app/page.tsx`
4. Zaimportuj sekcję w switchu

---

## 📚 Przydatne Linki

- [Groq Documentation](https://console.groq.com/docs) - API docs dla multi-agent orchestration
- [Hugging Face Inference API](https://huggingface.co/docs/api-inference/index) - Darmowe API do generowania obrazów
- [Stable Diffusion XL Model](https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0) - Model używany do logo
- [Next.js 15 Docs](https://nextjs.org/docs) - Dokumentacja frameworka
- [Shadcn/ui Components](https://ui.shadcn.com/) - System komponentów UI
- [Tailwind CSS](https://tailwindcss.com/docs) - Utility-first CSS
- [Vercel Deployment](https://vercel.com/docs) - Deployment guide

---

## 💡 Pomysły na Rozbudowę

- [ ] **Historia projektów** – zapisuj wygenerowane pomysły w localStorage/baza danych
- [ ] **Eksport do PDF** – generuj brandbook jako PDF z logo i paletą kolorów
- [ ] **Porównanie wariantów** – AI generuje 2-3 alternatywne koncepcje
- [ ] **AI Image Generation** – wizualizacje produktu/strony (Flux, DALL-E)
- [ ] **Kolaboracja** – udostępniaj linki do wygenerowanych projektów
- [ ] **Feedback loop** – pozwól użytkownikowi doprecyzować wyniki
- [ ] **Landing page generator** – automatyczne generowanie kodu HTML/CSS
- [ ] **Social media preview** – jak będą wyglądać posty z tymi kolorami/logo
- [ ] **Internationalization** – wersja angielska/niemiecka/itp.
- [ ] **User accounts** – zapisywanie projektów w chmurze

---

## 🤝 Contributing

Pull requests mile widziane! W przypadku większych zmian, proszę najpierw otwórz issue.

### Development workflow:

1. Fork repo
2. Stwórz branch: `git checkout -b feature/amazing-feature`
3. Commit: `git commit -m 'Add amazing feature'`
4. Push: `git push origin feature/amazing-feature`
5. Otwórz Pull Request

---

## 📄 Licencja

MIT – rób co chcesz, eksperymentuj bez ograniczeń.

---

## 👨‍💻 Autor

**m-zeprzalka**

- GitHub: [@m-zeprzalka](https://github.com/m-zeprzalka)
- Repo: [ai-genesis](https://github.com/m-zeprzalka/ai-genesis)

---

**Zbudowane z 🎨 dla twórców, którzy chcą szybko zwalidować pomysł biznesowy bez płacenia agencji.**

Pytania? Otwórz Issue na GitHub.
