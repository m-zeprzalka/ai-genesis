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
            "HUGGINGFACE_API_KEY nie jest skonfigurowany - logo generation opcjonalne",
        },
        { status: 500 }
      )
    }

    // Enhanced prompt for logo generation
    const enhancedPrompt = `Professional minimalist logo design: ${logoDescription}. Clean, simple, modern, flat design, vector style, white background, high quality, professional branding, corporate identity`

    console.log("🎨 Generating logo with Stable Diffusion XL...")

    // Hugging Face Inference API - Stable Diffusion XL (DARMOWY i STABILNY!)
    // NOWY ENDPOINT: router.huggingface.co (stary api-inference już nie działa)
    const response = await fetch(
      "https://router.huggingface.co/hf-inference/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: enhancedPrompt,
          parameters: {
            num_inference_steps: 25,
            guidance_scale: 7.5,
          },
        }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Hugging Face API error:", errorText)

      // Model loading (503 jest OK - spróbuj ponownie)
      if (response.status === 503) {
        return NextResponse.json(
          {
            error:
              "Model jest w trakcie ładowania (zimny start). Spróbuj ponownie za 10-20 sekund.",
          },
          { status: 503 }
        )
      }

      throw new Error(`Hugging Face API error: ${response.status}`)
    }

    // Hugging Face zwraca bezpośrednio obraz jako blob
    const imageBlob = await response.blob()

    // Konwertuj blob na base64 data URL
    const arrayBuffer = await imageBlob.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString("base64")
    const imageUrl = `data:image/png;base64,${base64}`

    console.log("✅ Logo generated successfully!")

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
