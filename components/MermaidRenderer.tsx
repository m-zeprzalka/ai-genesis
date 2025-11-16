"use client"

import { useEffect, useRef, useState } from "react"
import mermaid from "mermaid"

interface MermaidRendererProps {
  diagram: string
}

export default function MermaidRenderer({ diagram }: MermaidRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!diagram || !containerRef.current) return

    const renderDiagram = async () => {
      try {
        setError(null)

        // Inicjalizacja Mermaid
        mermaid.initialize({
          startOnLoad: false,
          theme: "default",
          securityLevel: "loose",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
        })

        // Czyszczenie poprzedniej zawartości
        if (containerRef.current) {
          containerRef.current.innerHTML = ""
        }

        // Tworzenie unikalnego ID dla diagramu
        const id = `mermaid-${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 9)}`

        // Renderowanie diagramu
        const { svg } = await mermaid.render(id, diagram)

        if (containerRef.current) {
          containerRef.current.innerHTML = svg
        }
      } catch (err: unknown) {
        console.error("Mermaid rendering error:", err)
        const errorMessage =
          err instanceof Error ? err.message : "Nieznany błąd"
        setError(errorMessage)

        if (containerRef.current) {
          containerRef.current.innerHTML = `
            <div class="text-red-600 p-4 bg-red-50 rounded-lg">
              <p class="font-semibold">Błąd renderowania diagramu</p>
              <p class="text-sm mt-2">${errorMessage}</p>
              <details class="mt-2">
                <summary class="cursor-pointer text-xs font-medium">Pokaż kod diagramu</summary>
                <pre class="text-xs mt-2 overflow-auto bg-white p-2 rounded border">${diagram}</pre>
              </details>
            </div>
          `
        }
      }
    }

    renderDiagram()
  }, [diagram])

  return (
    <div
      ref={containerRef}
      className="w-full overflow-auto flex justify-center items-center min-h-[200px]"
    />
  )
}
