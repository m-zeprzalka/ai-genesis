"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface UXSectionProps {
  ux: {
    onboarding: string[]
    coreLoop: string[]
    retention: string[]
  }
}

export default function UXSection({ ux }: UXSectionProps) {
  return (
    <div className="space-y-6">
      {/* Onboarding */}
      <Card>
        <CardHeader>
          <CardTitle>Onboarding</CardTitle>
          <p className="text-sm text-muted-foreground">
            Pierwsze kroki użytkownika
          </p>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3">
            {ux.onboarding.map((step, idx) => (
              <li key={idx} className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold">
                  {idx + 1}
                </span>
                <span className="text-muted-foreground">{step}</span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* Core Loop */}
      <Card>
        <CardHeader>
          <CardTitle>Core Loop</CardTitle>
          <p className="text-sm text-muted-foreground">
            Główna pętla użytkowania
          </p>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3">
            {ux.coreLoop.map((step, idx) => (
              <li key={idx} className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center text-sm font-semibold">
                  {idx + 1}
                </span>
                <span className="text-muted-foreground">{step}</span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* Retention */}
      <Card>
        <CardHeader>
          <CardTitle>Retencja</CardTitle>
          <p className="text-sm text-muted-foreground">
            Mechanizmy zatrzymujące użytkownika
          </p>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {ux.retention.map((item, idx) => (
              <li key={idx} className="flex gap-3">
                <span className="text-green-600 flex-shrink-0">✓</span>
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
