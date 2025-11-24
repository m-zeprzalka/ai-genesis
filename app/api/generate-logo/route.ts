import { NextRequest, NextResponse } from "next/server"

export const runtime = "edge"
export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const { logoDescription } = await req.json()

    if (!logoDescription || typeof logoDescription !== "string") {
      return NextResponse.json(
        { error: "Logo description jest wymagany" },
        { status: 400 }
      )
    }

    const apiKey = process.env.HUGGINGFACE_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "HUGGINGFACE_API_KEY nie jest skonfigurowany. Dodaj klucz w .env.local",
        },
        { status: 500 }
      )
    }

    // Enhanced prompt dla lepszej jakości logo (vector style)
    const enhancedPrompt = `${logoDescription}, vector logo icon, flat design illustration, minimalist brand mark, svg style, simple geometric shapes, professional logo design, clean lines, monochromatic or 2 colors max, white background, centered, scalable icon, minimal line art, modern corporate identity`

    console.log("🎨 Generating logo with Hugging Face (FLUX.1-dev)...")

    // Hugging Face Router API - FLUX.1-dev (lepsza jakość niż schnell)
    const response = await fetch(
      "https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-dev",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: enhancedPrompt,
          parameters: {
            width: 1024,
            height: 1024,
            guidance_scale: 3.5,
            num_inference_steps: 28, // FLUX-dev używa więcej kroków dla lepszej jakości
          },
        }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Hugging Face API error:", errorText)

      // Jeśli model się ładuje (503), informuj użytkownika
      if (response.status === 503) {
        return NextResponse.json(
          {
            error: "Model się ładuje... Spróbuj ponownie za 20-30 sekund.",
          },
          { status: 503 }
        )
      }

      throw new Error(
        `Hugging Face API error: ${response.status} - ${errorText}`
      )
    }

    // Konwersja obrazu do base64
    const imageBuffer = await response.arrayBuffer()
    const base64Image = Buffer.from(imageBuffer).toString("base64")
    const imageUrl = `data:image/png;base64,${base64Image}`

    console.log("✅ Logo generated successfully with FLUX.1-dev!")

    return NextResponse.json({ imageUrl })
  } catch (error) {
    console.error("Logo generation error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Nieznany błąd",
      },
      { status: 500 }
    )
  }
}
