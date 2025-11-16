"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface TechSectionProps {
  tech: {
    stack: string
    mvpTimeline: string
    estimatedBudget: string
    technicalRisks: string[]
  }
}

export default function TechSection({ tech }: TechSectionProps) {
  return (
    <div className="space-y-6">
      {/* Tech Stack */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended Tech Stack</CardTitle>
          <p className="text-sm text-muted-foreground">
            Prosty overview - bez zbędnych szczegółów
          </p>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-muted-foreground">{tech.stack}</p>
        </CardContent>
      </Card>

      {/* Timeline & Budget */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>MVP Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{tech.mvpTimeline}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estimated Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{tech.estimatedBudget}</p>
          </CardContent>
        </Card>
      </div>

      {/* Technical Risks */}
      <Card>
        <CardHeader>
          <CardTitle>Technical Risks</CardTitle>
          <p className="text-sm text-muted-foreground">
            Główne ryzyka techniczne
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {tech.technicalRisks.map((risk, idx) => (
              <div key={idx} className="flex gap-3">
                <Badge variant="destructive" className="h-fit">
                  {idx + 1}
                </Badge>
                <p className="text-muted-foreground flex-1">{risk}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
