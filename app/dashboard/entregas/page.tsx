"use client";

import { useChat } from "@ai-sdk/react";

export default function Page() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/chat",
  });

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-6 gap-6">
      <div className="w-full max-w-xl flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Gestión de Entregas - Chat AI</h1>
        <div className="border rounded bg-background p-4 h-80 overflow-y-auto flex flex-col gap-3">
          {messages.length === 0 && (
            <div className="text-muted-foreground text-center">
              Haz una pregunta sobre catering...
            </div>
          )}
          {messages.map(
            (message: { id: string; role: string; content: string }) => (
              <div
                key={message.id}
                className={
                  message.role === "user"
                    ? "self-end rounded-lg px-4 py-2 max-w-xs border bg-card text-card-foreground"
                    : "self-start rounded-lg px-4 py-2 max-w-xs border bg-muted text-muted-foreground"
                }
              >
                <span className="block text-xs font-semibold mb-1">
                  {message.role === "user" ? "Tú" : "Bot"}
                </span>
                {message.content}
              </div>
            )
          )}
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2 mt-2">
          <input
            name="prompt"
            value={input}
            onChange={handleInputChange}
            className="flex-1 border rounded px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Escribe tu pregunta sobre catering..."
            autoFocus
          />
          <button
            type="submit"
            className="px-4 py-2 rounded font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition"
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}
