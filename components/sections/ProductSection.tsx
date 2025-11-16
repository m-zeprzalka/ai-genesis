"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface ProductSectionProps {
  product: {
    problemStatement: string
    solution: string
    keyBenefits: string[]
    uniqueValueProposition: string
    pricingStrategy: string
    revenueModel: string
  }
}

export default function ProductSection({ product }: ProductSectionProps) {
  return (
    <div className="space-y-6">
      {/* Problem & Solution */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Problem Statement</CardTitle>
            <p className="text-sm text-muted-foreground">
              Jaki realny problem rozwiązujemy?
            </p>
          </CardHeader>
          <CardContent>
            <p className="text-lg leading-relaxed">
              {product.problemStatement}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Solution</CardTitle>
            <p className="text-sm text-muted-foreground">
              Jak nasz produkt to rozwiązuje?
            </p>
          </CardHeader>
          <CardContent>
            <p className="text-lg leading-relaxed">{product.solution}</p>
          </CardContent>
        </Card>
      </div>

      {/* Unique Value Proposition */}
      <Card className="border-2 border-primary">
        <CardHeader>
          <Badge className="w-fit mb-2">UVP</Badge>
          <CardTitle>Unique Value Proposition</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xl font-semibold leading-relaxed">
            {product.uniqueValueProposition}
          </p>
        </CardContent>
      </Card>

      {/* Key Benefits */}
      <Card>
        <CardHeader>
          <CardTitle>Key Benefits</CardTitle>
          <p className="text-sm text-muted-foreground">
            Korzyści dla użytkownika (nie funkcje!)
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {product.keyBenefits.map((benefit, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500/10 text-green-600 flex items-center justify-center font-bold">
                  ✓
                </div>
                <div className="flex-1">
                  <p className="text-muted-foreground">{benefit}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Business Model */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Pricing Strategy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{product.pricingStrategy}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Model</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{product.revenueModel}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
