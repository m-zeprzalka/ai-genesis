"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface MarketingSectionProps {
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
}

export default function MarketingSection({ marketing }: MarketingSectionProps) {
  return (
    <div className="space-y-6">
      {/* Launch Campaign */}
      <Card>
        <CardHeader>
          <CardTitle>4-Week Launch Campaign</CardTitle>
          <p className="text-sm text-muted-foreground">
            Konkretny plan działań marketingowych
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Badge className="mb-2">Week 1</Badge>
            <p className="text-muted-foreground">
              {marketing.launchCampaign.week1}
            </p>
          </div>
          <Separator />
          <div>
            <Badge variant="secondary" className="mb-2">
              Week 2
            </Badge>
            <p className="text-muted-foreground">
              {marketing.launchCampaign.week2}
            </p>
          </div>
          <Separator />
          <div>
            <Badge variant="secondary" className="mb-2">
              Week 3
            </Badge>
            <p className="text-muted-foreground">
              {marketing.launchCampaign.week3}
            </p>
          </div>
          <Separator />
          <div>
            <Badge variant="outline" className="mb-2">
              Week 4
            </Badge>
            <p className="text-muted-foreground">
              {marketing.launchCampaign.week4}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Content Pillars */}
      <Card>
        <CardHeader>
          <CardTitle>Content Pillars</CardTitle>
          <p className="text-sm text-muted-foreground">Główne tematy treści</p>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-3">
            {marketing.contentPillars.map((pillar, idx) => (
              <div key={idx} className="p-4 border-2 rounded-lg">
                <div className="flex gap-3">
                  <Badge className="h-fit">{idx + 1}</Badge>
                  <p className="text-muted-foreground">{pillar}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Influencer Strategy */}
      <Card>
        <CardHeader>
          <CardTitle>Influencer Strategy</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {marketing.influencerStrategy}
          </p>
        </CardContent>
      </Card>

      {/* Paid Ads Copy */}
      <Card>
        <CardHeader>
          <CardTitle>Paid Ads Copy</CardTitle>
          <p className="text-sm text-muted-foreground">
            Gotowe kreacje reklamowe
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {marketing.paidAdsCopy.map((ad, idx) => (
            <div key={idx}>
              <Badge variant="outline" className="mb-3">
                {ad.platform}
              </Badge>
              <div className="bg-muted/50 p-4 rounded-lg border-2 space-y-2">
                <p className="font-bold text-lg">{ad.headline}</p>
                <p className="text-sm text-muted-foreground">{ad.body}</p>
              </div>
              {idx < marketing.paidAdsCopy.length - 1 && (
                <Separator className="mt-6" />
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* PR Strategy */}
      <Card>
        <CardHeader>
          <CardTitle>PR Strategy</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{marketing.prStrategy}</p>
        </CardContent>
      </Card>
    </div>
  )
}
