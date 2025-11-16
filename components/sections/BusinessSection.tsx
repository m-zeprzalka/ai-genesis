"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface BusinessSectionProps {
  business: {
    model: string
    pricing: string
    revenue: string[]
    competitors: string[]
  }
}

export default function BusinessSection({ business }: BusinessSectionProps) {
  return (
    <div className="space-y-6">
      {/* Business Model */}
      <Card>
        <CardHeader>
          <CardTitle>Model Biznesowy</CardTitle>
        </CardHeader>
        <CardContent>
          <Badge className="text-base px-4 py-2">{business.model}</Badge>
        </CardContent>
      </Card>

      {/* Pricing */}
      <Card>
        <CardHeader>
          <CardTitle>Strategia Cenowa</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-semibold">{business.pricing}</p>
        </CardContent>
      </Card>

      {/* Revenue Streams */}
      <Card>
        <CardHeader>
          <CardTitle>Źródła Przychodu</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {business.revenue.map((stream, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-green-600 mt-1">$</span>
                <span className="text-muted-foreground">{stream}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Competitors */}
      <Card>
        <CardHeader>
          <CardTitle>Konkurencja</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {business.competitors.map((competitor, idx) => (
              <Badge key={idx} variant="outline" className="text-sm">
                {competitor}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
