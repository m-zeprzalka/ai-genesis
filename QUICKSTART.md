# Syntarch - Quick Start Guide

## 🎯 Co należy zrobić przed pierwszym uruchomieniem:

### 1. Zdobądź klucz API Groq (2 minuty):

- Wejdź na: https://console.groq.com
- Kliknij "Sign Up" (jeśli nie masz konta)
- Po zalogowaniu, przejdź do "API Keys"
- Kliknij "Create API Key"
- Skopiuj klucz (wyświetli się tylko raz!)

### 2. Skonfiguruj zmienne środowiskowe:

- Otwórz plik `.env.local` w katalogu projektu
- Zamień `your-groq-api-key-here` na swój klucz
- Zapisz plik

### 3. Uruchom projekt:

```bash
npm run dev
```

### 4. Otwórz w przeglądarce:

- http://localhost:3000

### 5. Testuj!

Przykładowe prompty do wypróbowania:

- "Chcę zrobić klon Tindera dla właścicieli psów"
- "Apka do śledzenia wydatków z logowaniem przez Google"
- "System do analizy wyników lotto z API dla deweloperów"
- "Platforma do streamingu muzyki jak Spotify"

---

## 🐛 Najczęstsze problemy:

**Problem:** "GROQ_API_KEY nie jest skonfigurowany"

- **Rozwiązanie:** Upewnij się, że plik `.env.local` istnieje i zawiera klucz API

**Problem:** "Cannot find module 'mermaid'"

- **Rozwiązanie:** Uruchom `npm install`

**Problem:** Diagram się nie wyświetla

- **Rozwiązanie:** Sprawdź konsolę przeglądarki (F12) - AI czasem generuje niepoprawny kod Mermaid

---

## 📋 Następne kroki (opcjonalne):

- [ ] Wypchnij projekt na GitHub
- [ ] Wdróż na Vercel (patrz: README.md, sekcja Deployment)
- [ ] Dodaj własne style
- [ ] Rozbuduj funkcjonalność (historia projektów, eksport do PDF, etc.)

---

**Gotowe! Teraz masz działający generator architektury za 0 zł.**
