"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface BrandSectionProps {
  brand: {
    selectedName: string
    nameOptions: string[]
    brandStory: string
    voiceAndTone: string
    competitorPositioning: string
    coreValues: string[]
  }
}

export default function BrandSection({ brand }: BrandSectionProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Naming Options</CardTitle>
          <p className="text-sm text-muted-foreground">
            AI zaproponowało 5 opcji, wybrano najlepszą
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {brand.nameOptions.map((name, idx) => (
              <Badge
                key={idx}
                variant={name === brand.selectedName ? "default" : "outline"}
                className="text-base px-4 py-2"
              >
                {name}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Brand Story</CardTitle>
          <p className="text-sm text-muted-foreground">
            Emocjonalna narracja marki
          </p>
        </CardHeader>
        <CardContent>
          <p className="text-lg leading-relaxed">{brand.brandStory}</p>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Voice & Tone</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{brand.voiceAndTone}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Competitor Positioning</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {brand.competitorPositioning}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Core Values</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {brand.coreValues.map((value, idx) => (
              <Badge
                key={idx}
                variant="secondary"
                className="text-lg px-6 py-3"
              >
                {value}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
