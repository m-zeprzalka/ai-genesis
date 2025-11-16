# 🧠 Syntarch – Myśl → Architektura

**Syntarch** to narzędzie AI do natychmiastowego projektowania architektury systemów. Opisujesz pomysł w języku naturalnym, a w odpowiedzi otrzymujesz:

- ✅ Pełny **tech stack** (frontend, backend, baza danych, auth)
- ✅ **Kluczowe komponenty** systemu z opisami
- ✅ **Wizualny diagram architektury** (Mermaid.js)

---

## 🚀 Dlaczego Syntarch?

- **Zero kosztów** – używa darmowego API Groq (Llama 3.3 70B)
- **Błyskawiczna odpowiedź** – Groq działa na własnych chipach LPU (sekundy, nie minuty)
- **Wizualizacja natychmiast** – diagram Mermaid renderowany w czasie rzeczywistym
- **Idealny do MVP** – eksperymentuj bez martwienia się o koszty API

---

## 📦 Instalacja i Uruchomienie

### 1. Sklonuj repozytorium

```bash
git clone <repo-url>
cd syntarch
```

### 2. Zainstaluj zależności

```bash
npm install
```

### 3. Zdobądź darmowy klucz API Groq

1. Wejdź na [console.groq.com](https://console.groq.com)
2. Zarejestruj się (całkowicie za darmo)
3. Przejdź do **API Keys** i wygeneruj nowy klucz

### 4. Skonfiguruj zmienne środowiskowe

Skopiuj plik `.env.example` na `.env.local`:

```bash
cp .env.example .env.local
```

Edytuj `.env.local` i wklej swój klucz:

```env
GROQ_API_KEY=twoj-klucz-tutaj
```

### 5. Uruchom aplikację

```bash
npm run dev
```

Otwórz [http://localhost:3000](http://localhost:3000) w przeglądarce.

---

## 🎯 Przykłady Użycia

### Przykład 1: Apka SaaS

**Prompt:**

```
Potrzebuję apki do śledzenia wydatków domowych z logowaniem przez Google i kategoriami
```

**Wynik:**

- **Tech Stack:** Next.js, Vercel Postgres, NextAuth.js
- **Komponenty:** User Auth Module, Expense Tracker, Category Manager
- **Diagram:** Przepływ danych od użytkownika → API → baza danych

### Przykład 2: System Analityczny

**Prompt:**

```
Chcę aplikację do analizy historycznych wyników lotto z panelem admina i publicznym API
```

**Wynik:**

- **Tech Stack:** FastAPI (Python), PostgreSQL, Next.js (Admin Panel)
- **Komponenty:** Web Scraper, Analysis Engine, REST API
- **Diagram:** Scraper → DB ← Admin Panel / Public API

### Przykład 3: AI-Powered Platform

**Prompt:**

```
System do symulacji efektów II rzędu dla decyzji biznesowych oparty na AI
```

**Wynik:**

- **Tech Stack:** React + D3.js, Node.js (WebSocket), Neo4j
- **Komponenty:** AI Simulation Core, Graph Visualizer, Scenario Manager
- **Diagram:** User Input → AI Engine → Graph DB → Visualization

---

## 🏗️ Architektura Projektu

```
syntarch/
├── app/
│   ├── api/
│   │   └── generate/
│   │       └── route.ts          # Backend API Route (Groq integration)
│   ├── page.tsx                  # Strona główna (UI + logika)
│   └── layout.tsx                # Layout aplikacji
├── components/
│   └── MermaidRenderer.tsx       # Komponent do renderowania diagramów
├── .env.local                    # Zmienne środowiskowe (NIE commituj!)
├── .env.example                  # Przykładowa konfiguracja
└── README.md                     # Ten plik
```

### Kluczowe Elementy:

- **`/api/generate`** – przyjmuje prompt, wysyła do Groq API, zwraca JSON z architekturą
- **`page.tsx`** – UI z textarea, obsługa stanu (loading, error, result)
- **`MermaidRenderer`** – renderuje kod Mermaid jako wizualny diagram

---

## 🌐 Deployment na Vercel

### 1. Wypchnij kod na GitHub

```bash
git add .
git commit -m "Initial Syntarch MVP"
git push origin main
```

### 2. Połącz z Vercel

1. Wejdź na [vercel.com](https://vercel.com)
2. Kliknij **New Project**
3. Zaimportuj swoje repozytorium GitHub
4. W ustawieniach projektu dodaj zmienną środowiskową:
   ```
   GROQ_API_KEY = twoj-klucz-tutaj
   ```
5. Kliknij **Deploy**

### 3. Gotowe!

Aplikacja działa globalnie na własnej domenie Vercel, **całkowicie za darmo**.

---

## 🧪 Stack Technologiczny

- **Frontend:** Next.js 15 (App Router, React Server Components)
- **Styling:** Tailwind CSS
- **AI Engine:** Groq API (Llama 3.3 70B)
- **Wizualizacja:** Mermaid.js
- **Deployment:** Vercel (Edge Functions)

---

## 🎨 Customizacja

### Zmiana modelu AI

W `app/api/generate/route.ts` możesz zmienić model:

```typescript
model: 'llama-3.3-70b-versatile',  // Szybki, uniwersalny
// lub
model: 'mixtral-8x7b-32768',       // Alternatywa
```

### Zmiana stylu diagramów

W `components/MermaidRenderer.tsx`:

```typescript
mermaid.initialize({
  theme: 'dark',  // 'default', 'forest', 'dark', 'neutral'
  ...
});
```

---

## 🐛 Troubleshooting

### Błąd: "GROQ_API_KEY nie jest skonfigurowany"

- Upewnij się, że plik `.env.local` istnieje
- Sprawdź, czy klucz jest poprawnie wklejony (bez spacji)
- Zrestartuj serwer dev (`npm run dev`)

### Diagram się nie renderuje

- Sprawdź konsolę przeglądarki (`F12`) dla błędów Mermaid
- AI czasem generuje niepoprawny kod – spróbuj innego promptu
- Upewnij się, że pakiet `mermaid` jest zainstalowany

### Błąd 429 (Too Many Requests)

- Groq ma limity free tier (~30 requestów/minutę)
- Odczekaj chwilę i spróbuj ponownie

---

## 📚 Przydatne Linki

- [Groq Documentation](https://console.groq.com/docs)
- [Mermaid.js Syntax](https://mermaid.js.org/intro/)
- [Next.js Docs](https://nextjs.org/docs)
- [Vercel Deployment](https://vercel.com/docs)

---

## 💡 Pomysły na Rozbudowę

- [ ] **Historia projektów** – zapisuj wygenerowane architektury w localStorage
- [ ] **Eksport do PDF** – generuj raport z diagramem i opisem
- [ ] **Porównanie wariantów** – AI generuje 2-3 alternatywne architektury
- [ ] **Cost Estimator** – szacuj koszt infrastruktury (AWS/GCP/Azure)
- [ ] **Kolaboracja** – udostępniaj linki do wygenerowanych projektów

---

## 📄 Licencja

MIT – rób co chcesz, eksperymentuj bez ograniczeń.

---

**Zbudowane z 🧠 podczas eksperymentu "Drogo = Zabójca Eksperymentów"**

Pytania? Otwórz Issue na GitHub.
