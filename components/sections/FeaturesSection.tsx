"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface FeaturesSectionProps {
  features: {
    mvp: Array<{ name: string; desc: string }>
    phase2: Array<{ name: string; desc: string }>
  }
}

export default function FeaturesSection({ features }: FeaturesSectionProps) {
  return (
    <div className="space-y-6">
      {/* MVP Features */}
      <Card>
        <CardHeader>
          <Badge className="w-fit mb-2">MVP (Minimum Viable Product)</Badge>
          <CardTitle>Funkcje Podstawowe</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {features.mvp.map((feature, idx) => (
              <AccordionItem key={idx} value={`mvp-${idx}`}>
                <AccordionTrigger className="text-left">
                  {feature.name}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {feature.desc}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Phase 2 Features */}
      <Card>
        <CardHeader>
          <Badge variant="secondary" className="w-fit mb-2">
            Faza 2
          </Badge>
          <CardTitle>Funkcje Rozszerzone</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {features.phase2.map((feature, idx) => (
              <AccordionItem key={idx} value={`phase2-${idx}`}>
                <AccordionTrigger className="text-left">
                  {feature.name}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {feature.desc}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  )
}
