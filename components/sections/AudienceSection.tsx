"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface AudienceSectionProps {
  audience: {
    primaryPersona: {
      name: string
      age: string
      occupation: string
      painPoints: string[]
      goals: string[]
    }
    secondaryPersona: {
      name: string
      age: string
      occupation: string
      painPoints: string[]
      goals: string[]
    }
  }
}

export default function AudienceSection({ audience }: AudienceSectionProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Primary Persona */}
      <Card>
        <CardHeader>
          <Badge className="w-fit mb-2">Persona Główna</Badge>
          <CardTitle>{audience.primaryPersona.name}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {audience.primaryPersona.age} • {audience.primaryPersona.occupation}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2 text-sm">Problemy</h4>
            <ul className="space-y-1">
              {audience.primaryPersona.painPoints.map((point, idx) => (
                <li
                  key={idx}
                  className="text-sm text-muted-foreground flex items-start gap-2"
                >
                  <span className="text-destructive mt-1">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2 text-sm">Cele</h4>
            <ul className="space-y-1">
              {audience.primaryPersona.goals.map((goal, idx) => (
                <li
                  key={idx}
                  className="text-sm text-muted-foreground flex items-start gap-2"
                >
                  <span className="text-green-600 mt-1">✓</span>
                  <span>{goal}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Secondary Persona */}
      <Card>
        <CardHeader>
          <Badge variant="secondary" className="w-fit mb-2">
            Persona Drugorzędna
          </Badge>
          <CardTitle>{audience.secondaryPersona.name}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {audience.secondaryPersona.age} •{" "}
            {audience.secondaryPersona.occupation}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2 text-sm">Problemy</h4>
            <ul className="space-y-1">
              {audience.secondaryPersona.painPoints.map((point, idx) => (
                <li
                  key={idx}
                  className="text-sm text-muted-foreground flex items-start gap-2"
                >
                  <span className="text-destructive mt-1">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2 text-sm">Cele</h4>
            <ul className="space-y-1">
              {audience.secondaryPersona.goals.map((goal, idx) => (
                <li
                  key={idx}
                  className="text-sm text-muted-foreground flex items-start gap-2"
                >
                  <span className="text-green-600 mt-1">✓</span>
                  <span>{goal}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
