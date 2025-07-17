import { google } from "@ai-sdk/google";
import { streamText } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: google("gemini-1.5-pro", {
      useSearchGrounding: true,
    }),
    system:
      "Eres un asistente experto en catering y gestión de entregas. Responde de forma clara, profesional y útil sobre temas de catering, logística, organización de eventos, menús, tiempos de entrega y atención al cliente. Si la pregunta no está relacionada, redirige amablemente al tema de catering.",
    messages,
  });

  return result.toDataStreamResponse();
}
