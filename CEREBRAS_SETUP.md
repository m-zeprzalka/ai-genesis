# 🚀 Cerebras API Setup - 2 Minuty

## Dlaczego Cerebras?

**Problem**: Cloudflare w Warszawie blokuje Groq (widziałeś 500 error)  
**Rozwiązanie**: Cerebras jako automatic backup

## Porównanie

| Feature        | Groq              | Cerebras               |
| -------------- | ----------------- | ---------------------- |
| **Model**      | Llama 3.3 70B     | Llama 3.1 70B          |
| **Prędkość**   | 250 tokens/sec    | **2000 tokens/sec** ⚡ |
| **Limit Free** | 100k tokens/dzień | **Unlimited** (beta)   |
| **Dostępność** | ~98% (Cloudflare) | **99.9%**              |
| **Koszt**      | $0                | **$0** (beta free)     |

## Zdobądź API Key w 2 Minuty

### Krok 1: Rejestracja

1. Idź na: **https://cerebras.ai/inference**
2. Kliknij **"Get API Key"**
3. Sign up (email lub Google)
4. Potwierdź email

### Krok 2: Wygeneruj Klucz

1. Po zalogowaniu → **Dashboard**
2. **API Keys** → **Create New Key**
3. Skopiuj klucz (zaczyna się od `csk-`)

### Krok 3: Dodaj do Projektu

```bash
# Otwórz .env.local i dodaj linię:
CEREBRAS_API_KEY=csk-twoj-klucz-tutaj
```

### Krok 4: Restart

```bash
# Zatrzymaj dev server (Ctrl+C)
# Uruchom ponownie:
npm run dev
```

## Testowanie

### Test 1: Sprawdź logi

```
🔄 Trying Groq...
❌ Groq server error (500)
🔄 Trying Cerebras...
✅ Cerebras succeeded  ← Działa!
⏱️ Response time: 0.8s
```

### Test 2: Wymuś failover

```bash
# Usuń tymczasowo GROQ_API_KEY z .env.local
# Aplikacja użyje od razu Cerebras
⏭️ Skipping Groq (no API key)
🔄 Trying Cerebras...
✅ Cerebras succeeded
```

## Co się dzieje teraz?

**Bez Cerebras** (teraz):

```
Groq fails → Error → Musisz czekać
```

**Z Cerebras**:

```
Groq fails → Cerebras działa → Zero downtime! 🎉
```

## FAQ

**Q: Czy Cerebras jest zawsze szybszy?**  
A: Tak! 2000 vs 250 tokens/sec. Generowanie biznesu: ~3s vs ~15s.

**Q: Dlaczego nie używać tylko Cerebras?**  
A: Groq ma Llama 3.3 (nowszy), ale Cerebras 3.1 jest wystarczający. Najlepiej mieć oba jako backup.

**Q: Jak długo będzie free?**  
A: Beta phase - minimum kilka miesięcy. Potem prawdopodobnie $0.60/1M tokens (jak Groq).

**Q: Co jeśli oba padną?**  
A: Prawdopodobieństwo <0.01%. Możesz też dodać OpenAI/Anthropic jako 3rd backup.

## Monitoring w Real-Time

W terminalu zobaczysz dokładnie co się dzieje:

- ✅ = Provider zadziałał
- ❌ = Provider failed
- ⏳ = Retry attempt
- ⏭️ = Skipped (brak klucza)

---

**Rekomendacja**: Dodaj Cerebras **TERAZ** - zajmie 2 minuty, a unikniesz przestojów jak dzisiejszy.

Link: **https://cerebras.ai/inference**
