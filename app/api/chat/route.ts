import { google } from "@ai-sdk/google";
import { streamText } from "ai";

export const maxDuration = 30;

export function errorHandler(error: unknown) {
  if (error == null) {
    return "unknown error";
  }
  if (typeof error === "string") {
    return error;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return JSON.stringify(error);
}

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: google("gemini-1.5-flash"),
    system:
      "Eres un asistente experto en catering y gestión de entregas. Responde de forma clara, profesional y útil sobre temas de catering, logística, organización de eventos, menús, tiempos de entrega y atención al cliente. Si la pregunta no está relacionada, redirige amablemente al tema de catering.",
    messages,
  });

  return result.toDataStreamResponse({
    getErrorMessage: errorHandler,
  });
}
